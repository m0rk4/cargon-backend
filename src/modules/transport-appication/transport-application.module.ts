import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { TransportApplicationController } from './transport-application.controller';
import { TransportApplicationService } from './transport-application.service';

@Module({
  imports: [],
  controllers: [TransportApplicationController],
  providers: [PrismaService, TransportApplicationService],
})
export class TransportApplicationModule {}
