/*
  Warnings:

  - Added the required column `contactAvatar` to the `recurring_bills` table without a default value. This is not possible if the table is not empty.
  - Made the column `contactName` on table `recurring_bills` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `contactAvatar` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Made the column `contactName` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "recurring_bills" ADD COLUMN     "contactAvatar" TEXT NOT NULL,
ALTER COLUMN "contactName" SET NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "contactAvatar" TEXT NOT NULL,
ALTER COLUMN "contactName" SET NOT NULL;
