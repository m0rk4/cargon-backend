import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { UpdateOrderDto } from './model/update-order-dto.interface';
import { CreateOrderDto } from './model/create-order-dto.interface';
import { LocationService } from '../location/location.service';
import { CargoService } from '../cargo/cargo.service';
import { CreateLocationDto } from '../location/model/create-location-dto.interface';
import { CreateCargoDto } from '../cargo/model/create-cargo-dto.interface';

@Injectable()
export class OrderService {
  private locationWhere = {
    select: {
      home: true,
      city: {
        select: {
          name: true,
        },
      },
      street: {
        select: {
          name: true,
        },
      },
    },
  };
  private orderInfo = {
    id: true,
    createdAt: true,
    updatedAt: true,
    user: {
      select: {
        firstName: true,
        lastName: true,
      },
    },
    fromLocation: this.locationWhere,
    toLocation: this.locationWhere,
    status: true,
  };

  constructor(
    private prismaService: PrismaService,
    private locationService: LocationService,
    private cargoService: CargoService,
  ) {}

  async createOrder(data: CreateOrderDto) {
    const [fromLocationId, toLocationId] = await this.getLocationsIds(
      data.fromLocation,
      data.toLocation,
    );
    const order = await this.prismaService.order.create({
      data: {
        ownerId: data.userId,
        toLocationId,
        fromLocationId,
      },
    });
    await this.createCargos(order.id, data.cargos);
    await this.setOrderTransports(order.id, data.transportIds);
    return order;
  }

  async getPendingOrders() {
    return this.prismaService.order.findMany({
      select: this.orderInfo,
      where: {
        status: OrderStatus.PENDING,
      },
    });
  }

  async getApprovedOrders() {
    return this.prismaService.order.findMany({
      select: this.orderInfo,
      where: {
        status: OrderStatus.APPROVED,
      },
    });
  }

  async getUserOrders(ownerId: number) {
    return this.prismaService.order.findMany({
      select: this.orderInfo,
      where: { ownerId },
    });
  }

  async getDriverOrders(driverId: number) {
    return this.prismaService.order.findMany({
      select: this.orderInfo,
      where: { driverId },
    });
  }

  // TODO: implement filtration for orders
  async getOrdersFilteredBy(status: OrderStatus, userId: number) {
    return {
      status,
      userId,
    };
  }

  async getOrder(id: number) {
    return this.prismaService.order.findUnique({
      select: this.orderInfo,
      where: { id },
    });
  }

  // To update cargos in the order use CargoController
  async updateOrder(id: number, data: UpdateOrderDto) {
    const [fromLocationId, toLocationId] = await this.getLocationsIds(
      data.fromLocation,
      data.toLocation,
    );
    return this.prismaService.order.update({
      where: { id },
      data: {
        toLocationId,
        fromLocationId,
        status: OrderStatus.PENDING,
      },
    });
  }

  async approveOrder(id: number) {
    return this.changeOrderStatus(id, OrderStatus.APPROVED);
  }

  async declineOrder(id: number) {
    return this.changeOrderStatus(id, OrderStatus.DECLINED);
  }

  async bookOrder(id: number, driverId: number) {
    return this.prismaService.order.update({
      select: { id: true },
      where: { id },
      data: { status: OrderStatus.BOOKED, driverId },
    });
  }

  async releaseOrder(id: number) {
    return this.changeOrderStatus(id, OrderStatus.APPROVED);
  }

  async completeOrder(id: number) {
    return this.changeOrderStatus(id, OrderStatus.COMPLETED);
  }

  private async getLocationsIds(
    fromLocation: CreateLocationDto,
    toLocation: CreateLocationDto,
  ): Promise<number[]> {
    return [
      await this.locationService
        .getOrCreateLocation(fromLocation)
        .then((res) => res['id']),
      await this.locationService
        .getOrCreateLocation(toLocation)
        .then((res) => res['id']),
    ];
  }

  private async createCargos(orderId: number, cargos: CreateCargoDto[]) {
    for (const cargo of cargos) {
      await this.cargoService.createCargo(orderId, cargo);
    }
  }

  private async setOrderTransports(orderId: number, transportIds: number[]) {
    for (const transportId of transportIds) {
      await this.prismaService.orderTransport.create({
        data: {
          orderId,
          transportId,
          actualDistance: await this.calcDistance(),
        },
      });
    }
  }

  private async changeOrderStatus(id: number, status: OrderStatus) {
    return this.prismaService.order.update({
      select: { id: true },
      where: { id },
      data: { status },
    });
  }

  // TODO: implement some logic to calc distances
  private async calcDistance() {
    return 100;
  }
}
