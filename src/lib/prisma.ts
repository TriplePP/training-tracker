// src/lib/prisma.ts
import {PrismaClient} from '@prisma/client';

// For global use
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Create Prisma client with error logging
function createPrismaClient() {
    try {
        // Configure logging based on environment
        const client = new PrismaClient({
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
        });

        // Log any unexpected errors during queries
        client.$use(async (params, next) => {
            try {
                return await next(params);
            } catch (error) {
                console.error(`Prisma error in ${params.model}.${params.action}:`, error);
                throw error;
            }
        });

        return client;
    } catch (error) {
        console.error('Failed to create Prisma client:', error);
        throw error; // Re-throw to prevent app from starting with broken DB connection
    }
}

// Export the prisma client
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Save to global in development
if (process.env.NODE_ENV !== 'production') {
    try {
        globalForPrisma.prisma = prisma;
    } catch (error) {
        console.error('Failed to set global Prisma client:', error);
    }
}
