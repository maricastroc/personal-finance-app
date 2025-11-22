-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "recurringBillId" TEXT;

-- CreateIndex
CREATE INDEX "transactions_recurringBillId_idx" ON "transactions"("recurringBillId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurringBillId_fkey" FOREIGN KEY ("recurringBillId") REFERENCES "recurring_bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
