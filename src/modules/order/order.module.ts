import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CargoService } from '../cargo/cargo.service';
import { LocationService } from '../location/location.service';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [PrismaService, OrderService, CargoService, LocationService],
})
export class OrderModule {}
