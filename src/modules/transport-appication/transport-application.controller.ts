import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransportApplicationService } from './transport-application.service';
import { RoleGuard } from '../../shared/guards';
import { GetCurrentUserId, Roles } from '../../shared/decorators';
import { Role } from '@prisma/client';

@Controller('transport-application')
export class TransportApplicationController {
  constructor(
    private transportApplicationService: TransportApplicationService,
  ) {}

  @Get('pending')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getPendingTransportApplications() {
    return this.transportApplicationService.getPendingTransportApplications();
  }

  @Put(':id/approve')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async approveTransportApplication(@Param('id') id: string) {
    return this.transportApplicationService.approveTransportApplication(+id);
  }

  @Put(':id/decline')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async declineTransportApplication(@Param('id') id: string) {
    return this.transportApplicationService.declineTransportApplication(+id);
  }

  @Get('document')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getTransportApplicationDocument(
    @Query('documentPublicId') documentPublicId: string,
  ) {
    return this.transportApplicationService.getTransportApplicationDocument(
      documentPublicId,
    );
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(Role.DRIVER)
  async createTransportApplication(
    @GetCurrentUserId() driverId: number,
    @Param('publicId') publicId: string,
  ) {
    return this.transportApplicationService.createTransportApplication(
      +driverId,
      publicId,
    );
  }
}
