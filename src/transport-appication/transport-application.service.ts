import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransportApplicationStatus } from '@prisma/client';

@Injectable()
export class TransportApplicationService {
  constructor(private prismaService: PrismaService) {}

  getPendingTransportApplications(): Promise<any[]> {
    return this.prismaService.transportApplication.findMany({
      where: {
        status: TransportApplicationStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
