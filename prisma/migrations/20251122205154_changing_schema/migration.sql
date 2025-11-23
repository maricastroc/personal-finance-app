-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_recurringBillId_fkey";

-- AlterTable
ALTER TABLE "recurring_bills" ADD COLUMN     "baseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastPaidDate" TIMESTAMP(3),
ADD COLUMN     "nextDueDate" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurringBillId_fkey" FOREIGN KEY ("recurringBillId") REFERENCES "recurring_bills"("id") ON DELETE SET NULL ON UPDATE CASCADE;
