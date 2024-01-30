-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEMBER', 'ADMINISTRATOR');

-- CreateTable
CREATE TABLE "financial_institutions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "amount_in_cents" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "submitted_by_uuid" UUID NOT NULL,
    "decided_by_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_submitted_by_uuid_fkey" FOREIGN KEY ("submitted_by_uuid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_decided_by_uuid_fkey" FOREIGN KEY ("decided_by_uuid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- automatic updated_at proc
CREATE FUNCTION fn_set_updated_on_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- enable triggers
CREATE TRIGGER tr_set_updated_on_timestamp_before_update_transaction
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE PROCEDURE fn_set_updated_on_timestamp();

CREATE TRIGGER tr_set_updated_on_timestamp_before_update_financial_institution
BEFORE UPDATE ON financial_institutions
FOR EACH ROW EXECUTE PROCEDURE fn_set_updated_on_timestamp();

CREATE TRIGGER tr_set_updated_on_timestamp_before_update_user
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE fn_set_updated_on_timestamp();
