/*
  Warnings:

  - You are about to drop the `cargos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `driver_application` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders_transports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `statuses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `streets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transport_application` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transport_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehicle_parameters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cargos" DROP CONSTRAINT "FK_cargos_orders";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "FK_locations_cities";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "FK_locations_streets";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_locations_from";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_users";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_statuses";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_locations_to";

-- DropForeignKey
ALTER TABLE "orders_transports" DROP CONSTRAINT "FK_orders_transports_orders";

-- DropForeignKey
ALTER TABLE "orders_transports" DROP CONSTRAINT "FK_orders_transports_transports";

-- DropForeignKey
ALTER TABLE "transport_application" DROP CONSTRAINT "FK_transport_application_users";

-- DropForeignKey
ALTER TABLE "transports" DROP CONSTRAINT "FK_transports_users";

-- DropForeignKey
ALTER TABLE "transports" DROP CONSTRAINT "FK_transports_transport_types";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "FK_users_roles";

-- DropForeignKey
ALTER TABLE "vehicle_parameters" DROP CONSTRAINT "FK_vehicle_parameters_transports";

-- DropTable
DROP TABLE "cargos";

-- DropTable
DROP TABLE "cities";

-- DropTable
DROP TABLE "driver_application";

-- DropTable
DROP TABLE "locations";

-- DropTable
DROP TABLE "orders";

-- DropTable
DROP TABLE "orders_transports";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "statuses";

-- DropTable
DROP TABLE "streets";

-- DropTable
DROP TABLE "transport_application";

-- DropTable
DROP TABLE "transport_types";

-- DropTable
DROP TABLE "transports";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "vehicle_parameters";

-- CreateTable
CREATE TABLE "Cargo" (
    "id" BIGSERIAL NOT NULL,
    "weight" SMALLINT NOT NULL,
    "length" SMALLINT NOT NULL,
    "width" SMALLINT NOT NULL,
    "height" SMALLINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "orderId" BIGINT NOT NULL,

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
    "id" BIGSERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "PK_driver_application" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" BIGSERIAL NOT NULL,
    "cityId" SMALLINT NOT NULL,
    "streetId" SMALLINT NOT NULL,
    "home" SMALLINT NOT NULL,

    CONSTRAINT "PK_Location" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "ownerId" BIGINT NOT NULL,
    "fromLocation" BIGINT NOT NULL,
    "toLocation" BIGINT NOT NULL,
    "statusId" SMALLINT NOT NULL,

    CONSTRAINT "PK_Order" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderTransport" (
    "orderId" BIGINT NOT NULL,
    "transportId" BIGINT NOT NULL,
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
    "id" BIGSERIAL NOT NULL,
    "driverId" BIGINT NOT NULL,
    "documentUid" UUID NOT NULL,

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
    "id" BIGSERIAL NOT NULL,
    "yearOfProduction" DATE NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "registrationNumber" VARCHAR(7) NOT NULL,
    "driverId" BIGINT NOT NULL,
    "typeId" SMALLINT NOT NULL,
    "vin" VARCHAR(17) NOT NULL,
    "insuranceExpiryTs" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "PK_Vehicles" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
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
    "vehicleId" BIGSERIAL NOT NULL,
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
