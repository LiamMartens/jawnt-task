import dotenv from "dotenv";
import { PrismaClient, UserRole } from "@prisma/client";

dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

async function main() {
  const dummyUuid = "c2d29867-3d0b-d497-9191-18a9d8ee7830";

  await prisma.financialInstitution.upsert({
    where: { id: dummyUuid },
    update: {},
    create: {
      id: dummyUuid,
      name: "Bank of America",
      location: "New York, NY",
    },
  });

  await prisma.user.upsert({
    where: { id: dummyUuid },
    update: {},
    create: {
      id: dummyUuid,
      first_name: "John",
      last_name: "Doe",
      role: UserRole.ADMINISTRATOR,
      financial_institution_id: dummyUuid,
    },
  });
}

try {
  await main();
  await prisma.$disconnect();
} catch (err) {
  console.error(err);
  await prisma.$disconnect();
}
