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

  @Put(':id/reject')
  async rejectTransportApplication(@Param('id') id: string) {
    return this.transportApplicationService.rejectTransportApplication(+id);
  }

  @Post()
  async createTransportApplication(@Body() { publicId }: { publicId: string }) {
    return this.transportApplicationService.createTransportApplication(
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
