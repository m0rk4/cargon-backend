/*
  Warnings:

  - A unique constraint covering the columns `[cityId,streetId,home]` on the table `Location` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Location_cityId_streetId_home_key" ON "Location"("cityId", "streetId", "home");
