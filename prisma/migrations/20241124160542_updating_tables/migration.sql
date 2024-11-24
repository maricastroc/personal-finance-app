/*
  Warnings:

  - You are about to drop the column `recurrenceDay` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `recurrenceFrequency` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_userId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "recurrenceDay",
DROP COLUMN "recurrenceFrequency";

-- DropTable
DROP TABLE "Balance";

-- CreateTable
CREATE TABLE "recurring_bills" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "recurrenceDay" INTEGER,
    "recurrenceFrequency" TEXT,
    "categoryId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "recurring_bills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recurring_bills_userId_idx" ON "recurring_bills"("userId");

-- CreateIndex
CREATE INDEX "recurring_bills_categoryId_idx" ON "recurring_bills"("categoryId");

-- AddForeignKey
ALTER TABLE "recurring_bills" ADD CONSTRAINT "recurring_bills_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_bills" ADD CONSTRAINT "recurring_bills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
