<?php
/**
 * Test-only (never deployed): drives ahv_relay_handle() end to end against a
 * THROWAWAY local MySQL server started by mysql-integration.sh. The lead
 * tables created here are synthetic fixtures shaped from lead-schema.json so
 * the relay has something to write to — they are NOT the production DDL (the
 * production tables already exist; the relay's `health` op verifies them).
 */
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/../relay-core.php';

$socket = getenv('AHV_RELAY_TEST_SOCKET');
if (!$socket) { fwrite(STDERR, "AHV_RELAY_TEST_SOCKET not set\n"); exit(2); }
$schema = ahv_relay_load_schema(__DIR__ . '/../lead-schema.json');
$secret = bin2hex(random_bytes(24));
$config = ['db' => ['host' => 'localhost', 'socket' => $socket, 'name' => $schema['database'], 'user' => 'root', 'password' => 'unused-local-socket'], 'keys' => ['k1' => $secret], 'max_requests_per_minute' => 40];
$factory = function () use ($socket, $schema): PDO {
    $pdo = new PDO('mysql:unix_socket=' . $socket . ';dbname=' . $schema['database'] . ';charset=utf8mb4', 'root', '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]);
    $pdo->exec("SET time_zone = '+00:00'");
    return $pdo;
};
$pdo = $factory();

// ---- synthetic fixtures (test only)
foreach ($schema['tables'] as $table => $columns) {
    $defs = ['`id` bigint unsigned NOT NULL AUTO_INCREMENT', '`site` varchar(190) NOT NULL', '`form_type` varchar(64) NOT NULL', '`submit_ip` varchar(45) NULL', '`submission_token` char(36) NOT NULL', '`submit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP'];
    foreach ($columns as $c) {
        if ($c === 'consent') { $defs[] = '`consent` tinyint(1) NOT NULL DEFAULT 0'; $defs[] = '`consent_at` timestamp NULL'; continue; }
        $defs[] = ahv_relay_ident($c) . ' text NULL';
    }
    foreach ($schema['trackingColumns'] as $c => $max) $defs[] = ahv_relay_ident($c) . ' varchar(' . (int) $max . ') NULL';
    $defs[] = 'PRIMARY KEY (`id`)';
    $defs[] = 'UNIQUE KEY `uq_token` (`submission_token`)';
    $pdo->exec('DROP TABLE IF EXISTS ' . ahv_relay_ident($table));
    $pdo->exec('CREATE TABLE ' . ahv_relay_ident($table) . ' (' . implode(',', $defs) . ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
}

$failures = 0; $passes = 0;
function check(bool $ok, string $label): void { global $failures, $passes; if ($ok) { $passes++; echo "PASS  $label\n"; } else { $failures++; echo "FAIL  $label\n"; } }

$path = '/ahv-form-relay/index.php';
function call(array $payload, array $opts = []): array {
    global $secret, $config, $schema, $factory, $path;
    $body = isset($opts['raw']) ? $opts['raw'] : json_encode($payload);
    $now = time();
    $nonce = isset($opts['nonce']) ? $opts['nonce'] : rtrim(strtr(base64_encode(random_bytes(24)), '+/', '-_'), '=');
    $ts = (string) $now;
    $server = ['REQUEST_METHOD' => 'POST', 'HTTPS' => 'on', 'CONTENT_TYPE' => 'application/json', 'REQUEST_URI' => $path,
        'HTTP_X_AHV_KEY_ID' => 'k1', 'HTTP_X_AHV_TIMESTAMP' => $ts, 'HTTP_X_AHV_NONCE' => $nonce,
        'HTTP_X_AHV_SIGNATURE' => ahv_relay_sign($secret, ahv_relay_canonical_request('k1', $ts, $nonce, 'POST', $path, $body))];
    if (isset($opts['server'])) $server = array_merge($server, $opts['server']);
    list($status, $headers, $out) = ahv_relay_handle($server, $body, $config, $schema, $factory, $now);
    $sigOk = isset($headers['X-AHV-Relay-Signature']) && hash_equals(ahv_relay_sign($secret, ahv_relay_canonical_response('k1', $nonce, $status, $out)), $headers['X-AHV-Relay-Signature']);
    return ['status' => $status, 'body' => json_decode($out, true), 'signed' => $sigOk, 'nonce' => $nonce, 'raw' => $out];
}
function lead(string $token, array $values = [], string $ip = '203.0.113.20', string $table = 'contact'): array {
    return ['v' => 1, 'op' => 'lead.store', 'data' => ['table' => $table, 'submission_token' => $token, 'site' => 'ayurvedichealingvillage.com', 'form_type' => $table, 'submit_ip' => $ip,
        'values' => array_merge(['full_name' => 'Synthetic Relay Test', 'countrycode' => '+91', 'phone' => '9999999999', 'email' => 'synthetic@example.invalid', 'message' => "Line 1\nLine 2 — ünïcødé", 'consent' => true], $values),
        'tracking' => ['utm_source' => 'integration-test', 'lead_source_url' => 'https://preview.example.test/contact-us/']]];
}
function uuid(): string { $b = random_bytes(16); $b[6] = chr((ord($b[6]) & 0x0f) | 0x40); $b[8] = chr((ord($b[8]) & 0x3f) | 0x80); $h = bin2hex($b); return substr($h, 0, 8) . '-' . substr($h, 8, 4) . '-' . substr($h, 12, 4) . '-' . substr($h, 16, 4) . '-' . substr($h, 20); }

// 1. store + read-back
$t1 = uuid();
$r = call(lead($t1));
check($r['status'] === 200 && $r['signed'] && $r['body']['ok'] === true && $r['body']['alreadyStored'] === false, 'new lead stored, signed 200');
check(isset($r['body']['row']['submission_token']) && $r['body']['row']['submission_token'] === $t1, 'read-back row carries the submission token');
check($r['body']['row']['consent'] === '1' && $r['body']['row']['consent_at'] !== null, 'consent stored with a database-clock consent_at');
check($r['body']['row']['message'] === "Line 1\nLine 2 — ünïcødé", 'utf8mb4 text round-trips');
check($r['body']['row']['utm_source'] === 'integration-test' && $r['body']['row']['utm_medium'] === '', 'tracking columns written (absent = empty)');

// 2. idempotent retry (new nonce, same token)
$r = call(lead($t1, ['message' => 'changed on retry']));
$count = (int) $pdo->query("SELECT COUNT(*) FROM `contact` WHERE submission_token = " . $pdo->quote($t1))->fetchColumn();
check($r['status'] === 200 && $r['body']['alreadyStored'] === true && $count === 1, 'same-token retry returns the stored row, no second row');

// 3. replay of an identical signed request (same nonce)
$t2 = uuid();
$first = call(lead($t2, [], '203.0.113.21'), ['nonce' => 'replay-nonce-0123456789abcdef']);
$replay = call(lead($t2, [], '203.0.113.21'), ['nonce' => 'replay-nonce-0123456789abcdef']);
check($first['status'] === 200 && $replay['status'] === 409 && $replay['body']['code'] === 'REPLAYED_REQUEST', 'replayed nonce refused (409)');

// 4. consent false -> consent 0, consent_at NULL
$t3 = uuid();
$r = call(lead($t3, ['consent' => false], '203.0.113.22'));
check($r['body']['row']['consent'] === '0' && $r['body']['row']['consent_at'] === null, 'no consent stored as 0 with NULL consent_at');

// 5. per-IP rate limit (5 per 10 minutes per table)
$statuses = [];
for ($i = 0; $i < 6; $i++) $statuses[] = call(lead(uuid(), [], '203.0.113.99'))['status'];
check($statuses === [200, 200, 200, 200, 200, 429], 'sixth submission from one IP in the window is rate limited: ' . implode(',', $statuses));

// 6. injection attempts never reach SQL
$before = (int) $pdo->query('SELECT COUNT(*) FROM `contact`')->fetchColumn();
$bad = lead(uuid(), [], '203.0.113.23'); $bad['data']['table'] = 'contact` WHERE 1=1; DROP TABLE `contact`; --';
$r1 = call($bad);
$bad = lead(uuid(), [], '203.0.113.23'); $bad['data']['values']['email`) VALUES (1); --'] = 'x';
$r2 = call($bad);
$r3 = call(lead(uuid(), ['full_name' => "Robert'); DROP TABLE `contact`;--"], '203.0.113.24'));
$after = (int) $pdo->query('SELECT COUNT(*) FROM `contact`')->fetchColumn();
check($r1['status'] === 400 && $r1['body']['code'] === 'UNKNOWN_FORM', 'identifier injection in table refused');
check($r2['status'] === 400 && $r2['body']['code'] === 'SCHEMA_VIOLATION', 'identifier injection in column refused');
check($r3['status'] === 200 && $r3['body']['row']['full_name'] === "Robert'); DROP TABLE `contact`;--" && $after === $before + 1, 'value injection stored inertly as data (bound parameter)');

// 7. unsigned / wrong-key / plain HTTP requests
$r = call(lead(uuid()), ['server' => ['HTTP_X_AHV_SIGNATURE' => str_repeat('0', 64)]]);
check($r['status'] === 401 && !$r['signed'], 'bad signature refused, answer unsigned');
$r = call(lead(uuid()), ['server' => ['HTTPS' => 'off']]);
check($r['status'] === 403 && $r['body']['code'] === 'HTTPS_REQUIRED', 'plain HTTP refused');

// 8. every table accepts a minimal valid row (fixture parity with lead-schema.json)
foreach (array_keys($schema['tables']) as $table) {
    $values = [];
    foreach ($schema['tables'][$table] as $c) $values[$c] = in_array($c, $schema['booleanColumns'], true) ? true : 'x';
    $p = ['v' => 1, 'op' => 'lead.store', 'data' => ['table' => $table, 'submission_token' => uuid(), 'site' => 'ayurvedichealingvillage.com', 'form_type' => $table, 'submit_ip' => '', 'values' => $values, 'tracking' => []]];
    $r = call($p);
    check($r['status'] === 200 && $r['body']['ok'] === true, "table $table accepts every allowlisted column");
}

// 9. health: ready against the fixtures; reports a missing column by name only
$r = call(['v' => 1, 'op' => 'health']);
check($r['status'] === 200 && $r['signed'] && $r['body']['ready'] === true, 'health reports ready');
$pdo->exec('ALTER TABLE `opd` DROP COLUMN `preferred_doctor`');
$r = call(['v' => 1, 'op' => 'health']);
check($r['body']['ready'] === false && $r['body']['tables']['opd']['missingColumns'] === ['preferred_doctor'], 'health names a missing column');
check(strpos($r['raw'], 'Synthetic') === false && strpos($r['raw'], '203.0.113') === false, 'health returns no submitted data');

// 10. database failure is generic and signed (opd insert now fails on the dropped column)
$p = lead(uuid(), [], '', 'opd'); $p['data']['values'] = ['full_name' => 'x', 'age' => '30', 'gender' => 'F', 'phone' => '9', 'symptoms' => 'x', 'preferred_doctor' => 'y', 'consent' => true];
$r = call($p);
check($r['status'] === 500 && $r['signed'] && $r['body'] === ['ok' => false, 'code' => 'STORE_FAILED'], 'driver error surfaces only as STORE_FAILED');

// 11. global per-minute ceiling (config 40)
$last = 0;
for ($i = 0; $i < 45; $i++) $last = call(['v' => 1, 'op' => 'health'])['status'];
check($last === 429, 'global per-minute ceiling enforced');

echo "\n$passes passed, $failures failed\n";
exit($failures ? 1 : 0);
