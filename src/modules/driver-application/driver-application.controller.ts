import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { DriverApplicationService } from './driver-application.service';
import { CreateDriverApplicationDto } from './model/create-driver-application-dto.interface';

@Controller('driver-application')
export class DriverApplicationController {
  constructor(private driverApplicationService: DriverApplicationService) {}

  @Get('pending')
  async getPendingDriverApplications() {
    return this.driverApplicationService.getPendingDriverApplications();
  }

  @Put(':id/approve')
  async approveApplication(@Param('id') id: string) {
    return this.driverApplicationService.approveApplication(+id);
  }

  @Put(':id/decline')
  async declineApplication(@Param('id') id: string) {
    return this.driverApplicationService.declineApplication(+id);
  }

  @Post()
  async createDriverApplication(
    @Body() createDriverApplicationDto: CreateDriverApplicationDto,
  ) {
    return this.driverApplicationService.createDriverApplication(
      createDriverApplicationDto,
    );
  }
}
