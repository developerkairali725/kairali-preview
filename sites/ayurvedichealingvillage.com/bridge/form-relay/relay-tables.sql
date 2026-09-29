-- AHV form relay — the one table the relay itself owns (single-use request
-- nonces for replay protection and the global per-minute ceiling).
-- The seven lead tables are NOT created here: they already exist in the
-- scoped database. Their readiness is verified with the relay's signed
-- `health` operation (RUNBOOK.md step 6), which reports missing columns and a
-- missing UNIQUE(submission_token) by name only.
USE `ktahv_ayurvedic_healing_village`;

CREATE TABLE IF NOT EXISTS `ahv_relay_nonce` (
  `nonce` varchar(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `key_id` varchar(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `seen_at` datetime NOT NULL,
  PRIMARY KEY (`nonce`),
  KEY `idx_ahv_relay_nonce_seen_at` (`seen_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
