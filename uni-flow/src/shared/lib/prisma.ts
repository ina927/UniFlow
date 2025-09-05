import { Prisma, PrismaClient } from '@/shared/generated/prisma';

// Create a type for our extended client
type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

// Create a function to properly type the extended client
function createPrismaClient() {
  const baseClient = new PrismaClient(prismaOptions);
  return baseClient.$extends(versionExtension);
}

// Declare the global prisma variable with the extended type
declare global {
  var prisma: ExtendedPrismaClient | undefined;
}

const prismaOptions: Prisma.PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'warn', 'error']
    : ['error'],
};

const versionExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      async update({ model, args, query }) {
        const hasVersionField = await prisma.$queryRawUnsafe(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = '${model.toLowerCase()}' 
          AND column_name = 'version'
        `).then(rows => Array.isArray(rows) && rows.length > 0);

        if (hasVersionField) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const current = await (prisma as any)[model].findUnique({
            where: args.where,
            select: { version: true }
          });
          
          if (current) {
            args.data = {
              ...args.data,
              version: (current.version || 0) + 1
            };
          }
        }
        
        return query(args);
      }
    }
  },
});

// Create and export the prisma client
export const prisma = globalThis.prisma || createPrismaClient();

// In development, store the Prisma client in the global object
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Export types
export type { PrismaClient };