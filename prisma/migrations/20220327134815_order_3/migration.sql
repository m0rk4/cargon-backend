/*
  Warnings:

  - You are about to drop the column `fromLocation` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `toLocation` on the `Order` table. All the data in the column will be lost.
  - Added the required column `fromLocationId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toLocationId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "FK_orders_locations_from";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "FK_orders_locations_to";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "fromLocation",
DROP COLUMN "toLocation",
ADD COLUMN     "fromLocationId" INTEGER NOT NULL,
ADD COLUMN     "toLocationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "FK_orders_locations_from" FOREIGN KEY ("fromLocationId") REFERENCES "Location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "FK_orders_locations_to" FOREIGN KEY ("toLocationId") REFERENCES "Location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
