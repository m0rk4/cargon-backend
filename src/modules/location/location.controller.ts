import { Body, Controller, Get, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './model/create-location-dto.interface';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('streets')
  async getStreets() {
    return this.locationService.getStreets();
  }

  @Get('cities')
  async getCities() {
    return this.locationService.getCities();
  }

  @Post()
  async getOrCreateLocation(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.getOrCreateLocation(createLocationDto);
  }
}
