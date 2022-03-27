/*
  Warnings:

  - You are about to drop the column `statusId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('USER');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "FK_User_Role";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "statusId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleId",
ADD COLUMN     "role" "RoleEnum" NOT NULL DEFAULT E'USER';

-- DropTable
DROP TABLE "Role";
