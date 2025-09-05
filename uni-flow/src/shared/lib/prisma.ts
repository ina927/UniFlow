import { PrismaClient } from '@/shared/generated/prisma';

// Type for Prisma client options
type PrismaClientOptions = {
  log?: Array<'query' | 'info' | 'warn' | 'error'>;
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaOptions: PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'warn', 'error']
    : ['error'],
};

// Create a new Prisma client instance if one doesn't exist
export const prisma = globalThis.prisma || new PrismaClient(prismaOptions);

// In development, store the Prisma client in the global object
// to prevent creating new instances on hot reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Export types
export type { PrismaClient };
