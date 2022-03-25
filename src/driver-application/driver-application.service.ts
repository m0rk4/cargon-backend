import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
