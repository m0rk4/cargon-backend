import { Controller, Get, Param, Put } from '@nestjs/common';
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
}
