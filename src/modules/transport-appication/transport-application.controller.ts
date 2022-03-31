import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TransportApplicationService } from './transport-application.service';

@Controller('transport-application')
export class TransportApplicationController {
  constructor(
    private transportApplicationService: TransportApplicationService,
  ) {}

  @Get('pending')
  async getPendingTransportApplications() {
    return this.transportApplicationService.getPendingTransportApplications();
  }

  @Put(':id/approve')
  async approveTransportApplication(@Param('id') id: string) {
    return this.transportApplicationService.approveTransportApplication(+id);
  }

  @Put(':id/decline')
  async declineTransportApplication(@Param('id') id: string) {
    return this.transportApplicationService.declineTransportApplication(+id);
  }

  @Post()
  async createTransportApplication(
    @Body() { driverId, publicId }: { driverId: string; publicId: string },
  ) {
    return this.transportApplicationService.createTransportApplication(
      +driverId,
      publicId,
    );
  }

  @Get('document')
  async getTransportApplicationDocument(
    @Query('documentPublicId') documentPublicId: string,
  ) {
    return this.transportApplicationService.getTransportApplicationDocument(
      documentPublicId,
    );
  }
}
