/*
  Warnings:

  - The values [CANCELLED] on the enum `DriverApplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CANCELLED] on the enum `TransportApplicationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DriverApplicationStatus_new" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');
ALTER TABLE "DriverApplication" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "DriverApplication" ALTER COLUMN "status" TYPE "DriverApplicationStatus_new" USING ("status"::text::"DriverApplicationStatus_new");
ALTER TYPE "DriverApplicationStatus" RENAME TO "DriverApplicationStatus_old";
ALTER TYPE "DriverApplicationStatus_new" RENAME TO "DriverApplicationStatus";
DROP TYPE "DriverApplicationStatus_old";
ALTER TABLE "DriverApplication" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TransportApplicationStatus_new" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');
ALTER TABLE "TransportApplication" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TransportApplication" ALTER COLUMN "status" TYPE "TransportApplicationStatus_new" USING ("status"::text::"TransportApplicationStatus_new");
ALTER TYPE "TransportApplicationStatus" RENAME TO "TransportApplicationStatus_old";
ALTER TYPE "TransportApplicationStatus_new" RENAME TO "TransportApplicationStatus";
DROP TYPE "TransportApplicationStatus_old";
ALTER TABLE "TransportApplication" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
