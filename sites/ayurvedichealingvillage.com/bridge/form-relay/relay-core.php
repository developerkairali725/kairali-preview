<?php
/**
 * AHV form relay — core (protocol AHV-RELAY-V1, see SPEC.md).
 *
 * Runs on the database host. The website (Vercel) never talks to MySQL: it
 * sends one HMAC-signed HTTPS request per accepted form to this relay, which
 * writes to MySQL over the loopback interface only.
 *
 * Guarantees, each enforced below and covered by bridge/form-relay/test/:
 *  - POST over HTTPS only. There is no plain-HTTP mode and no switch for one.
 *  - Every request is authenticated: HMAC-SHA256 over method, path, timestamp,
 *    nonce and the SHA-256 of the exact body, with a +/- skew window and a
 *    single-use nonce (replays are refused).
 *  - Every response after authentication is HMAC-signed back, so the website
 *    never mistakes a proxy error page or a captive portal for "stored".
 *  - The client never sends SQL or identifiers it chose: table and column names
 *    come only from lead-schema.json; every value is a bound parameter.
 *  - Strict payload schema: unknown tables, unknown columns, non-scalar values,
 *    over-long strings, NUL bytes, bad tokens and bad IPs are refused.
 *  - Rate limits: a global per-minute ceiling on authenticated requests and a
 *    per-submitter-IP ceiling per table (the same 5 per 10 minutes the website
 *    enforced when it talked to MySQL directly).
 *  - Idempotent by submission_token: a retry returns the stored row, never a
 *    second row.
 *  - Newsletter double opt-in ops (newsletter.*) write ONLY the three dedicated
 *    newsletter tables (newsletter-tables.sql), never a lead table; tokens
 *    arrive as a SHA-256 hash plus a seal the relay cannot open; limits are
 *    atomic keyed counters; one global lock order with deadlock retry;
 *    consume is single-use and atomic. See SPEC.md "Newsletter".
 *  - No database error text, SQL or submitted value ever leaves this file, in a
 *    response or in the error log.
 *
 * Compatible with PHP 7.4+ (shared hosts), needs pdo_mysql and hash.
 */
declare(strict_types=1);

const AHV_RELAY_PROTOCOL = 'AHV-RELAY-V1';
const AHV_RELAY_MAX_BODY = 65536;
const AHV_RELAY_TOKEN_RE = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/';
const AHV_RELAY_NONCE_RE = '/^[A-Za-z0-9_-]{22,64}$/';
const AHV_RELAY_KEY_ID_RE = '/^[A-Za-z0-9_-]{1,32}$/';
const AHV_RELAY_MIN_SECRET = 32;
const AHV_RELAY_LOOPBACK = ['127.0.0.1', 'localhost', '::1'];

function ahv_relay_load_schema(string $path): array
{
    $raw = @file_get_contents($path);
    if ($raw === false) throw new RuntimeException('schema unreadable');
    $schema = json_decode($raw, true);
    if (!is_array($schema) || !isset($schema['tables']) || !is_array($schema['tables'])) {
        throw new RuntimeException('schema invalid');
    }
    return $schema;
}

/** Validates operator configuration. Returns null when usable, else a short reason code. */
function ahv_relay_config_problem(array $config, array $schema): ?string
{
    $db = isset($config['db']) && is_array($config['db']) ? $config['db'] : [];
    foreach (['host', 'name', 'user', 'password'] as $key) {
        if (!isset($db[$key]) || !is_string($db[$key]) || $db[$key] === '') return 'db_' . $key . '_missing';
    }
    if ($db['name'] !== $schema['database']) return 'wrong_database';
    // The whole point of the relay: MySQL is reached over loopback only (or a
    // local unix socket). A remote host would reintroduce the plaintext hop.
    $socket = isset($db['socket']) && is_string($db['socket']) ? $db['socket'] : '';
    if ($socket === '' && !in_array(strtolower($db['host']), AHV_RELAY_LOOPBACK, true)) return 'db_not_loopback';
    $keys = isset($config['keys']) && is_array($config['keys']) ? $config['keys'] : [];
    if (!$keys) return 'no_keys';
    foreach ($keys as $id => $secret) {
        if (!is_string($id) || !preg_match(AHV_RELAY_KEY_ID_RE, $id)) return 'bad_key_id';
        if (!is_string($secret) || strlen($secret) < AHV_RELAY_MIN_SECRET) return 'weak_key';
    }
    return null;
}

function ahv_relay_canonical_request(string $keyId, string $timestamp, string $nonce, string $method, string $path, string $body): string
{
    return implode("\n", [AHV_RELAY_PROTOCOL, $keyId, $timestamp, $nonce, strtoupper($method), $path, hash('sha256', $body)]);
}

function ahv_relay_canonical_response(string $keyId, string $nonce, int $status, string $body): string
{
    return implode("\n", [AHV_RELAY_PROTOCOL . '-RESPONSE', $keyId, $nonce, (string) $status, hash('sha256', $body)]);
}

function ahv_relay_sign(string $secret, string $canonical): string
{
    return hash_hmac('sha256', $canonical, $secret);
}

function ahv_relay_is_https(array $server): bool
{
    $https = isset($server['HTTPS']) ? strtolower((string) $server['HTTPS']) : '';
    if ($https !== '' && $https !== 'off') return true;
    return isset($server['REQUEST_SCHEME']) && strtolower((string) $server['REQUEST_SCHEME']) === 'https';
}

function ahv_relay_header(array $server, string $name): string
{
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    return isset($server[$key]) ? trim((string) $server[$key]) : '';
}

/**
 * Transport + signature checks. Does NOT touch the database (the nonce is
 * recorded by the caller only after this passes, so unauthenticated traffic
 * cannot fill the nonce table).
 * @return array{ok:bool,status?:int,code?:string,keyId?:string,nonce?:string,secret?:string}
 */
function ahv_relay_authenticate(array $server, string $body, array $config, int $now): array
{
    $method = isset($server['REQUEST_METHOD']) ? strtoupper((string) $server['REQUEST_METHOD']) : '';
    if ($method !== 'POST') return ['ok' => false, 'status' => 405, 'code' => 'METHOD_NOT_ALLOWED'];
    if (!ahv_relay_is_https($server)) return ['ok' => false, 'status' => 403, 'code' => 'HTTPS_REQUIRED'];
    $type = isset($server['CONTENT_TYPE']) ? strtolower((string) $server['CONTENT_TYPE']) : '';
    if (strpos($type, 'application/json') !== 0) return ['ok' => false, 'status' => 415, 'code' => 'INVALID_REQUEST'];
    if ($body === '' || strlen($body) > AHV_RELAY_MAX_BODY) return ['ok' => false, 'status' => 413, 'code' => 'INVALID_REQUEST'];

    $keyId = ahv_relay_header($server, 'X-AHV-Key-Id');
    $timestamp = ahv_relay_header($server, 'X-AHV-Timestamp');
    $nonce = ahv_relay_header($server, 'X-AHV-Nonce');
    $signature = strtolower(ahv_relay_header($server, 'X-AHV-Signature'));
    if (!preg_match(AHV_RELAY_KEY_ID_RE, $keyId) || !preg_match('/^\d{9,11}$/', $timestamp)
        || !preg_match(AHV_RELAY_NONCE_RE, $nonce) || !preg_match('/^[0-9a-f]{64}$/', $signature)) {
        return ['ok' => false, 'status' => 401, 'code' => 'UNAUTHENTICATED'];
    }
    $skew = isset($config['clock_skew_seconds']) ? (int) $config['clock_skew_seconds'] : 300;
    if ($skew < 30 || $skew > 900) $skew = 300;
    if (abs($now - (int) $timestamp) > $skew) return ['ok' => false, 'status' => 401, 'code' => 'STALE_REQUEST'];

    $keys = isset($config['keys']) && is_array($config['keys']) ? $config['keys'] : [];
    if (!isset($keys[$keyId]) || !is_string($keys[$keyId]) || strlen($keys[$keyId]) < AHV_RELAY_MIN_SECRET) {
        return ['ok' => false, 'status' => 401, 'code' => 'UNAUTHENTICATED'];
    }
    $path = isset($server['REQUEST_URI']) ? (string) parse_url((string) $server['REQUEST_URI'], PHP_URL_PATH) : '';
    $expected = ahv_relay_sign($keys[$keyId], ahv_relay_canonical_request($keyId, $timestamp, $nonce, $method, $path, $body));
    if (!hash_equals($expected, $signature)) return ['ok' => false, 'status' => 401, 'code' => 'UNAUTHENTICATED'];
    return ['ok' => true, 'keyId' => $keyId, 'nonce' => $nonce, 'secret' => $keys[$keyId]];
}

