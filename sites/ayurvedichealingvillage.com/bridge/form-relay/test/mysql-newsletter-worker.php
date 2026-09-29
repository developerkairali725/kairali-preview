<?php
/**
 * Test-only (never deployed): ONE newsletter op in its own process and its own
 * MySQL connection, started by mysql-integration.php in parallel with others
 * to prove the ops' locking under real InnoDB concurrency. Waits for a shared
 * start instant so the processes actually overlap. Prints the op result JSON.
 *
 *   php mysql-newsletter-worker.php <socket> <startMicrotime> <base64 JSON {op,data}>
 */
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/../relay-core.php';

[$script, $socket, $start, $job] = $argv;
$schema = ahv_relay_load_schema(__DIR__ . '/../lead-schema.json');
$request = json_decode((string) base64_decode($job), true);
$pdo = new PDO('mysql:unix_socket=' . $socket . ';dbname=' . $schema['database'] . ';charset=utf8mb4', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES => false,
]);
$pdo->exec("SET time_zone = '+00:00'");
$pdo->exec('SET SESSION innodb_lock_wait_timeout = 10');
while (microtime(true) < (float) $start) usleep(200);
try {
    echo json_encode(ahv_relay_newsletter($pdo, (string) $request['op'], $request['data'], $schema, time()));
} catch (Throwable $error) {
    $info = $error instanceof PDOException ? $error->errorInfo : null;
    echo json_encode(['status' => 500, 'body' => ['ok' => false, 'code' => 'STORE_FAILED', 'driver' => is_array($info) ? ($info[1] ?? null) : null]]);
}
