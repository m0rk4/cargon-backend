import { Controller, Get, Param, Response, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { RoleGuard } from '../auth/guards';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('/transport-statistic/:type')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  async getTransportPopularity(
    @Response({ passthrough: true }) res,
    @Param('type') type: string,
  ) {
    return this.reportService.getTransportPopularity(type, res);
  }

  @Get('drivers-statistic/:type')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  async getDriversStatistic(
    @Response({ passthrough: true }) res,
    @Param('type') type: string,
  ) {
    return this.reportService.getDriversStatistic(type, res);
  }

  @Get('/order-statistic/:type')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  async getOrdersTimeStatistic(
    @Response({ passthrough: true }) res,
    @Param('type') type: string,
  ) {
    return this.reportService.getOrdersTimeStatistic(type, res);
  }

  @Get('/volumes-statistic/:type')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  async getOrdersVolumes(
    @Response({ passthrough: true }) res,
    @Param('type') type: string,
  ) {
    return this.reportService.getOrdersVolumes(type, res);
  }
}
