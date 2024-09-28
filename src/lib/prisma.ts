// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // This prevents the `prisma` variable from being redefined in the `global` scope
  // when in development mode with hot-reloading
  var prisma: PrismaClient | undefined;
}

// Create a new instance of PrismaClient if it doesn't already exist
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
