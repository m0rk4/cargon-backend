import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { TransportApplicationService } from './transport-application.service';
import { RoleGuard } from '../auth/guards';
import { GetCurrentUserId, Roles } from '../auth/decorators';
import { Role } from '@prisma/client';

@Controller('transport-application')
export class TransportApplicationController {
  constructor(
    private transportApplicationService: TransportApplicationService,
  ) {}

  @Get('pending')
  @UseGuards(RoleGuard)
  @Roles(Role.MANAGER)
  async getPendingTransportApplications() {
    return this.transportApplicationService.getPendingTransportApplications();
  }

  @Get('document')
  @UseGuards(RoleGuard)
  @Roles(Role.MANAGER)
  async getTransportApplicationDocument(
    @Response({ passthrough: true }) res,
    @Query('documentPublicId') documentPublicId: string,
  ) {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="file.pdf"',
    });
    return this.transportApplicationService.getTransportApplicationDocument(
      documentPublicId,
    );
  }

  @Put(':id/approve')
  @UseGuards(RoleGuard)
  @Roles(Role.MANAGER)
  async approveTransportApplication(@Param('id') id: string) {
    return this.transportApplicationService.approveTransportApplication(+id);
  }

  @Put(':id/decline')
  @UseGuards(RoleGuard)
  @Roles(Role.MANAGER)
  async declineTransportApplication(@Param('id') id: string) {
    return this.transportApplicationService.declineTransportApplication(+id);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(Role.DRIVER)
  async createTransportApplication(
    @GetCurrentUserId() driverId: number,
    @Body() { publicId }: { publicId: string },
  ) {
    return this.transportApplicationService.createTransportApplication(
      +driverId,
      publicId,
    );
  }
}