function ahv_relay_strlen(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function ahv_relay_max_length(array $schema, string $column): int
{
    return in_array($column, $schema['longTextColumns'], true) ? (int) $schema['longTextMaxLength'] : (int) $schema['defaultMaxLength'];
}

/**
 * Strict schema validation of a lead.store payload.
 * @return array{ok:bool,code?:string,field?:string,table?:string,token?:string,columns?:array,params?:array,consent?:bool,submitIp?:string}
 */
function ahv_relay_validate_lead($data, array $schema): array
{
    if (!is_array($data)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'data'];
    $allowedTop = ['table', 'submission_token', 'site', 'form_type', 'submit_ip', 'values', 'tracking'];
    foreach (array_keys($data) as $key) {
        if (!in_array($key, $allowedTop, true)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => (string) $key];
    }
    $table = isset($data['table']) && is_string($data['table']) ? $data['table'] : '';
    if (!isset($schema['tables'][$table])) return ['ok' => false, 'code' => 'UNKNOWN_FORM'];
    $token = isset($data['submission_token']) && is_string($data['submission_token']) ? strtolower($data['submission_token']) : '';
    if (!preg_match(AHV_RELAY_TOKEN_RE, $token)) return ['ok' => false, 'code' => 'INVALID_SUBMISSION'];
    if (!isset($data['site']) || $data['site'] !== $schema['site']) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'site'];
    if (!isset($data['form_type']) || $data['form_type'] !== $table) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'form_type'];
    $submitIp = isset($data['submit_ip']) && is_string($data['submit_ip']) ? trim($data['submit_ip']) : '';
    if ($submitIp !== '' && filter_var($submitIp, FILTER_VALIDATE_IP) === false) {
        return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'submit_ip'];
    }

    $columns = ['site', 'form_type', 'submit_ip', 'submission_token'];
    $params = [$schema['site'], $table, $submitIp, $token];
    $consent = false;

    $values = isset($data['values']) ? $data['values'] : [];
    if (!is_array($values) || ($values && array_keys($values) === range(0, count($values) - 1))) {
        return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'values'];
    }
    $allowed = $schema['tables'][$table];
    foreach ($values as $column => $value) {
        $column = (string) $column;
        if (!in_array($column, $allowed, true)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => $column];
        if (in_array($column, $schema['booleanColumns'], true)) {
            if (!is_bool($value)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => $column];
            if ($column === 'consent') { $consent = $value; continue; }
            $columns[] = $column; $params[] = $value ? 1 : 0;
            continue;
        }
        if ($value === null) { $columns[] = $column; $params[] = null; continue; }
        if (is_int($value) || is_float($value)) $value = (string) $value;
        if (!is_string($value)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => $column];
        if (strpos($value, "\0") !== false || !preg_match('//u', $value)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => $column];
        if (ahv_relay_strlen($value) > ahv_relay_max_length($schema, $column)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => $column];
        $columns[] = $column; $params[] = $value;
    }
    if (in_array('consent', $allowed, true)) {
        // consent_at is set by the database clock, never by the client.
        $columns[] = 'consent'; $params[] = $consent ? 1 : 0;
    }

    $tracking = isset($data['tracking']) ? $data['tracking'] : [];
    if (!is_array($tracking)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'tracking'];
    foreach ($tracking as $key => $value) {
        if (!isset($schema['trackingColumns'][(string) $key])) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => (string) $key];
        if (!is_string($value) || strpos($value, "\0") !== false || !preg_match('//u', $value)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => (string) $key];
    }
    foreach ($schema['trackingColumns'] as $key => $max) {
        $value = isset($tracking[$key]) ? $tracking[$key] : '';
        if (ahv_relay_strlen($value) > (int) $max) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => $key];
        $columns[] = $key; $params[] = $value;
    }
    return ['ok' => true, 'table' => $table, 'token' => $token, 'columns' => $columns, 'params' => $params, 'consent' => $consent, 'submitIp' => $submitIp];
}

function ahv_relay_ident(string $name): string
{
    return '`' . str_replace('`', '``', $name) . '`';
}

function ahv_relay_is_duplicate(Throwable $error): bool
{
    if (!($error instanceof PDOException)) return false;
    $info = $error->errorInfo;
    return is_array($info) && isset($info[1]) && (int) $info[1] === 1062;
}

function ahv_relay_read_row(PDO $pdo, string $table, string $token): ?array
{
    $statement = $pdo->prepare('SELECT * FROM ' . ahv_relay_ident($table) . ' WHERE `submission_token` = ? LIMIT 1');
    $statement->execute([$token]);
    $row = $statement->fetch(PDO::FETCH_ASSOC);
    if (!$row) return null;
    $out = [];
    foreach ($row as $key => $value) $out[(string) $key] = $value === null ? null : (string) $value;
    return $out;
}

