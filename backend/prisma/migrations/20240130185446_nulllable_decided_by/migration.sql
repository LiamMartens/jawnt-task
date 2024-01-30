-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_decided_by_uuid_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "decided_by_uuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_decided_by_uuid_fkey" FOREIGN KEY ("decided_by_uuid") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
