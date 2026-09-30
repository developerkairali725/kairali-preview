<?php
// Readiness regression for ahv_relay_health() (parent review 29 Sep 2026: composite-only token indexes and a missing
// nonce key used to report ready:true). Drives the REAL health function against synthetic information_schema
// fixtures in in-memory SQLite: no MySQL, no submitted data. Exit 1 on any case mismatch. Run by
// test/form-relay-php.test.mjs (skipped when php or pdo_sqlite is absent).
declare(strict_types=1);
require __DIR__ . '/../relay-core.php';
$sourceRoot = dirname(__DIR__);
$schema = ahv_relay_load_schema($sourceRoot . '/lead-schema.json');

function fixture(array $schema, string $tokenMode, string $nonceMode, bool $missingColumn = false): PDO
{
    $pdo = class_exists('Pdo\\Sqlite') ? new \Pdo\Sqlite('sqlite::memory:') : new PDO('sqlite::memory:');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    method_exists($pdo, 'createFunction') ? $pdo->createFunction('DATABASE', static fn() => $schema['database']) : $pdo->sqliteCreateFunction('DATABASE', static fn() => $schema['database']);
    $pdo->exec("ATTACH DATABASE ':memory:' AS information_schema");
    $pdo->exec('CREATE TABLE information_schema.COLUMNS (TABLE_SCHEMA TEXT, TABLE_NAME TEXT, COLUMN_NAME TEXT)');
    $pdo->exec('CREATE TABLE information_schema.STATISTICS (TABLE_SCHEMA TEXT, TABLE_NAME TEXT, COLUMN_NAME TEXT, NON_UNIQUE INTEGER, INDEX_NAME TEXT, SEQ_IN_INDEX INTEGER, SUB_PART INTEGER)');
    $column = $pdo->prepare('INSERT INTO information_schema.COLUMNS VALUES (?,?,?)');
    $index = $pdo->prepare('INSERT INTO information_schema.STATISTICS VALUES (?,?,?,?,?,?,?)');
    $tables = $schema['tables'];
    $tables['ahv_relay_nonce'] = ['nonce', 'key_id', 'seen_at'];
    foreach ($tables as $table => $fields) {
        $isNonce = $table === 'ahv_relay_nonce';
        $need = $isNonce ? $fields : array_merge(['id','site','form_type','submit_ip','submission_token','submit_time'], $fields, array_keys($schema['trackingColumns']));
        if (!$isNonce && in_array('consent', $fields, true)) $need[] = 'consent_at';
        foreach (array_unique($need) as $field) {
            if ($missingColumn && $isNonce && $field === 'seen_at') continue;
            $column->execute([$schema['database'], $table, $field]);
        }
        $mode = $isNonce ? $nonceMode : $tokenMode;
        $key = $isNonce ? 'nonce' : 'submission_token';
        if ($mode === 'none') continue;
        $index->execute([$schema['database'], $table, $key, $mode === 'nonunique' ? 1 : 0, 'candidate_key', 1, $mode === 'prefix' ? 8 : null]);
        if ($mode === 'composite' || $mode === 'valid_plus_composite') {
            $index->execute([$schema['database'], $table, $isNonce ? 'key_id' : 'id', 0, 'candidate_key', 2, null]);
        }
        if ($mode === 'valid_plus_composite') {
            $index->execute([$schema['database'], $table, $key, 0, 'full_single_key', 1, null]);
        }
    }
    return $pdo;
}

$cases = [
    ['both full single-column unique', 'valid', 'valid', false, true],
    ['composite token only', 'composite', 'valid', false, false],
    ['missing nonce index', 'valid', 'none', false, false],
    ['composite nonce only', 'valid', 'composite', false, false],
    ['token prefix unique only', 'prefix', 'valid', false, false],
    ['nonce prefix unique only', 'valid', 'prefix', false, false],
    ['nonunique token index', 'nonunique', 'valid', false, false],
    ['nonunique nonce index', 'valid', 'nonunique', false, false],
    ['missing required nonce column', 'valid', 'valid', true, false],
    ['valid keys plus unrelated composite', 'valid_plus_composite', 'valid_plus_composite', false, true],
];
$results = [];
foreach ($cases as [$name, $token, $nonce, $missing, $expected]) {
    $result = ahv_relay_health(fixture($schema, $token, $nonce, $missing), $schema);
    $results[] = ['case' => $name, 'expectedReady' => $expected, 'actualReady' => $result['ready'], 'pass' => $result['ready'] === $expected];
}
$failed = count(array_filter($results, static fn($r) => !$r['pass']));
echo json_encode(['scope' => 'Synthetic metadata only; no real MySQL or submitted data', 'tests' => count($results), 'failures' => $failed, 'cases' => $results], JSON_PRETTY_PRINT), "\n";
exit($failed ? 1 : 0);
