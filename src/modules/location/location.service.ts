import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateLocationDto } from './model/create-location-dto.interface';

@Injectable()
export class LocationService {
  constructor(private prismaService: PrismaService) {}

  async getStreets() {
    return this.prismaService.street.findMany();
  }

  async getCities() {
    return this.prismaService.city.findMany();
  }

  async getOrCreateLocation(data: CreateLocationDto) {
    const streetId: number =
      data.streetId ||
      (await this.createStreet(data.street).then((res) => res['id']));
    const cityId: number =
      data.cityId ||
      (await this.createCity(data.city).then((res) => res['id']));
    const query = {
      cityId,
      streetId,
      home: data.home,
    };
    return (
      (await this.prismaService.location.findFirst({ where: { ...query } })) ||
      (await this.prismaService.location.create({ data: query }))
    );
  }

  private async createStreet(name: string) {
    return this.prismaService.street.create({
      data: { name },
    });
  }

  private async createCity(name: string) {
    return this.prismaService.city.create({
      data: { name },
    });
  }
}
