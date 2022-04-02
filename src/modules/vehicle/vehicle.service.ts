import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateVehicleDto } from './model/create-vehicle-dto.interface';

@Injectable()
export class VehicleService {
  private tsMultiplier = 1000;

  constructor(private prismaService: PrismaService) {}

  async getVehicle(id: number) {
    return this.prismaService.vehicle.findUnique({
      where: { id },
    });
  }

  async getDriverVehicles(driverId: number) {
    return this.prismaService.vehicle.findMany({
      where: { driverId },
    });
  }

  async getOrderVehicles(orderId: number) {
    this.prismaService.orderTransport.findMany({
      select: { transport: true },
      where: { orderId },
    });
  }

  async updateMileage(id: number, distance: number) {
    return this.prismaService.vehicleParameters.update({
      select: { mileage: true },
      where: { vehicleId: id },
      data: { mileage: { increment: distance } },
    });
  }

  async createVehicle(data: CreateVehicleDto) {
    const vehicleParameters = data.parameters;
    delete data.parameters;

    const yearOfProduction = new Date(
      data.yearOfProductionUNIX * this.tsMultiplier,
    );
    delete data.yearOfProductionUNIX;

    const insuranceExpiryTs = new Date(
      data.insuranceExpiryTsUNIX * this.tsMultiplier,
    );
    delete data.insuranceExpiryTsUNIX;

    const vehicle = await this.prismaService.vehicle.create({
      data: { yearOfProduction, insuranceExpiryTs, ...data },
    });
    await this.prismaService.vehicleParameters.create({
      data: { vehicleId: vehicle.id, ...vehicleParameters },
    });

    return vehicle;
  }
}
