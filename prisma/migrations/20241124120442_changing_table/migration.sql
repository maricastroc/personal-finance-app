/*
  Warnings:

  - You are about to drop the column `color` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `themeId` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_themeId_fkey";

-- DropIndex
DROP INDEX "categories_themeId_idx";

-- AlterTable
ALTER TABLE "budgets" ADD COLUMN     "themeId" TEXT;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "color",
DROP COLUMN "themeId";

-- CreateIndex
CREATE INDEX "budgets_themeId_idx" ON "budgets"("themeId");

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