/** @return array{status:int,body:array} */
function ahv_relay_store_lead(PDO $pdo, array $valid, array $schema): array
{
    $table = $valid['table'];
    $existing = ahv_relay_read_row($pdo, $table, $valid['token']);
    if ($existing) return ['status' => 200, 'body' => ['ok' => true, 'alreadyStored' => true, 'row' => $existing]];

    if ($valid['submitIp'] !== '') {
        $window = max(1, (int) $schema['rateLimit']['windowMinutes']);
        $count = $pdo->prepare('SELECT COUNT(*) FROM ' . ahv_relay_ident($table)
            . ' WHERE `submit_ip` = ? AND `submit_time` >= (UTC_TIMESTAMP() - INTERVAL ' . $window . ' MINUTE)');
        $count->execute([$valid['submitIp']]);
        if ((int) $count->fetchColumn() >= (int) $schema['rateLimit']['perIpPerTable']) {
            return ['status' => 429, 'body' => ['ok' => false, 'code' => 'RATE_LIMITED']];
        }
    }

    $columns = $valid['columns'];
    $placeholders = array_fill(0, count($columns), '?');
    if (in_array('consent', $columns, true)) {
        $columns[] = 'consent_at';
        $placeholders[] = $valid['consent'] ? 'UTC_TIMESTAMP()' : 'NULL';
    }
    $sql = 'INSERT INTO ' . ahv_relay_ident($table)
        . ' (' . implode(',', array_map('ahv_relay_ident', $columns)) . ') VALUES (' . implode(',', $placeholders) . ')';
    try {
        $pdo->prepare($sql)->execute($valid['params']);
    } catch (Throwable $error) {
        if (!ahv_relay_is_duplicate($error)) throw $error;
        $duplicate = ahv_relay_read_row($pdo, $table, $valid['token']);
        if (!$duplicate) throw $error;
        return ['status' => 200, 'body' => ['ok' => true, 'alreadyStored' => true, 'row' => $duplicate]];
    }
    $row = ahv_relay_read_row($pdo, $table, $valid['token']);
    if (!$row) throw new RuntimeException('stored row could not be read back');
    return ['status' => 200, 'body' => ['ok' => true, 'alreadyStored' => false, 'row' => $row]];
}

/** Schema and full-column uniqueness readiness report. Reads no submitted data. */
function ahv_relay_health(PDO $pdo, array $schema): array
{
    $report = [];
    $columnsQuery = $pdo->prepare('SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?');
    $uniqueQuery = $pdo->prepare("SELECT INDEX_NAME, COLUMN_NAME, SUB_PART FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND NON_UNIQUE = 0 ORDER BY INDEX_NAME, SEQ_IN_INDEX");
    $tables = $schema['tables'];
    $tables['ahv_relay_nonce'] = ['nonce', 'key_id', 'seen_at'];
    foreach ($tables as $table => $fields) {
        $columnsQuery->execute([$table]);
        $have = array_map('strval', $columnsQuery->fetchAll(PDO::FETCH_COLUMN));
        if ($table === 'ahv_relay_nonce') {
            $need = $fields;
        } else {
            $need = array_merge(['id', 'site', 'form_type', 'submit_ip', 'submission_token', 'submit_time'], $fields, array_keys($schema['trackingColumns']));
            if (in_array('consent', $fields, true)) $need[] = 'consent_at';
        }
        $entry = ['exists' => count($have) > 0, 'missingColumns' => array_values(array_diff(array_unique($need), $have))];
        // A composite index containing the token does not make the token unique.
        // Inspect the complete index, and reject prefix-only uniqueness as well.
        $uniqueQuery->execute([$table]);
        $indexes = [];
        foreach ($uniqueQuery->fetchAll(PDO::FETCH_ASSOC) as $index) {
            $indexes[(string) $index['INDEX_NAME']][] = $index;
        }
        $uniqueColumn = $table === 'ahv_relay_nonce' ? 'nonce' : 'submission_token';
        $uniqueFlag = $table === 'ahv_relay_nonce' ? 'nonceUnique' : 'submissionTokenUnique';
        $entry[$uniqueFlag] = false;
        foreach ($indexes as $indexColumns) {
            if (count($indexColumns) === 1
                && $indexColumns[0]['COLUMN_NAME'] === $uniqueColumn
                && $indexColumns[0]['SUB_PART'] === null) {
                $entry[$uniqueFlag] = true;
                break;
            }
        }
        $report[$table] = $entry;
    }
    $ready = true;
    foreach ($report as $table => $entry) {
        if (!$entry['exists'] || $entry['missingColumns']
            || (isset($entry['submissionTokenUnique']) && !$entry['submissionTokenUnique'])
            || (isset($entry['nonceUnique']) && !$entry['nonceUnique'])) $ready = false;
    }
    return ['ok' => true, 'ready' => $ready, 'protocol' => AHV_RELAY_PROTOCOL, 'tables' => $report];
}

// ───────────────────────────── Newsletter (double opt-in) ─────────────────────────────
// Ops newsletter.subscribe | newsletter.mail_result | newsletter.claim | newsletter.confirm |
// newsletter.unsubscribe (SPEC.md "Newsletter"). Three dedicated tables (newsletter-tables.sql); the
// identifiers below are the ONLY ones these ops put into SQL and every value is a bound parameter.
// Timestamps come from the relay clock ($now, UTC) and are bound, never taken from the client. The
// website sends the SHA-256 of each confirmation token plus the token SEALED with a key the relay does
// not hold; the relay never sees, stores or returns a raw token.
//
// Concurrency (MySQL/InnoDB): one global lock order — limit rows (ip, then email) → subscriber row →
// confirmation rows — in every transaction; single-row writes outside it are autocommit; possibly-missing
// rows are never locked with SELECT … FOR UPDATE (no gap-lock deadlocks); and every transaction is retried
// a bounded number of times on deadlock / lock-wait timeout.

const AHV_NL_SUBSCRIBER = 'ahv_newsletter_subscriber';
const AHV_NL_CONFIRMATION = 'ahv_newsletter_confirmation';
const AHV_NL_LIMIT = 'ahv_newsletter_limit';
const AHV_NL_HASH_RE = '/^[0-9a-f]{64}$/';
const AHV_NL_PUBLIC_ID_RE = '/^[0-9a-f]{32}$/';
const AHV_NL_SEALED_RE = '/^v1\.[A-Za-z0-9_-]{40,190}$/';
const AHV_NL_TX_ATTEMPTS = 4;
// Same pattern as lib/newsletter.ts (EMAIL_RE): ASCII addresses with a dotted domain.
const AHV_NL_EMAIL_RE = '/^[A-Za-z0-9.!#$%&\'*+\/=?^_`{|}~-]{1,64}@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/';
// Same-site relative path only: never a URL, never protocol-relative, no dot segments.
const AHV_NL_PATH_RE = '/^\/(?!\/)[A-Za-z0-9\/._~%-]*$/';

function ahv_nl_time(int $epoch): string
{
    return gmdate('Y-m-d H:i:s', $epoch);
}

function ahv_nl_epoch(string $datetime): int
{
    return (int) strtotime($datetime . ' UTC');
}

function ahv_nl_mysql(PDO $pdo): bool
{
    return $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql';
}

/** MySQL row lock inside the transaction; the SQLite test double serializes writers anyway. */
function ahv_nl_lock(PDO $pdo): string
{
    return ahv_nl_mysql($pdo) ? ' FOR UPDATE' : '';
}

function ahv_nl_is_duplicate(Throwable $error): bool
{
    if (ahv_relay_is_duplicate($error)) return true;
    if (!($error instanceof PDOException)) return false;
    $info = $error->errorInfo;
    return is_array($info) && isset($info[0], $info[1]) && $info[0] === '23000' && (int) $info[1] === 19;
}

/** Deadlock (1213) / lock-wait timeout (1205) on MySQL; SQLITE_BUSY/LOCKED (5/6) on the test double. */
function ahv_nl_is_retryable(Throwable $error): bool
{
    if (!($error instanceof PDOException)) return false;
    $info = $error->errorInfo;
    $code = is_array($info) && isset($info[1]) ? (int) $info[1] : 0;
    return in_array($code, [1213, 1205], true) || (($info[0] ?? '') === 'HY000' && in_array($code, [5, 6], true));
}

