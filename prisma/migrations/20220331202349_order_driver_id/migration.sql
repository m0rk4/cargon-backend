-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "driverId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
