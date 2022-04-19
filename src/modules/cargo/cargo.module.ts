import { Module } from '@nestjs/common';
import { CargoController } from './cargo.controller';
import { CargoService } from './cargo.service';

@Module({
  imports: [],
  controllers: [CargoController],
  providers: [CargoService],
})
export class CargoModule {}
