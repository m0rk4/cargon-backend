import { Module } from '@nestjs/common';
import { DriverApplicationController } from './driver-application.controller';
import { DriverApplicationService } from './driver-application.service';

@Module({
  imports: [],
  controllers: [DriverApplicationController],
  providers: [DriverApplicationService],
})
export class DriverApplicationModule {}
