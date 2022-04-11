import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './model/create-vehicle-dto.interface';

@Controller('vehicle')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @Get(':id')
  async getVehicle(@Param('id') id: string) {
    return this.vehicleService.getVehicle(+id);
  }

  @Get('driver/:driver_id')
  async getDriverVehicles(@Param('driver_id') driverId: string) {
    return this.vehicleService.getDriverVehicles(+driverId);
  }

  @Get('order/:order_id')
  async getOrderVehicles(@Param('order_id') orderId: string) {
    return this.vehicleService.getOrderVehicles(+orderId);
  }

  @Post()
  async createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }
}
