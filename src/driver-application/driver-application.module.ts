import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriverApplicationController } from './driver-application.controller';
import { DriverApplicationService } from './driver-application.service';

@Module({
  imports: [],
  controllers: [DriverApplicationController],
  providers: [PrismaService, DriverApplicationService],
})
export class DriverApplicationModule {}
