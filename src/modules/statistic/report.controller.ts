import { Controller, Get, Param, Response } from "@nestjs/common";
import { ReportService } from "./report.service";
import { Public } from "../auth/decorators";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {
  }

  @Get("/transport-statistic/:type")
  @Public()
  async getTransportPopularity(@Response({ passthrough: true }) res, @Param("type") type: string) {
    return this.reportService.getTransportPopularity(type, res);
  }

  @Get("drivers-statistic/:type")
  @Public()
  async getDriversStatistic(@Response({ passthrough: true }) res, @Param("type") type: string) {
    return this.reportService.getDriversStatistic(type, res);
  }

  @Get("/order-statistic/:type")
  @Public()
  async getOrdersTimeStatistic(@Response({passthrough: true}) res, @Param('type') type: string) {
    return this.reportService.getOrdersTimeStatistic(type, res);
  }

  @Get("/volumes-statistic/:type")
  @Public()
  async getOrdersVolumes(@Response({ passthrough: true }) res, @Param("type") type: string) {
    return this.reportService.getOrdersVolumes(type, res);
  }
}
