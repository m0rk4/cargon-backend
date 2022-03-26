import { Controller, Get } from '@nestjs/common';
import { DriverApplicationService } from './driver-application.service';

@Controller('driver-application')
export class DriverApplicationController {
  constructor(private driverApplicationService: DriverApplicationService) {}

  @Get('not-approved')
  async getNotApprovedDriverApplications() {
    return this.driverApplicationService.getNotApprovedDriverApplications();
  }
}
