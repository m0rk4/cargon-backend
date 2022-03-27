import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { TransportApplicationStatus } from '@prisma/client';

@Injectable()
export class TransportApplicationService {
  constructor(private prismaService: PrismaService) {}

  getPendingTransportApplications() {
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

  approveTransportApplication(id: number) {
    return this.changeTransportApplicationStatus(
      id,
      TransportApplicationStatus.APPROVED,
    );
  }

  rejectTransportApplication(id: number) {
    return this.changeTransportApplicationStatus(
      id,
      TransportApplicationStatus.CANCELLED,
    );
  }

  private changeTransportApplicationStatus(
    id: number,
    status: TransportApplicationStatus,
  ) {
    return this.prismaService.transportApplication.update({
      select: { id: true },
      where: { id },
      data: { status },
    });
  }
}
