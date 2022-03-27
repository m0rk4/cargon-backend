/*
  Warnings:

  - You are about to drop the `OrderStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderStatusEnum" AS ENUM ('PENDING', 'APPROVED');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "FK_orders_OrderStatus";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatusEnum" NOT NULL DEFAULT E'PENDING';

-- DropTable
DROP TABLE "OrderStatus";