/**
 * Runs $fn in a transaction; commits what it returns; retries the WHOLE unit on deadlock / lock-wait
 * timeout (bounded, jittered). Any other error rolls back and propagates.
 */
function ahv_nl_transaction(PDO $pdo, callable $fn)
{
    for ($attempt = 1; ; $attempt++) {
        $pdo->beginTransaction();
        try {
            $result = $fn();
            $pdo->commit();
            return $result;
        } catch (Throwable $error) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            if ($attempt < AHV_NL_TX_ATTEMPTS && ahv_nl_is_retryable($error)) {
                usleep(random_int(10000, 60000) * $attempt);
                continue;
            }
            throw $error;
        }
    }
}

/** A single autocommit statement with the same bounded retry. */
function ahv_nl_exec(PDO $pdo, string $sql, array $params): PDOStatement
{
    for ($attempt = 1; ; $attempt++) {
        try {
            $statement = $pdo->prepare($sql);
            $statement->execute($params);
            return $statement;
        } catch (Throwable $error) {
            if ($attempt < AHV_NL_TX_ATTEMPTS && ahv_nl_is_retryable($error)) {
                usleep(random_int(10000, 60000) * $attempt);
                continue;
            }
            throw $error;
        }
    }
}

function ahv_nl_valid_email(string $email, int $max): bool
{
    if ($email === '' || strlen($email) > $max || !preg_match(AHV_NL_EMAIL_RE, $email)) return false;
    $local = substr($email, 0, (int) strrpos($email, '@'));
    return $local[0] !== '.' && substr($local, -1) !== '.' && strpos($local, '..') === false;
}

function ahv_nl_valid_path(string $path, int $max): bool
{
    return $path !== '' && strlen($path) <= $max && preg_match(AHV_NL_PATH_RE, $path) === 1
        && !preg_match('#(^|/)\.\.?(/|$)#', $path);
}

/** @return array{ok:bool,code?:string,field?:string} */
function ahv_nl_only_keys($data, array $allowed): array
{
    if (!is_array($data) || ($data && array_keys($data) === range(0, count($data) - 1))) {
        return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'data'];
    }
    foreach (array_keys($data) as $key) {
        if (!in_array((string) $key, $allowed, true)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => (string) $key];
    }
    foreach ($data as $key => $value) {
        if (!is_string($value) && !is_int($value)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => (string) $key];
        if (is_string($value) && (strpos($value, "\0") !== false || !preg_match('//u', $value))) {
            return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => (string) $key];
        }
    }
    return ['ok' => true];
}

function ahv_nl_bad(array $shape): array
{
    $out = ['ok' => false, 'code' => $shape['code'] ?? 'SCHEMA_VIOLATION'];
    if (isset($shape['field'])) $out['field'] = $shape['field'];
    return ['status' => 400, 'body' => $out];
}

/**
 * Strict validation of a newsletter.subscribe payload. The consent text is taken from the schema by
 * version — the client never supplies the wording that is later recorded as consent evidence.
 */
function ahv_relay_newsletter_validate_subscribe($data, array $nl): array
{
    $shape = ahv_nl_only_keys($data, ['email', 'consent_version', 'consent_locale', 'source_path', 'submit_ip', 'token_hash', 'token_sealed']);
    if (!$shape['ok']) return $shape;
    $str = function (string $key) use ($data): string { return isset($data[$key]) && is_string($data[$key]) ? $data[$key] : ''; };
    $email = strtolower(trim($str('email')));
    if (!ahv_nl_valid_email($email, (int) $nl['maxEmailLength'])) return ['ok' => false, 'code' => 'INVALID_EMAIL'];
    $version = $str('consent_version');
    if (!isset($nl['consentVersions'][$version]) || !is_string($nl['consentVersions'][$version])) {
        return ['ok' => false, 'code' => 'UNKNOWN_CONSENT_VERSION'];
    }
    $locale = $str('consent_locale');
    if (!in_array($locale, $nl['locales'], true)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'consent_locale'];
    $path = $str('source_path');
    if (!ahv_nl_valid_path($path, (int) $nl['maxSourcePathLength'])) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'source_path'];
    $ip = trim($str('submit_ip'));
    if ($ip !== '' && filter_var($ip, FILTER_VALIDATE_IP) === false) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'submit_ip'];
    $tokenHash = $str('token_hash');
    if (!preg_match(AHV_NL_HASH_RE, $tokenHash)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'token_hash'];
    $sealed = $str('token_sealed');
    if (!preg_match(AHV_NL_SEALED_RE, $sealed)) return ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'token_sealed'];
    return ['ok' => true, 'email' => $email, 'version' => $version, 'text' => $nl['consentVersions'][$version],
        'locale' => $locale, 'path' => $path, 'ip' => $ip, 'tokenHash' => $tokenHash, 'sealed' => $sealed];
}

/** Creates a limit row if it does not exist yet (autocommit, never inside a transaction). */
function ahv_nl_ensure_limit(PDO $pdo, string $kind, string $subject, string $ts): void
{
    $sql = 'INSERT INTO ' . ahv_relay_ident(AHV_NL_LIMIT) . ' (`kind`, `subject_hash`, `window_start`, `hits`) VALUES (?, ?, ?, 0)'
        . (ahv_nl_mysql($pdo) ? ' ON DUPLICATE KEY UPDATE `hits` = `hits`' : ' ON CONFLICT(`kind`, `subject_hash`) DO NOTHING');
    ahv_nl_exec($pdo, $sql, [$kind, $subject, $ts]);
}

/** Locks one existing limit row and returns its effective window: [windowStartEpoch, hits]. */
function ahv_nl_lock_limit(PDO $pdo, string $kind, string $subject, int $now, int $window): array
{
    $q = $pdo->prepare('SELECT `window_start`, `hits` FROM ' . ahv_relay_ident(AHV_NL_LIMIT) . ' WHERE `kind` = ? AND `subject_hash` = ?' . ahv_nl_lock($pdo));
    $q->execute([$kind, $subject]);
    $row = $q->fetch(PDO::FETCH_ASSOC);
    if (!$row) throw new RuntimeException('limit row missing');
    $start = ahv_nl_epoch((string) $row['window_start']);
    return $now - $start >= $window ? [$now, 0] : [$start, (int) $row['hits']];
}

function ahv_nl_store_limit(PDO $pdo, string $kind, string $subject, array $state): void
{
    $pdo->prepare('UPDATE ' . ahv_relay_ident(AHV_NL_LIMIT) . ' SET `window_start` = ?, `hits` = ? WHERE `kind` = ? AND `subject_hash` = ?')
        ->execute([ahv_nl_time($state[0]), $state[1] + 1, $kind, $subject]);
}

/**
 * newsletter.subscribe — one pending lifecycle per address, and the durable recoverable mail job (with
 * the sealed token) committed before the website sends anything. Answers only {send, confirmation_id}:
 * never whether the address was already pending, confirmed or unsubscribed (no subscriber enumeration).
 */
