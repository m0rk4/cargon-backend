-- CreateEnum
CREATE TYPE "TransportApplicationStatus" AS ENUM ('PENDING', 'CANCELLED', 'APPROVED');

-- CreateTable
CREATE TABLE "Cargo" (
    "id" SERIAL NOT NULL,
    "weight" SMALLINT NOT NULL,
    "length" SMALLINT NOT NULL,
    "width" SMALLINT NOT NULL,
    "height" SMALLINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "PK_Cargo" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_City" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverApplication" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "PK_driver_application" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "cityId" SMALLINT NOT NULL,
    "streetId" SMALLINT NOT NULL,
    "home" SMALLINT NOT NULL,

    CONSTRAINT "PK_Location" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "fromLocation" INTEGER NOT NULL,
    "toLocation" INTEGER NOT NULL,
    "statusId" SMALLINT NOT NULL,

    CONSTRAINT "PK_Order" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderTransport" (
    "orderId" INTEGER NOT NULL,
    "transportId" INTEGER NOT NULL,
    "actualDistance" SMALLINT NOT NULL,

    CONSTRAINT "PK_OrderTransport" PRIMARY KEY ("orderId","transportId")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_Role" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatus" (
    "id" SMALLSERIAL NOT NULL,
    "statusName" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_OrderStatus" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Street" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_Street" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportApplication" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "documentUid" UUID NOT NULL,
    "status" "TransportApplicationStatus" NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "PK_TransportApplication" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportType" (
    "id" SMALLSERIAL NOT NULL,
    "typeName" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_TransportType" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "yearOfProduction" DATE NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "registrationNumber" VARCHAR(7) NOT NULL,
    "driverId" INTEGER NOT NULL,
    "typeId" SMALLINT NOT NULL,
    "vin" VARCHAR(17) NOT NULL,
    "insuranceExpiryTs" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "PK_Vehicles" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(24) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "userRating" DECIMAL(3,2) NOT NULL,
    "roleId" SMALLINT NOT NULL,

    CONSTRAINT "PK_User" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleParameters" (
    "vehicleId" SERIAL NOT NULL,
    "width" SMALLINT NOT NULL,
    "height" SMALLINT NOT NULL,
    "length" SMALLINT NOT NULL,
    "capacity" SMALLINT NOT NULL,
    "mileage" SMALLINT NOT NULL,

    CONSTRAINT "PK_VehicleParameters" PRIMARY KEY ("vehicleId")
);

-- AddForeignKey
ALTER TABLE "Cargo" ADD CONSTRAINT "FK_Cargo_Order" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "FK_Location_City" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "FK_Location_Street" FOREIGN KEY ("streetId") REFERENCES "Street"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "FK_orders_locations_from" FOREIGN KEY ("fromLocation") REFERENCES "Location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "FK_orders_locations_to" FOREIGN KEY ("toLocation") REFERENCES "Location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "FK_orders_OrderStatus" FOREIGN KEY ("statusId") REFERENCES "OrderStatus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "FK_orders_User" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrderTransport" ADD CONSTRAINT "FK_OrderTransport_orders" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrderTransport" ADD CONSTRAINT "FK_OrderTransport_transports" FOREIGN KEY ("transportId") REFERENCES "Vehicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TransportApplication" ADD CONSTRAINT "FK_TransportApplication_User" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "FK_Transport_TransportType" FOREIGN KEY ("typeId") REFERENCES "TransportType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "FK_Vehicle_User" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "FK_User_Role" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VehicleParameters" ADD CONSTRAINT "FK_VehicleParameters_Vehicle" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
