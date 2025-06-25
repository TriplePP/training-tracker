// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// For global use
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Export the prisma client
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient();

// Save to global in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
