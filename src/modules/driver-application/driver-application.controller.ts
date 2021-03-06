import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DriverApplicationService } from './driver-application.service';
import { CreateDriverApplicationDto } from './model/create-driver-application-dto.interface';
import { RoleGuard } from '../auth/guards';
import { Public, Roles } from '../auth/decorators';
import { Role } from '@prisma/client';

@Controller('driver-application')
export class DriverApplicationController {
  constructor(private driverApplicationService: DriverApplicationService) {}

  @Get('pending')
  @UseGuards(RoleGuard)
  @Roles(Role.MANAGER)
  async getPendingDriverApplications() {
    return this.driverApplicationService.getPendingDriverApplications();
  }

  @Put(':id/approve')
  @UseGuards(RoleGuard)
  @Roles(Role.MANAGER)
  async approveApplication(@Param('id') id: string) {
    return this.driverApplicationService.approveApplication(+id);
  }

  @Put(':id/decline')
  @UseGuards(RoleGuard)
  @Roles(Role.MANAGER)
  async declineApplication(@Param('id') id: string) {
    return this.driverApplicationService.declineApplication(+id);
  }

  @Post()
  @Public()
  async createDriverApplication(
    @Body() createDriverApplicationDto: CreateDriverApplicationDto,
  ) {
    return this.driverApplicationService.createDriverApplication(
      createDriverApplicationDto,
    );
  }
}
