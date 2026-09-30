-- AHV form relay — newsletter double opt-in tables (relay ops newsletter.*,
-- SPEC.md "Newsletter"). Applied by a human with MySQL admin rights on the
-- database host (RUNBOOK.md step 3b). Never applied by the agent.
--
-- A dedicated, purpose-specific audience: these tables are NEVER the patient
-- lead tables, and the relay never writes a newsletter address into a lead
-- table or a lead into these. Idempotent: safe to run more than once.
--
-- What is stored, and why:
--  * ahv_newsletter_subscriber — one row per address (UNIQUE email_hash).
--      status: pending | confirmed | unsubscribed. Only `confirmed` with
--      suppressed = 0 is marketing-eligible. Consent evidence (version, the
--      exact permission text, display locale, source path, request IP) and
--      confirmed_at are written ONLY when a valid confirmation token is used.
--      public_id is random and is the only identifier inside unsubscribe links.
--  * ahv_newsletter_confirmation — one row per confirmation email: the durable,
--      recoverable mail job (outbox). Looked up by the SHA-256 of the opaque
--      token; the token itself is stored only SEALED (AES-256-GCM, key held
--      only by the website, bound to the hash) so a crashed or uncertain send
--      can be re-sent with the same link by the outbox worker. The seal is
--      cleared as soon as the job is sent, failed, used, revoked or abandoned.
--      mail_status: queued | sent | unknown (outcome uncertain) | failed.
--      Single use (used_at), expiring (expires_at), revocable (revoked_at),
--      leased (lease_until) so an inline send and the worker never race.
--  * ahv_newsletter_limit — atomic fixed-window abuse counters (per IP, per
--      address), one locked row per key. SHA-256 digests only, never the raw
--      IP or address.
USE `ktahv_ayurvedic_healing_village`;

CREATE TABLE IF NOT EXISTS `ahv_newsletter_subscriber` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `public_id` char(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `email_hash` char(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `email` varchar(254) NOT NULL,
  `status` varchar(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `suppressed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `confirmed_at` datetime NULL,
  `consent_version` varchar(64) NULL,
  `consent_text` varchar(500) NULL,
  `consent_locale` varchar(16) NULL,
  `consent_source_path` varchar(300) NULL,
  `consent_ip` varchar(45) NULL,
  `unsubscribed_at` datetime NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ahv_newsletter_email_hash` (`email_hash`),
  UNIQUE KEY `uq_ahv_newsletter_public_id` (`public_id`),
  KEY `idx_ahv_newsletter_status` (`status`, `suppressed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ahv_newsletter_confirmation` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `subscriber_id` bigint unsigned NOT NULL,
  `token_hash` char(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `consent_version` varchar(64) NOT NULL,
  `consent_text` varchar(500) NOT NULL,
  `consent_locale` varchar(16) NOT NULL,
  `source_path` varchar(300) NOT NULL,
  `request_ip` varchar(45) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `mail_status` varchar(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL DEFAULT 'queued',
  `mail_updated_at` datetime NULL,
  `token_sealed` varchar(200) CHARACTER SET ascii COLLATE ascii_bin NULL,
  `attempts` int unsigned NOT NULL DEFAULT 0,
  `lease_until` datetime NULL,
  `used_at` datetime NULL,
  `revoked_at` datetime NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ahv_newsletter_token_hash` (`token_hash`),
  KEY `idx_ahv_newsletter_confirmation_subscriber` (`subscriber_id`, `created_at`),
  KEY `idx_ahv_newsletter_confirmation_outbox` (`mail_status`, `lease_until`),
  CONSTRAINT `fk_ahv_newsletter_confirmation_subscriber` FOREIGN KEY (`subscriber_id`) REFERENCES `ahv_newsletter_subscriber` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ahv_newsletter_limit` (
  `kind` varchar(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `subject_hash` char(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `window_start` datetime NOT NULL,
  `hits` int unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`kind`, `subject_hash`),
  KEY `idx_ahv_newsletter_limit_window` (`window_start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
