// src/lib/prisma.ts
// import { PrismaClient } from "../../node_modules/.prisma/client"; // Adjust the import path as necessary
import { PrismaClient } from "@prisma/client"; // Import PrismaClient from the Prisma package
console.log("[Prisma Client] Initializing..."); // Log initialization start

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'], // Add Prisma logging
  });

console.log("[Prisma Client] Instance created or reused."); // Log instance ready

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}