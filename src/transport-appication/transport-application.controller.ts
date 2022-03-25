import { Controller, Get } from '@nestjs/common';
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
}
