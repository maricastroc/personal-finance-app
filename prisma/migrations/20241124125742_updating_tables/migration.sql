-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "recurrenceDay" INTEGER,
ALTER COLUMN "description" DROP NOT NULL;
