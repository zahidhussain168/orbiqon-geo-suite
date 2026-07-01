/**
 * @orbiqon/db — shared Prisma client for the Orbiqon GEO Suite.
 *
 * Exposes a lazily-constructed singleton (so Next.js hot-reload doesn't spawn many clients) and a
 * `isDbConfigured()` helper. Persistence is OPTIONAL: when `DATABASE_URL` is unset, `getPrisma()`
 * returns null so callers can degrade gracefully instead of crashing.
 */
import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

/** True when a database connection string is configured. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

const globalForPrisma = globalThis as unknown as { __orbiqonPrisma?: PrismaClient };

/**
 * Get the shared Prisma client, or `null` when no `DATABASE_URL` is set (graceful degradation).
 * Callers should branch on null rather than assuming a database exists.
 */
export function getPrisma(): PrismaClient | null {
  if (!isDbConfigured()) return null;
  if (!globalForPrisma.__orbiqonPrisma) {
    globalForPrisma.__orbiqonPrisma = new PrismaClient();
  }
  return globalForPrisma.__orbiqonPrisma;
}
