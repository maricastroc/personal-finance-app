/*
  Warnings:

  - You are about to drop the column `initialBalance` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "initialBalance",
ADD COLUMN     "currentBalance" DOUBLE PRECISION;
