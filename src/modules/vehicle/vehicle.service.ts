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
    return this.prismaService.orderTransport.findMany({
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
    const yearOfProduction = new Date(
      data.yearOfProductionUNIX * this.tsMultiplier,
    );
    const insuranceExpiryTs = new Date(
      data.insuranceExpiryTsUNIX * this.tsMultiplier,
    );

    return this.prismaService.$transaction(async (prisma) => {
      const vehicle = await prisma.vehicle.create({
        data: {
          yearOfProduction,
          insuranceExpiryTs,
          driverId: data.driverId,
          brand: data.brand,
          model: data.model,
          vin: data.vin,
          vehicleType: data.vehicleType,
          registrationNumber: data.registrationNumber,
        },
      });
      return prisma.vehicleParameters.create({
        data: { vehicleId: vehicle.id, ...data.parameters },
      });
    });
  }
}
