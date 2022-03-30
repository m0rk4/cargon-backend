import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { UpdateCargoDto } from './model/update-cargo-dto.interface';
import { CreateCargoDto } from './model/create-cargo-dto.interface';

@Controller('cargo')
export class CargoController {
  constructor(private cargoService: CargoService) {}

  @Get('order/:orderId')
  async getOrderCargos(@Param('orderId') orderId: string) {
    return this.cargoService.getOrderCargos(+orderId);
  }

  @Get(':id')
  async getCargo(@Param('id') id: string) {
    return this.cargoService.getCargo(+id);
  }

  @Put(':id')
  async updateCargo(
    @Param('id') id: string,
    @Body() updateCargoDto: UpdateCargoDto,
  ) {
    return this.cargoService.updateCargo(+id, updateCargoDto);
  }

  @Put(':id/delete')
  async deleteCargo(@Param('id') id: string) {
    return this.cargoService.deleteCargo(+id);
  }

  @Post('order/:orderId')
  async createCargo(
    @Param('orderId') orderId: string,
    @Body() createCargoDto: CreateCargoDto,
  ) {
    return this.cargoService.createCargo(+orderId, createCargoDto);
  }
}
