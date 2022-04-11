import { Injectable } from '@nestjs/common';
import { DriverApplicationStatus } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateDriverApplicationDto } from './model/create-driver-application-dto.interface';

@Injectable()
export class DriverApplicationService {
  constructor(private prismaService: PrismaService) {}

  async createDriverApplication(data: CreateDriverApplicationDto) {
    return this.prismaService.driverApplication.create({
      data,
    });
  }

  async getPendingDriverApplications() {
    return this.prismaService.driverApplication.findMany({
      where: {
        status: DriverApplicationStatus.PENDING,
      },
    });
  }

  async approveApplication(id: number) {
    return this.prismaService.driverApplication.update({
      where: {
        id,
      },
      select: {
        id: true,
      },
      data: {
        status: DriverApplicationStatus.APPROVED,
      },
    });
  }

  async declineApplication(id: number) {
    return this.prismaService.driverApplication.update({
      where: {
        id,
      },
      select: {
        id: true,
      },
      data: {
        status: DriverApplicationStatus.DECLINED,
      },
    });
  }
}
