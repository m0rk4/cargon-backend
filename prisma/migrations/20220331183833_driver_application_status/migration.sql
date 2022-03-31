/*
  Warnings:

  - You are about to drop the column `isApplicationApproved` on the `DriverApplication` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DriverApplicationStatus" AS ENUM ('PENDING', 'CANCELLED', 'APPROVED');

-- AlterTable
ALTER TABLE "DriverApplication" DROP COLUMN "isApplicationApproved",
ADD COLUMN     "status" "DriverApplicationStatus" NOT NULL DEFAULT E'PENDING';