function ahv_relay_newsletter_subscribe(PDO $pdo, array $v, array $nl, int $now): array
{
    $limits = $nl['limits'];
    $outbox = $nl['outbox'];
    $ts = ahv_nl_time($now);
    $emailHash = hash('sha256', $v['email']);
    $emailKey = hash('sha256', 'email|' . $emailHash);
    $ipKey = $v['ip'] !== '' ? hash('sha256', 'ip|' . $v['ip']) : '';
    if ($ipKey !== '') ahv_nl_ensure_limit($pdo, 'ip', $ipKey, $ts);
    ahv_nl_ensure_limit($pdo, 'email', $emailKey, $ts);

    $ttlHours = max(1, (int) $nl['confirmationTtlHours']);

    return ahv_nl_transaction($pdo, function () use ($pdo, $v, $limits, $outbox, $now, $ts, $emailHash, $emailKey, $ipKey, $ttlHours) {
        // Atomic abuse limits: the keyed counter rows are locked (ip, then email) and checked BEFORE any
        // branching on the address's state, so neither concurrency nor the answer can get past them.
        $ipState = $ipKey !== '' ? ahv_nl_lock_limit($pdo, 'ip', $ipKey, $now, 3600) : null;
        $emailState = ahv_nl_lock_limit($pdo, 'email', $emailKey, $now, 86400);
        if (($ipState && $ipState[1] >= (int) $limits['perIpPerHour']) || $emailState[1] >= (int) $limits['perEmailPerDay']) {
            return ['status' => 429, 'body' => ['ok' => false, 'code' => 'RATE_LIMITED']];
        }
        if ($ipState) ahv_nl_store_limit($pdo, 'ip', $ipKey, $ipState);
        ahv_nl_store_limit($pdo, 'email', $emailKey, $emailState);

        // Same-address requests are already serialized by the email limit row above, so a plain read
        // then insert cannot race; the row is locked only once it exists (no gap locks).
        $find = $pdo->prepare('SELECT `id` FROM ' . ahv_relay_ident(AHV_NL_SUBSCRIBER) . ' WHERE `email_hash` = ? LIMIT 1');
        $find->execute([$emailHash]);
        if ($find->fetchColumn() === false) {
            try {
                $pdo->prepare('INSERT INTO ' . ahv_relay_ident(AHV_NL_SUBSCRIBER)
                    . ' (`public_id`, `email_hash`, `email`, `status`, `suppressed`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, 0, ?, ?)')
                    ->execute([bin2hex(random_bytes(16)), $emailHash, $v['email'], 'pending', $ts, $ts]);
            } catch (Throwable $error) {
                if (!ahv_nl_is_duplicate($error)) throw $error;
            }
        }
        $lock = $pdo->prepare('SELECT * FROM ' . ahv_relay_ident(AHV_NL_SUBSCRIBER) . ' WHERE `email_hash` = ? LIMIT 1' . ahv_nl_lock($pdo));
        $lock->execute([$emailHash]);
        $subscriber = $lock->fetch(PDO::FETCH_ASSOC);
        if (!$subscriber) throw new RuntimeException('subscriber row could not be read back');

        $quiet = ['status' => 200, 'body' => ['ok' => true, 'send' => false, 'confirmation_id' => null]];
        if ($subscriber['status'] === 'confirmed' && (int) $subscriber['suppressed'] === 0) return $quiet;

        // Neutral no-op only when an email the provider ACCEPTED (mail_updated_at = acceptance time) is
        // recent and still usable. Queued or uncertain jobs never justify "check your email": this request
        // issues its own job instead.
        $live = $pdo->prepare('SELECT MAX(`mail_updated_at`) FROM ' . ahv_relay_ident(AHV_NL_CONFIRMATION)
            . ' WHERE `subscriber_id` = ? AND `mail_status` = ? AND `used_at` IS NULL AND `revoked_at` IS NULL AND `expires_at` > ?');
        $live->execute([(int) $subscriber['id'], 'sent', $ts]);
        $lastSent = $live->fetchColumn();
        if ($lastSent && $now - ahv_nl_epoch((string) $lastSent) < (int) $limits['resendCooldownSeconds']) return $quiet;

        // Confirmation-email ceiling per address per day (definitively failed sends do not count).
        $sends = $pdo->prepare('SELECT COUNT(*) FROM ' . ahv_relay_ident(AHV_NL_CONFIRMATION)
            . ' WHERE `subscriber_id` = ? AND `created_at` >= ? AND `mail_status` <> ?');
        $sends->execute([(int) $subscriber['id'], ahv_nl_time($now - 86400), 'failed']);
        if ((int) $sends->fetchColumn() >= (int) $limits['sendsPerEmailPerDay']) {
            // Neutral only if an accepted, still-usable email exists; otherwise say so (429), never a false "sent".
            return $lastSent ? $quiet : ['status' => 429, 'body' => ['ok' => false, 'code' => 'RATE_LIMITED']];
        }

        // The durable, recoverable mail job. The creating request holds the lease for its inline send;
        // after it lapses the outbox worker may claim the job (same sealed token → same link).
        // An unsubscribed address stays unsubscribed and suppressed here: only a later valid
        // confirmation of THIS token can lift it (fresh re-consent).
        $pdo->prepare('INSERT INTO ' . ahv_relay_ident(AHV_NL_CONFIRMATION)
            . ' (`subscriber_id`, `token_hash`, `consent_version`, `consent_text`, `consent_locale`, `source_path`, `request_ip`, `created_at`, `expires_at`, `mail_status`, `token_sealed`, `attempts`, `lease_until`)'
            . ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)')
            ->execute([(int) $subscriber['id'], $v['tokenHash'], $v['version'], $v['text'], $v['locale'], $v['path'], $v['ip'], $ts,
                ahv_nl_time($now + 3600 * $ttlHours), 'queued', $v['sealed'],
                ahv_nl_time($now + (int) $outbox['inlineLeaseSeconds'])]);
        $id = (int) $pdo->lastInsertId();
        if ($id < 1) throw new RuntimeException('confirmation id unavailable');
        return ['status' => 200, 'body' => ['ok' => true, 'send' => true, 'confirmation_id' => $id]];
    });
}

/**
 * newsletter.mail_result — records the provider's answer for one job (autocommit, one row):
 *   sent    → accepted by the provider; seal cleared.
 *   failed  → the provider signed a definitive refusal (nothing was sent); token revoked, seal cleared.
 *   unknown → outcome uncertain (timeout, unverifiable reply): the token stays valid because it may have
 *             been delivered; the job is released to the outbox worker after the retry delay, and its seal
 *             is dropped once the attempt budget is spent.
 */
