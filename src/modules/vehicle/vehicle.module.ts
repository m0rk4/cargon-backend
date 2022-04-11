import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [],
  controllers: [VehicleController],
  providers: [PrismaService, VehicleService],
})
export class VehicleModule {}
