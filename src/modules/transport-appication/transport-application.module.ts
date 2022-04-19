import { Module } from '@nestjs/common';
import { TransportApplicationController } from './transport-application.controller';
import { TransportApplicationService } from './transport-application.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TransportApplicationController],
  providers: [TransportApplicationService],
})
export class TransportApplicationModule {}