function ahv_relay_newsletter_mail_result(PDO $pdo, $data, array $nl, int $now): array
{
    $shape = ahv_nl_only_keys($data, ['confirmation_id', 'token_hash', 'result']);
    if (!$shape['ok']) return ahv_nl_bad($shape);
    $id = isset($data['confirmation_id']) && is_int($data['confirmation_id']) ? $data['confirmation_id'] : 0;
    $hash = isset($data['token_hash']) && is_string($data['token_hash']) ? $data['token_hash'] : '';
    $result = isset($data['result']) && is_string($data['result']) ? $data['result'] : '';
    if ($id < 1 || !preg_match(AHV_NL_HASH_RE, $hash) || !in_array($result, ['sent', 'failed', 'unknown'], true)) {
        return ['status' => 400, 'body' => ['ok' => false, 'code' => 'SCHEMA_VIOLATION']];
    }
    $ts = ahv_nl_time($now);
    $table = ahv_relay_ident(AHV_NL_CONFIRMATION);
    $where = ' WHERE `id` = ? AND `token_hash` = ? AND `mail_status` IN (?, ?)';
    if ($result === 'sent') {
        $update = ahv_nl_exec($pdo, 'UPDATE ' . $table . ' SET `mail_status` = ?, `mail_updated_at` = ?, `token_sealed` = NULL, `lease_until` = NULL' . $where,
            ['sent', $ts, $id, $hash, 'queued', 'unknown']);
    } elseif ($result === 'failed') {
        $update = ahv_nl_exec($pdo, 'UPDATE ' . $table . ' SET `mail_status` = ?, `mail_updated_at` = ?, `token_sealed` = NULL, `lease_until` = NULL, `revoked_at` = COALESCE(`revoked_at`, ?)' . $where,
            ['failed', $ts, $ts, $id, $hash, 'queued', 'unknown']);
    } else {
        $max = (int) $nl['outbox']['maxSendAttempts'];
        $update = ahv_nl_exec($pdo, 'UPDATE ' . $table . ' SET `mail_status` = ?, `mail_updated_at` = ?, `lease_until` = ?,'
            . ' `token_sealed` = CASE WHEN `attempts` >= ? THEN NULL ELSE `token_sealed` END' . $where,
            ['unknown', $ts, ahv_nl_time($now + (int) $nl['outbox']['retryDelaySeconds']), $max, $id, $hash, 'queued', 'unknown']);
    }
    return ['status' => 200, 'body' => ['ok' => true, 'updated' => $update->rowCount() === 1]];
}

/**
 * newsletter.claim — the outbox worker's lease. Returns jobs that still need their email: queued jobs
 * whose inline send never reported (crash, lost reply) and uncertain jobs due for a retry — unused,
 * unrevoked, unexpired, sealed, within the attempt budget, lease lapsed, for an address that is not
 * already confirmed. Each job is leased with a single-row compare-and-set, so two workers never both
 * claim it. The worker re-sends the SAME sealed token under the SAME idempotency key.
 */
function ahv_relay_newsletter_claim(PDO $pdo, $data, array $nl, int $now): array
{
    $shape = ahv_nl_only_keys($data === null ? [] : $data, ['limit']);
    if (!$shape['ok']) return ahv_nl_bad($shape);
    $outbox = $nl['outbox'];
    $limit = isset($data['limit']) && is_int($data['limit']) ? max(1, min((int) $outbox['claimBatch'], $data['limit'])) : (int) $outbox['claimBatch'];
    $ts = ahv_nl_time($now);
    $horizon = ahv_nl_time($now + 600);
    $c = ahv_relay_ident(AHV_NL_CONFIRMATION);
    $s = ahv_relay_ident(AHV_NL_SUBSCRIBER);
    $eligible = ' c.`mail_status` IN (?, ?) AND c.`used_at` IS NULL AND c.`revoked_at` IS NULL AND c.`token_sealed` IS NOT NULL'
        . ' AND c.`expires_at` > ? AND c.`attempts` < ? AND (c.`lease_until` IS NULL OR c.`lease_until` <= ?)'
        . ' AND NOT (s.`status` = ? AND s.`suppressed` = 0)';
    $params = ['queued', 'unknown', $horizon, (int) $outbox['maxSendAttempts'], $ts, 'confirmed'];
    $candidates = $pdo->prepare('SELECT c.`id` FROM ' . $c . ' c JOIN ' . $s . ' s ON s.`id` = c.`subscriber_id` WHERE' . $eligible . ' ORDER BY c.`id` LIMIT ' . $limit);
    $read = $pdo->prepare('SELECT c.`id`, c.`token_hash`, c.`token_sealed`, c.`consent_locale`, s.`email` FROM ' . $c . ' c JOIN ' . $s . ' s ON s.`id` = c.`subscriber_id` WHERE c.`id` = ?');
    $jobs = [];
    // Parallel workers see the same first candidates; a job another worker leased drops out of the
    // eligible set, so re-select (bounded) until this worker has its batch or nothing is left.
    for ($round = 0; $round < 5 && count($jobs) < $limit; $round++) {
        $candidates->execute($params);
        $ids = array_map('intval', $candidates->fetchAll(PDO::FETCH_COLUMN));
        if (!$ids) break;
        foreach ($ids as $id) {
            if (count($jobs) >= $limit) break;
            $lease = ahv_nl_exec($pdo, 'UPDATE ' . $c . ' SET `lease_until` = ?, `attempts` = `attempts` + 1 WHERE `id` = ? AND `mail_status` IN (?, ?)'
                . ' AND `used_at` IS NULL AND `revoked_at` IS NULL AND `token_sealed` IS NOT NULL AND `attempts` < ? AND (`lease_until` IS NULL OR `lease_until` <= ?)',
                [ahv_nl_time($now + (int) $outbox['inlineLeaseSeconds']), $id, 'queued', 'unknown', (int) $outbox['maxSendAttempts'], $ts]);
            if ($lease->rowCount() !== 1) continue;
            $read->execute([$id]);
            $row = $read->fetch(PDO::FETCH_ASSOC);
            if (!$row || $row['token_sealed'] === null) continue;
            $jobs[] = ['confirmation_id' => (int) $row['id'], 'token_hash' => (string) $row['token_hash'], 'token_sealed' => (string) $row['token_sealed'],
                'locale' => (string) $row['consent_locale'], 'email' => (string) $row['email']];
        }
    }
    if (random_int(1, 20) === 1) {
        // Housekeeping: stale counters, seals of expired jobs, never-used expired jobs older than 30 days.
        ahv_nl_exec($pdo, 'DELETE FROM ' . ahv_relay_ident(AHV_NL_LIMIT) . ' WHERE `window_start` < ?', [ahv_nl_time($now - 2 * 86400)]);
        ahv_nl_exec($pdo, 'UPDATE ' . $c . ' SET `token_sealed` = NULL WHERE `token_sealed` IS NOT NULL AND `expires_at` < ?', [$ts]);
        ahv_nl_exec($pdo, 'DELETE FROM ' . $c . ' WHERE `used_at` IS NULL AND `expires_at` < ?', [ahv_nl_time($now - 30 * 86400)]);
    }
    return ['status' => 200, 'body' => ['ok' => true, 'jobs' => $jobs]];
}

/**
 * newsletter.confirm — atomic single-use consume, locking subscriber → token (the global order). Every
 * failure (unknown, tampered, expired, used, revoked, definitively failed, superseded by an unsubscribe)
 * is the same neutral `invalid`.
 */
