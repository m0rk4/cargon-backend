/*
  Warnings:

  - You are about to drop the column `typeId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the `TransportType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `vehicleType` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('TRUCK', 'BUS', 'MINIBUS', 'CAR');

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "FK_Transport_TransportType";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "typeId",
ADD COLUMN     "vehicleType" "VehicleType" NOT NULL;

-- DropTable
DROP TABLE "TransportType";
