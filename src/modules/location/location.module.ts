import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [],
  controllers: [LocationController],
  providers: [PrismaService, LocationService],
})
export class LocationModule {}
