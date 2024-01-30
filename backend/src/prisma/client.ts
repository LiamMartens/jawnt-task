import { PrismaClient } from "@prisma/client";

export const client = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
