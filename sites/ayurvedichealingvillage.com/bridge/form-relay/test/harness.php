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
} else {
    fwrite(STDERR, "unknown action\n");
    exit(2);
}
