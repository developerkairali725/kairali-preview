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

/** Column-name-only schema readiness report. Reads no submitted data. */
function ahv_relay_health(PDO $pdo, array $schema): array
{
    $report = [];
    $columnsQuery = $pdo->prepare('SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?');
    $uniqueQuery = $pdo->prepare("SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = 'submission_token' AND NON_UNIQUE = 0");
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
        if ($table !== 'ahv_relay_nonce') {
            $uniqueQuery->execute([$table]);
            $entry['submissionTokenUnique'] = (int) $uniqueQuery->fetchColumn() > 0;
        }
        $report[$table] = $entry;
    }
    $ready = true;
    foreach ($report as $table => $entry) {
        if (!$entry['exists'] || $entry['missingColumns'] || (isset($entry['submissionTokenUnique']) && !$entry['submissionTokenUnique'])) $ready = false;
    }
    return ['ok' => true, 'ready' => $ready, 'protocol' => AHV_RELAY_PROTOCOL, 'tables' => $report];
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
            return $signed(200, ahv_relay_health($pdo, $schema));
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
