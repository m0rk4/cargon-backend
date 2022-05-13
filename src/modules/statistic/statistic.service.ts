import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class StatisticService {
  constructor(private prismaService: PrismaService) {}

  async getTransportPopularity() {
    return this.prismaService
      .$queryRaw`SELECT "vehicleType" AS "type", COUNT("vehicleType") AS "count" 
                                        FROM "public"."OrderTransport" 
                                        INNER JOIN "public"."Vehicle" 
                                            ON "public"."OrderTransport"."transportId" = "public"."Vehicle"."id" 
                                        GROUP BY "vehicleType"`;
  }

  async getDriversStatistic() {
    return this.prismaService
      .$queryRaw`SELECT "driverId" AS "driver_id", "lastName" AS "driver_surname", SUM("actualDistance") AS "mileage"
                                        FROM "public"."OrderTransport" 
                                        INNER JOIN "public"."Vehicle" 
                                            ON "public"."OrderTransport"."transportId" = "public"."Vehicle"."id" 
                                        INNER JOIN "public"."User"
                                            ON "public"."Vehicle"."driverId" = "public"."User"."id"
                                        GROUP BY "driver_id", "driver_surname"`;
  }

  async getOrdersTimeStatistic() {
    return this.prismaService.$queryRaw<
      { day_of_week: number | string; hour: number; orders_count: number }[]
    >`SELECT EXTRACT(DOW FROM "createdAt")  AS "day_of_week",
                                                                                     EXTRACT(HOUR FROM "createdAt") AS "hour",
                                                                                     COUNT(*)                       AS "orders_count"
                                                                              FROM "public"."Order"
                                                                              GROUP BY "day_of_week", "hour"`;
  }

  async getOrdersVolumes() {
    return this.prismaService
      .$queryRaw`SELECT SUM(CAST("weight" AS INT) * "length" * "width") as "volume", SUM("weight") as "weight"
                 FROM "public"."Cargo"`;
  }

  async getUsersOrdersCount() {
    return this.prismaService.$queryRaw`SELECT "email", COUNT(*) AS "count"
                 FROM "public"."Order"
                          INNER JOIN "public"."User" U ON U.id = "public"."Order"."ownerId"
                 GROUP BY "ownerId", "email" ORDER BY "count" DESC;`;
  }
}
