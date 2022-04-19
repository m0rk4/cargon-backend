import { Test } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { prismaMock } from '../test/singleton';

describe('LocationController', () => {
  let locationController: LocationController;
  let locationService: LocationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        LocationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    locationService = moduleRef.get<LocationService>(LocationService);
    locationController = moduleRef.get<LocationController>(LocationController);
  });

  describe('getStreets', () => {
    it('should return all available streets', async () => {
      const streets = [
        {
          id: 1,
          name: 'Gikaly',
        },
        {
          id: 2,
          name: 'Kalinina',
        },
        {
          id: 3,
          name: 'Pushkin',
        },
      ];
      jest
        .spyOn(locationService, 'getStreets')
        .mockImplementation(async () => streets);

      expect(await locationController.getStreets()).toBe(streets);
    });
  });

  describe('getCities', () => {
    it('should return all available cities', async () => {
      const cities = [
        {
          id: 1,
          name: 'Minsk',
        },
        {
          id: 2,
          name: 'Grodno',
        },
        {
          id: 3,
          name: 'Slonim',
        },
        {
          id: 4,
          name: 'Bobruysk',
        },
      ];
      jest
        .spyOn(locationService, 'getCities')
        .mockImplementation(async () => cities);

      expect(await locationController.getCities()).toBe(cities);
    });
  });
});
