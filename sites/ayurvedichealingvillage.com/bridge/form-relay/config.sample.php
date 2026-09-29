<?php
/**
 * AHV form relay — operator configuration TEMPLATE.
 *
 * Copy to "$AHV_FORM_RELAY_HOME/config.php" on the database host (outside the
 * web root), chmod 600, and fill it there. Never commit the filled copy, never
 * paste its values into a ticket, chat, email or screenshot (HARD GATE 14).
 *
 * Every empty value below makes the relay answer 503 RELAY_NOT_CONFIGURED:
 * there is no default password, no default key and no plain-HTTP mode.
 */
return [
    'db' => [
        // Loopback only (127.0.0.1 / localhost / ::1) or a local unix socket.
        // Any other host is refused: the relay exists so MySQL is never
        // reached over an untrusted network without TLS.
        'host' => '127.0.0.1',
        'port' => 3306,
        'socket' => '',
        'name' => 'ktahv_ayurvedic_healing_village',
        // A dedicated user with SELECT, INSERT on the seven lead tables and
        // SELECT, INSERT, DELETE on ahv_relay_nonce — nothing else (RUNBOOK.md).
        'user' => '',
        'password' => '',
    ],
    // key id => shared secret (>= 32 characters; generate with
    // `openssl rand -base64 48`). The same pair is set on Vercel as
    // AHV_FORM_RELAY_KEY_ID / AHV_FORM_RELAY_SECRET. To rotate, add the new key
    // beside the old one, switch Vercel, then delete the old entry.
    'keys' => [
        // 'k1' => '',
    ],
    'clock_skew_seconds' => 300,
    'max_requests_per_minute' => 120,
];
