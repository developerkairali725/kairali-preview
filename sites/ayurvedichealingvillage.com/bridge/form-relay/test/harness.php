<?php
/**
 * Test-only CLI harness (never deployed): drives relay-core.php functions with
 * JSON from stdin so the website's Node tests can prove protocol interop with
 * the real PHP code. It sets nothing on the production code path — HTTPS,
 * signatures and schema are checked exactly as deployed.
 */
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/../relay-core.php';

$input = json_decode((string) stream_get_contents(STDIN), true);
$schema = ahv_relay_load_schema(__DIR__ . '/../lead-schema.json');
$action = isset($input['action']) ? $input['action'] : '';

if ($action === 'authenticate') {
    $result = ahv_relay_authenticate($input['server'], $input['body'], $input['config'], (int) $input['now']);
    unset($result['secret']);
    echo json_encode($result);
} elseif ($action === 'validate') {
    echo json_encode(ahv_relay_validate_lead($input['data'], $schema));
} elseif ($action === 'sign_response') {
    echo json_encode(['signature' => ahv_relay_sign($input['secret'], ahv_relay_canonical_response($input['keyId'], $input['nonce'], (int) $input['status'], $input['body']))]);
} elseif ($action === 'config_problem') {
    echo json_encode(['problem' => ahv_relay_config_problem($input['config'], $schema)]);
} elseif ($action === 'handle_unconfigured') {
    // Full handler with an operator config that is not usable: must fail closed
    // without ever asking for a database connection.
    $called = false;
    list($status, $headers, $body) = ahv_relay_handle($input['server'], $input['body'], $input['config'], $schema, function () use (&$called) { $called = true; throw new RuntimeException('no db'); }, (int) $input['now']);
    echo json_encode(['status' => $status, 'body' => json_decode($body, true), 'pdoRequested' => $called]);
} elseif ($action === 'newsletter' || $action === 'newsletter_dump') {
    // Newsletter ops against a throwaway SQLite file (test double of the MySQL tables in
    // newsletter-tables.sql). Drives the REAL op functions; the database file lives in a temp dir.
    $pdo = class_exists('Pdo\\Sqlite') ? new \Pdo\Sqlite('sqlite:' . $input['db']) : new PDO('sqlite:' . $input['db']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('CREATE TABLE IF NOT EXISTS ahv_newsletter_subscriber (id INTEGER PRIMARY KEY AUTOINCREMENT, public_id TEXT NOT NULL UNIQUE, email_hash TEXT NOT NULL UNIQUE, email TEXT NOT NULL, status TEXT NOT NULL, suppressed INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, confirmed_at TEXT, consent_version TEXT, consent_text TEXT, consent_locale TEXT, consent_source_path TEXT, consent_ip TEXT, unsubscribed_at TEXT)');
    $pdo->exec("CREATE TABLE IF NOT EXISTS ahv_newsletter_confirmation (id INTEGER PRIMARY KEY AUTOINCREMENT, subscriber_id INTEGER NOT NULL REFERENCES ahv_newsletter_subscriber(id), token_hash TEXT NOT NULL UNIQUE, consent_version TEXT NOT NULL, consent_text TEXT NOT NULL, consent_locale TEXT NOT NULL, source_path TEXT NOT NULL, request_ip TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, expires_at TEXT NOT NULL, mail_status TEXT NOT NULL DEFAULT 'queued', mail_updated_at TEXT, token_sealed TEXT, attempts INTEGER NOT NULL DEFAULT 0, lease_until TEXT, used_at TEXT, revoked_at TEXT)");
    $pdo->exec('CREATE TABLE IF NOT EXISTS ahv_newsletter_limit (kind TEXT NOT NULL, subject_hash TEXT NOT NULL, window_start TEXT NOT NULL, hits INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (kind, subject_hash))');
    if ($action === 'newsletter') {
        $result = ahv_relay_newsletter($pdo, (string) $input['op'], isset($input['data']) ? $input['data'] : null, $schema, (int) $input['now']);
        echo json_encode($result);
    } else {
        $out = [];
        foreach (['ahv_newsletter_subscriber' => 'id', 'ahv_newsletter_confirmation' => 'id', 'ahv_newsletter_limit' => 'kind, subject_hash'] as $table => $order) {
            $out[$table] = $pdo->query('SELECT * FROM ' . $table . ' ORDER BY ' . $order)->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($out);
    }
} else {
    fwrite(STDERR, "unknown action\n");
    exit(2);
}
