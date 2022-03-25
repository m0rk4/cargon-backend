import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransportApplicationStatus } from '@prisma/client';

@Injectable()
export class TransportApplicationService {
  constructor(private prismaService: PrismaService) {}

  getPendingTransportApplications(): Promise<any[]> {
    return this.prismaService.transportApplication.findMany({
      select: {
        id: true,
        documentUid: true,
        driver: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      where: {
        status: TransportApplicationStatus.PENDING,
      },
    });
  }
}
