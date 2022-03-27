import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [PrismaService, OrderService],
})
export class OrderModule {}
