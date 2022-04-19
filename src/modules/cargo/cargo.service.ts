import { Injectable } from '@nestjs/common';
import { PrismaPromise, Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateCargoDto } from './model/create-cargo-dto.interface';
import { UpdateCargoDto } from './model/update-cargo-dto.interface';

@Injectable()
export class CargoService {
  constructor(private prismaService: PrismaService) {}

  async createCargo(orderId: number, data: CreateCargoDto) {
    return this.prismaService.cargo.create({
      data: { ...data, orderId },
    });
  }

  async getOrderCargos(orderId: number) {
    return this.prismaService.cargo.findMany({
      where: { orderId },
    });
  }

  async getCargo(id: number) {
    return this.prismaService.cargo.findUnique({
      where: { id },
    });
  }

  async updateCargo(id: number, data: UpdateCargoDto) {
    return this.prismaService.cargo.update({
      select: { id: true },
      where: { id },
      data,
    });
  }

  async deleteCargo(id: number) {
    return this.prismaService.cargo.delete({
      select: { id: true },
      where: { id },
    });
  }

  deleteOrderCargos(orderId: number): PrismaPromise<Prisma.BatchPayload> {
    return this.prismaService.cargo.deleteMany({
      where: { orderId },
    });
  }
}
