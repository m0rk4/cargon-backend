-- DropForeignKey
ALTER TABLE "OrderTransport" DROP CONSTRAINT "FK_OrderTransport_orders";

-- DropForeignKey
ALTER TABLE "OrderTransport" DROP CONSTRAINT "FK_OrderTransport_transports";

-- AddForeignKey
ALTER TABLE "OrderTransport" ADD CONSTRAINT "FK_OrderTransport_orders" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTransport" ADD CONSTRAINT "FK_OrderTransport_transports" FOREIGN KEY ("transportId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
