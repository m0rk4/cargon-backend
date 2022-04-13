import { Controller, Get } from '@nestjs/common';
import { LocationService } from './location.service';

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
}
