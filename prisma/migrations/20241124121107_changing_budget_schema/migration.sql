/*
  Warnings:

  - You are about to drop the column `endDate` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `budgets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "budgets" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