function ahv_relay_newsletter_confirm(PDO $pdo, $data, int $now): array
{
    $shape = ahv_nl_only_keys($data, ['token_hash']);
    if (!$shape['ok']) return ahv_nl_bad($shape);
    $hash = isset($data['token_hash']) && is_string($data['token_hash']) ? $data['token_hash'] : '';
    if (!preg_match(AHV_NL_HASH_RE, $hash)) return ['status' => 400, 'body' => ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'token_hash']];
    $ts = ahv_nl_time($now);
    $invalid = ['status' => 200, 'body' => ['ok' => true, 'outcome' => 'invalid']];
    $find = $pdo->prepare('SELECT `id`, `subscriber_id` FROM ' . ahv_relay_ident(AHV_NL_CONFIRMATION) . ' WHERE `token_hash` = ? LIMIT 1');
    $find->execute([$hash]);
    $ref = $find->fetch(PDO::FETCH_ASSOC);
    if (!$ref) return $invalid;
    return ahv_nl_transaction($pdo, function () use ($pdo, $ref, $ts, $invalid) {
        $s = $pdo->prepare('SELECT * FROM ' . ahv_relay_ident(AHV_NL_SUBSCRIBER) . ' WHERE `id` = ? LIMIT 1' . ahv_nl_lock($pdo));
        $s->execute([(int) $ref['subscriber_id']]);
        $subscriber = $s->fetch(PDO::FETCH_ASSOC);
        $q = $pdo->prepare('SELECT * FROM ' . ahv_relay_ident(AHV_NL_CONFIRMATION) . ' WHERE `id` = ? LIMIT 1' . ahv_nl_lock($pdo));
        $q->execute([(int) $ref['id']]);
        $token = $q->fetch(PDO::FETCH_ASSOC);
        if (!$subscriber || !$token || (int) $token['subscriber_id'] !== (int) $subscriber['id']
            || $token['used_at'] !== null || $token['revoked_at'] !== null || $token['mail_status'] === 'failed'
            || strcmp((string) $token['expires_at'], $ts) <= 0
            // A token issued before the latest unsubscribe never re-subscribes (unsubscribe also revokes).
            || ($subscriber['unsubscribed_at'] !== null && strcmp((string) $token['created_at'], (string) $subscriber['unsubscribed_at']) < 0)) {
            return $invalid;
        }
        $consume = $pdo->prepare('UPDATE ' . ahv_relay_ident(AHV_NL_CONFIRMATION) . ' SET `used_at` = ?, `token_sealed` = NULL, `lease_until` = NULL WHERE `id` = ? AND `used_at` IS NULL AND `revoked_at` IS NULL');
        $consume->execute([$ts, (int) $token['id']]);
        if ($consume->rowCount() !== 1) return $invalid;
        $pdo->prepare('UPDATE ' . ahv_relay_ident(AHV_NL_SUBSCRIBER)
            . ' SET `status` = ?, `suppressed` = 0, `confirmed_at` = ?, `consent_version` = ?, `consent_text` = ?, `consent_locale` = ?, `consent_source_path` = ?, `consent_ip` = ?, `updated_at` = ? WHERE `id` = ?')
            ->execute(['confirmed', $ts, $token['consent_version'], $token['consent_text'], $token['consent_locale'], $token['source_path'], $token['request_ip'], $ts, (int) $subscriber['id']]);
        $pdo->prepare('UPDATE ' . ahv_relay_ident(AHV_NL_CONFIRMATION) . ' SET `revoked_at` = ?, `token_sealed` = NULL, `lease_until` = NULL WHERE `subscriber_id` = ? AND `id` <> ? AND `used_at` IS NULL AND `revoked_at` IS NULL')
            ->execute([$ts, (int) $subscriber['id'], (int) $token['id']]);
        return ['status' => 200, 'body' => ['ok' => true, 'outcome' => 'confirmed', 'public_id' => (string) $subscriber['public_id']]];
    });
}

/**
 * newsletter.unsubscribe — idempotent, immediate: status unsubscribed + suppressed, every outstanding
 * confirmation token revoked (subscriber → tokens, the global order). Unknown ids get the same answer.
 */
function ahv_relay_newsletter_unsubscribe(PDO $pdo, $data, int $now): array
{
    $shape = ahv_nl_only_keys($data, ['public_id']);
    if (!$shape['ok']) return ahv_nl_bad($shape);
    $publicId = isset($data['public_id']) && is_string($data['public_id']) ? $data['public_id'] : '';
    if (!preg_match(AHV_NL_PUBLIC_ID_RE, $publicId)) return ['status' => 400, 'body' => ['ok' => false, 'code' => 'SCHEMA_VIOLATION', 'field' => 'public_id']];
    $ts = ahv_nl_time($now);
    $find = $pdo->prepare('SELECT `id` FROM ' . ahv_relay_ident(AHV_NL_SUBSCRIBER) . ' WHERE `public_id` = ? LIMIT 1');
    $find->execute([$publicId]);
    $id = $find->fetchColumn();
    if ($id !== false) {
        ahv_nl_transaction($pdo, function () use ($pdo, $id, $ts) {
            $pdo->prepare('SELECT `id` FROM ' . ahv_relay_ident(AHV_NL_SUBSCRIBER) . ' WHERE `id` = ?' . ahv_nl_lock($pdo))->execute([(int) $id]);
            $pdo->prepare('UPDATE ' . ahv_relay_ident(AHV_NL_SUBSCRIBER) . ' SET `status` = ?, `suppressed` = 1, `unsubscribed_at` = ?, `updated_at` = ? WHERE `id` = ?')
                ->execute(['unsubscribed', $ts, $ts, (int) $id]);
            $pdo->prepare('UPDATE ' . ahv_relay_ident(AHV_NL_CONFIRMATION) . ' SET `revoked_at` = ?, `token_sealed` = NULL, `lease_until` = NULL WHERE `subscriber_id` = ? AND `used_at` IS NULL AND `revoked_at` IS NULL')
                ->execute([$ts, (int) $id]);
            return true;
        });
    }
    return ['status' => 200, 'body' => ['ok' => true, 'outcome' => 'unsubscribed']];
}

/** @return array{status:int,body:array} */
function ahv_relay_newsletter(PDO $pdo, string $op, $data, array $schema, int $now): array
{
    $nl = isset($schema['newsletter']) && is_array($schema['newsletter']) ? $schema['newsletter'] : null;
    if (!$nl || empty($nl['consentVersions']) || empty($nl['locales']) || empty($nl['limits']) || empty($nl['outbox'])) {
        return ['status' => 503, 'body' => ['ok' => false, 'code' => 'NEWSLETTER_NOT_CONFIGURED']];
    }
    if ($op === 'newsletter.subscribe') {
        $valid = ahv_relay_newsletter_validate_subscribe($data, $nl);
        if (!$valid['ok']) return ahv_nl_bad($valid);
        return ahv_relay_newsletter_subscribe($pdo, $valid, $nl, $now);
    }
    if ($op === 'newsletter.mail_result') return ahv_relay_newsletter_mail_result($pdo, $data, $nl, $now);
    if ($op === 'newsletter.claim') return ahv_relay_newsletter_claim($pdo, $data, $nl, $now);
    if ($op === 'newsletter.confirm') return ahv_relay_newsletter_confirm($pdo, $data, $now);
    if ($op === 'newsletter.unsubscribe') return ahv_relay_newsletter_unsubscribe($pdo, $data, $now);
    return ['status' => 400, 'body' => ['ok' => false, 'code' => 'UNKNOWN_OPERATION']];
}

