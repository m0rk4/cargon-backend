/*
  Warnings:

  - You are about to drop the column `documentUid` on the `TransportApplication` table. All the data in the column will be lost.
  - Added the required column `documentPublicId` to the `TransportApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransportApplication" DROP COLUMN "documentUid",
ADD COLUMN     "documentPublicId" VARCHAR(255) NOT NULL;
