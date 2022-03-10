/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Role";

-- CreateTable
CREATE TABLE "cargos" (
    "id" BIGSERIAL NOT NULL,
    "weight" SMALLINT NOT NULL,
    "length" SMALLINT NOT NULL,
    "width" SMALLINT NOT NULL,
    "height" SMALLINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "order_id" BIGINT NOT NULL,

    CONSTRAINT "PK_cargos" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_cities" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_application" (
    "id" BIGSERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "PK_dirver_application" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" BIGSERIAL NOT NULL,
    "city_id" SMALLINT NOT NULL,
    "street_id" SMALLINT NOT NULL,
    "home" SMALLINT NOT NULL,

    CONSTRAINT "PK_locations" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "owner_id" BIGINT NOT NULL,
    "from_location" BIGINT NOT NULL,
    "to_location" BIGINT NOT NULL,
    "status_id" SMALLINT NOT NULL,

    CONSTRAINT "PK_orders" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_transports" (
    "order_id" BIGINT NOT NULL,
    "transport_id" BIGINT NOT NULL,
    "actual_distance" SMALLINT NOT NULL,

    CONSTRAINT "PK_orders_transports" PRIMARY KEY ("order_id","transport_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_roles" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statuses" (
    "id" SMALLSERIAL NOT NULL,
    "status_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_statuses" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streets" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_streets" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_application" (
    "id" BIGSERIAL NOT NULL,
    "driver_id" BIGINT NOT NULL,
    "document_uuid" UUID NOT NULL,

    CONSTRAINT "PK_transport_application" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_types" (
    "id" SMALLSERIAL NOT NULL,
    "type_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_transport_types" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transports" (
    "id" BIGSERIAL NOT NULL,
    "year_of_production" DATE NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "registration_number" VARCHAR(7) NOT NULL,
    "driver_id" BIGINT NOT NULL,
    "type_id" SMALLINT NOT NULL,
    "vin" VARCHAR(17) NOT NULL,
    "insurance_expiry_ts" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "PK_transports" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(24) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "user_ratings" DECIMAL(3,2) NOT NULL,
    "role_id" SMALLINT NOT NULL,

    CONSTRAINT "PK_users" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_parameters" (
    "vehicle_id" BIGSERIAL NOT NULL,
    "width" SMALLINT NOT NULL,
    "height" SMALLINT NOT NULL,
    "length" SMALLINT NOT NULL,
    "capacity" SMALLINT NOT NULL,
    "mileage" SMALLINT NOT NULL,

    CONSTRAINT "PK_vehicle_parameters" PRIMARY KEY ("vehicle_id")
);

-- AddForeignKey
ALTER TABLE "cargos" ADD CONSTRAINT "FK_cargos_orders" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "FK_locations_cities" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "FK_locations_streets" FOREIGN KEY ("street_id") REFERENCES "streets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_locations_from" FOREIGN KEY ("from_location") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_locations_to" FOREIGN KEY ("to_location") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_statuses" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_users" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders_transports" ADD CONSTRAINT "FK_orders_transports_orders" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders_transports" ADD CONSTRAINT "FK_orders_transports_transports" FOREIGN KEY ("transport_id") REFERENCES "transports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transport_application" ADD CONSTRAINT "FK_transport_application_users" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "FK_transports_transport_types" FOREIGN KEY ("type_id") REFERENCES "transport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "FK_transports_users" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "FK_users_roles" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicle_parameters" ADD CONSTRAINT "FK_vehicle_parameters_transports" FOREIGN KEY ("vehicle_id") REFERENCES "transports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
