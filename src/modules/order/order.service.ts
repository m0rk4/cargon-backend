import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './model/create-order-dto.interface';
import { LocationService } from '../location/location.service';
import { CargoService } from '../cargo/cargo.service';
import { CreateLocationDto } from '../location/model/create-location-dto.interface';
import { CreateCargoDto } from '../cargo/model/create-cargo-dto.interface';
import { BookOrderDto } from './model/book-order-dto.interface';
import { UpdateOrderLocations } from './model/update-order-locations.interface';

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

  private userInfo = {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      userRating: true,
      email: true,
    },
  };

  private orderInfo = {
    id: true,
    createdAt: true,
    updatedAt: true,
    user: this.userInfo,
    cargos: {},
    driver: this.userInfo,
    fromLocation: this.locationWhere,
    toLocation: this.locationWhere,
    status: true,
  };

  constructor(
    private prismaService: PrismaService,
    private locationService: LocationService,
    private cargoService: CargoService,
  ) {}

  async createOrder(ownerId: number, data: CreateOrderDto) {
    const [fromLocationId, toLocationId] = await this.getLocationsIds(
      data.fromLocation,
      data.toLocation,
    );
    const order = await this.prismaService.order.create({
      data: {
        ownerId,
        toLocationId,
        fromLocationId,
      },
    });
    await this.createCargos(order.id, data.cargos);

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

  async updateOrderCargos(id: number, cargos: CreateCargoDto[]) {
    const deleteOldCargos = this.cargoService.deleteOrderCargos(id);
    const addNewCargos = this.prismaService.order.update({
      where: { id },
      data: { cargos: { create: cargos }, status: OrderStatus.PENDING },
    });
    return this.prismaService.$transaction([deleteOldCargos, addNewCargos]);
  }

  async updateOrderLocations(id: number, data: UpdateOrderLocations) {
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

  async bookOrder(id: number, driverId: number, data: BookOrderDto) {
    return this.prismaService.$transaction(async (prisma) => {
      await this.setOrderTransports(id, data.transportIds);
      return prisma.order.update({
        select: { id: true },
        where: { id },
        data: { status: OrderStatus.BOOKED, driverId },
      });
    });
  }

  async releaseOrder(id: number) {
    return this.prismaService.$transaction([
      this.prismaService.order.update({
        select: { id: true },
        where: { id },
        data: { status: OrderStatus.APPROVED, driverId: null },
      }),
      this.prismaService.orderTransport.deleteMany({
        where: { orderId: id },
      }),
    ]);
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
    const transports = transportIds.map((transportId) => {
      return {
        orderId,
        transportId,
        actualDistance: OrderService.calcDistance(),
      };
    });
    return this.prismaService.orderTransport.createMany({
      data: transports,
    });
  }

  private async changeOrderStatus(id: number, status: OrderStatus) {
    return this.prismaService.order.update({
      select: { id: true },
      where: { id },
      data: { status },
    });
  }

  // TODO: implement some logic to calc distances
  private static calcDistance() {
    return 100;
  }
}
