-- AlterTable
ALTER TABLE "recurring_bills" ADD COLUMN     "recipientId" TEXT,
ADD COLUMN     "senderId" TEXT;

-- CreateIndex
CREATE INDEX "recurring_bills_senderId_idx" ON "recurring_bills"("senderId");

-- CreateIndex
CREATE INDEX "recurring_bills_recipientId_idx" ON "recurring_bills"("recipientId");

-- AddForeignKey
ALTER TABLE "recurring_bills" ADD CONSTRAINT "recurring_bills_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("accountId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_bills" ADD CONSTRAINT "recurring_bills_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("accountId") ON DELETE SET NULL ON UPDATE CASCADE;
