import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class DriverApplicationService {
  constructor(private prismaService: PrismaService) {}

  async getNotApprovedDriverApplications() {
    return this.prismaService.driverApplication.findMany({
      where: {
        isApplicationApproved: false,
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
        isApplicationApproved: true,
      },
    });
  }
}
