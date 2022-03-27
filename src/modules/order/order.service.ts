import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getNotApprovedOrders() {
    const locationWhere = {
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
    return this.prisma.order.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        fromLocation: locationWhere,
        toLocation: locationWhere,
        status: true,
      },
      where: {
        status: OrderStatus.PENDING,
      },
    });
  }

  async approveOrder(id: number) {
    return this.prisma.order.update({
      select: { id: true },
      where: { id },
      data: { status: OrderStatus.APPROVED },
    });
  }
}