/** Newsletter table readiness (names only, no data). Reported beside — never inside — the lead `ready`. */
function ahv_relay_newsletter_health(PDO $pdo): array
{
    $need = [
        AHV_NL_SUBSCRIBER => ['id', 'public_id', 'email_hash', 'email', 'status', 'suppressed', 'created_at', 'updated_at', 'confirmed_at', 'consent_version', 'consent_text', 'consent_locale', 'consent_source_path', 'consent_ip', 'unsubscribed_at'],
        AHV_NL_CONFIRMATION => ['id', 'subscriber_id', 'token_hash', 'consent_version', 'consent_text', 'consent_locale', 'source_path', 'request_ip', 'created_at', 'expires_at', 'mail_status', 'mail_updated_at', 'token_sealed', 'attempts', 'lease_until', 'used_at', 'revoked_at'],
        AHV_NL_LIMIT => ['kind', 'subject_hash', 'window_start', 'hits'],
    ];
    // Full-length UNIQUE keys the lifecycle depends on (same rule as the lead health check). The limit
    // table's key is its composite PRIMARY KEY (kind, subject_hash).
    $unique = [AHV_NL_SUBSCRIBER => [['email_hash'], ['public_id']], AHV_NL_CONFIRMATION => [['token_hash']], AHV_NL_LIMIT => [['kind', 'subject_hash']]];
    $q = $pdo->prepare('SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?');
    $u = $pdo->prepare('SELECT INDEX_NAME, COLUMN_NAME, SUB_PART FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND NON_UNIQUE = 0 ORDER BY INDEX_NAME, SEQ_IN_INDEX');
    $tables = [];
    $ready = true;
    foreach ($need as $table => $columns) {
        $q->execute([$table]);
        $have = array_map('strval', $q->fetchAll(PDO::FETCH_COLUMN));
        $missing = array_values(array_diff($columns, $have));
        $u->execute([$table]);
        $indexes = [];
        foreach ($u->fetchAll(PDO::FETCH_ASSOC) as $index) $indexes[(string) $index['INDEX_NAME']][] = $index;
        $missingUnique = [];
        foreach ($unique[$table] as $key) {
            $found = false;
            foreach ($indexes as $indexColumns) {
                $names = array_map(function ($c) { return (string) $c['COLUMN_NAME']; }, $indexColumns);
                $full = array_reduce($indexColumns, function ($ok, $c) { return $ok && $c['SUB_PART'] === null; }, true);
                if ($names === $key && $full) { $found = true; break; }
            }
            if (!$found) $missingUnique[] = implode('+', $key);
        }
        $tables[$table] = ['exists' => count($have) > 0, 'missingColumns' => $missing, 'missingUnique' => $missingUnique];
        if (!$have || $missing || $missingUnique) $ready = false;
    }
    return ['ready' => $ready, 'tables' => $tables];
}

function ahv_relay_json(array $body): string
{
    return json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

/**
 * Full request handling. Pure apart from the PDO it obtains from $pdoFactory,
 * so tests can drive it with any $server/$body without a web server.
 * @return array{0:int,1:array,2:string} status, headers, body
 */
function ahv_relay_handle(array $server, string $body, array $config, array $schema, callable $pdoFactory, int $now): array
{
    $headers = ['Content-Type' => 'application/json; charset=utf-8', 'Cache-Control' => 'no-store', 'X-Robots-Tag' => 'noindex'];
    if (ahv_relay_config_problem($config, $schema) !== null) {
        return [503, $headers, ahv_relay_json(['ok' => false, 'code' => 'RELAY_NOT_CONFIGURED'])];
    }
    $auth = ahv_relay_authenticate($server, $body, $config, $now);
    if (!$auth['ok']) {
        if ($auth['status'] === 405) $headers['Allow'] = 'POST';
        return [$auth['status'], $headers, ahv_relay_json(['ok' => false, 'code' => $auth['code']])];
    }
    $signed = function (int $status, array $payload) use ($headers, $auth): array {
        $json = ahv_relay_json($payload);
        $headers['X-AHV-Relay-Signature'] = ahv_relay_sign($auth['secret'], ahv_relay_canonical_response($auth['keyId'], $auth['nonce'], $status, $json));
        return [$status, $headers, $json];
    };

    try {
        $pdo = $pdoFactory();
        // Single-use nonce: recorded only after the signature verified.
        try {
            $pdo->prepare('INSERT INTO `ahv_relay_nonce` (`nonce`, `key_id`, `seen_at`) VALUES (?, ?, UTC_TIMESTAMP())')
                ->execute([$auth['nonce'], $auth['keyId']]);
        } catch (Throwable $error) {
            if (ahv_relay_is_duplicate($error)) return $signed(409, ['ok' => false, 'code' => 'REPLAYED_REQUEST']);
            throw $error;
        }
        if (random_int(1, 50) === 1) {
            $pdo->exec('DELETE FROM `ahv_relay_nonce` WHERE `seen_at` < (UTC_TIMESTAMP() - INTERVAL 1 DAY)');
        }
        $ceiling = isset($config['max_requests_per_minute']) ? (int) $config['max_requests_per_minute'] : 120;
        if ($ceiling < 1) $ceiling = 120;
        $recent = (int) $pdo->query('SELECT COUNT(*) FROM `ahv_relay_nonce` WHERE `seen_at` >= (UTC_TIMESTAMP() - INTERVAL 60 SECOND)')->fetchColumn();
        if ($recent > $ceiling) return $signed(429, ['ok' => false, 'code' => 'RATE_LIMITED']);

        $request = json_decode($body, true);
        if (!is_array($request) || !isset($request['v']) || $request['v'] !== 1 || !isset($request['op']) || !is_string($request['op'])) {
            return $signed(400, ['ok' => false, 'code' => 'INVALID_REQUEST']);
        }
        if ($request['op'] === 'health') {
            $health = ahv_relay_health($pdo, $schema);
            // Newsletter readiness is reported beside the lead report; it never changes `ready`.
            $health['newsletter'] = ahv_relay_newsletter_health($pdo);
            return $signed(200, $health);
        }
        if (strpos($request['op'], 'newsletter.') === 0) {
            $result = ahv_relay_newsletter($pdo, $request['op'], isset($request['data']) ? $request['data'] : null, $schema, $now);
            return $signed($result['status'], $result['body']);
        }
        if ($request['op'] === 'lead.store') {
            $valid = ahv_relay_validate_lead(isset($request['data']) ? $request['data'] : null, $schema);
            if (!$valid['ok']) {
                $out = ['ok' => false, 'code' => $valid['code']];
                if (isset($valid['field'])) $out['field'] = $valid['field'];
                return $signed(400, $out);
            }
            $result = ahv_relay_store_lead($pdo, $valid, $schema);
            return $signed($result['status'], $result['body']);
        }
        return $signed(400, ['ok' => false, 'code' => 'UNKNOWN_OPERATION']);
    } catch (Throwable $error) {
        // Class and SQLSTATE only: driver messages can echo SQL or values.
        $state = $error instanceof PDOException ? (string) $error->getCode() : '-';
        error_log('ahv-form-relay: ' . get_class($error) . ' sqlstate=' . $state);
        return $signed(500, ['ok' => false, 'code' => 'STORE_FAILED']);
    }
}

function ahv_relay_pdo_factory(array $config): callable
{
    return function () use ($config): PDO {
        $db = $config['db'];
        $dsn = (isset($db['socket']) && is_string($db['socket']) && $db['socket'] !== '')
            ? 'mysql:unix_socket=' . $db['socket'] . ';dbname=' . $db['name'] . ';charset=utf8mb4'
            : 'mysql:host=' . $db['host'] . ';port=' . (int) (isset($db['port']) ? $db['port'] : 3306) . ';dbname=' . $db['name'] . ';charset=utf8mb4';
        $pdo = new PDO($dsn, $db['user'], $db['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5,
        ]);
        $pdo->exec("SET time_zone = '+00:00'");
        return $pdo;
    };
}
