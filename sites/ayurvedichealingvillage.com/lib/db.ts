import mysql from 'mysql2/promise';

/**
 * The MySQL pool behind every AHV form (contact, enquiry, newsletter, …).
 *
 * Credentials live only in the environment. Nothing here reads a literal
 * host, user or password, and nothing here ever logs a connection string: a
 * thrown driver error can carry the DSN, so callers catch and translate
 * rather than surfacing driver text to the browser or the build log.
 *
 * One pool per server instance, cached on `globalThis` so a dev-server hot
 * reload reuses it instead of opening a new pool on every edit.
 */

const required = ['AHV_DB_HOST', 'AHV_DB_PORT', 'AHV_DB_NAME', 'AHV_DB_USER', 'AHV_DB_PASSWORD'] as const;

export function databaseConfigured(): boolean {
  return required.every((key) => (process.env[key] ?? '') !== '');
}

const cache = globalThis as { __ahvPool?: mysql.Pool };

export function pool(): mysql.Pool {
  if (cache.__ahvPool) return cache.__ahvPool;
  if (!databaseConfigured()) throw new Error('database is not configured');
  const created = mysql.createPool({
    host: process.env.AHV_DB_HOST,
    port: Number(process.env.AHV_DB_PORT),
    database: process.env.AHV_DB_NAME,
    user: process.env.AHV_DB_USER,
    password: process.env.AHV_DB_PASSWORD,
    ssl: process.env.AHV_DB_SSL === 'off' ? undefined : { rejectUnauthorized: process.env.AHV_DB_SSL !== 'insecure' },
    waitForConnections: true,
    connectionLimit: 4,
    maxIdle: 2,
    idleTimeout: 30000,
    connectTimeout: 10000,
    charset: 'utf8mb4_unicode_ci',
    timezone: 'Z',
    namedPlaceholders: false,
    dateStrings: true,
  });
  cache.__ahvPool = created;
  return created;
}
