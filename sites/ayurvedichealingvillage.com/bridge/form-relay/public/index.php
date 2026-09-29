<?php
/**
 * AHV form relay — public entry point (the only file under the web root).
 *
 * Everything else — relay-core.php, lead-schema.json and the operator's
 * config.php holding the database password and HMAC key(s) — lives OUTSIDE the
 * web root in the directory named by the AHV_FORM_RELAY_HOME environment
 * variable or, where the host offers no per-site environment without editing
 * .htaccess, by a sibling relay-home.php that returns that absolute path (it
 * holds a path only, never a secret). See RUNBOOK.md.
 * Nothing in this file is secret and nothing here may be edited to weaken a
 * check: an unset or unreadable home fails closed with 503.
 */
declare(strict_types=1);

$home = getenv('AHV_FORM_RELAY_HOME');
if ((!is_string($home) || $home === '') && is_file(__DIR__ . '/relay-home.php')) {
    $home = require __DIR__ . '/relay-home.php';
}
if (!is_string($home) || $home === '' || !is_file($home . '/relay-core.php') || !is_file($home . '/config.php') || !is_file($home . '/lead-schema.json')) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo '{"ok":false,"code":"RELAY_NOT_CONFIGURED"}';
    exit;
}

require $home . '/relay-core.php';

try {
    $config = require $home . '/config.php';
    $schema = ahv_relay_load_schema($home . '/lead-schema.json');
} catch (Throwable $error) {
    error_log('ahv-form-relay: configuration unreadable');
    $config = [];
    $schema = ['tables' => [], 'database' => '', 'site' => ''];
}
if (!is_array($config)) $config = [];

$body = (string) file_get_contents('php://input', false, null, 0, AHV_RELAY_MAX_BODY + 1);
list($status, $headers, $payload) = ahv_relay_handle($_SERVER, $body, $config, $schema, ahv_relay_pdo_factory($config), time());

http_response_code($status);
foreach ($headers as $name => $value) header($name . ': ' . $value);
echo $payload;
