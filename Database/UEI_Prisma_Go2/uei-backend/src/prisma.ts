import { PrismaClient } from "@prisma/client";

/**
 * Single shared Prisma Client instance. Prevents opening a fresh
 * connection pool on every import (especially important with
 * ts-node-dev / Next.js hot-reload, where re-importing this module
 * would otherwise exhaust Postgres connections).
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
