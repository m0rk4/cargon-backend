import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CargoController } from './cargo.controller';
import { CargoService } from './cargo.service';

@Module({
  imports: [],
  controllers: [CargoController],
  providers: [PrismaService, CargoService],
})
export class CargoModule {}
