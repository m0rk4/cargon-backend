import { Test } from "@nestjs/testing";
import { LocationController } from '../src/modules/location/location.controller';
import { LocationService } from '../src/modules/location/location.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { prismaMock } from "../src/modules/test/singleton";

describe('LocationController', () => {
  let locationController: LocationController;
  let locationService: LocationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [LocationService, {
        provide: PrismaService,
        useValue: prismaMock
      }],
    }).compile();

    locationService = moduleRef.get<LocationService>(LocationService);
    locationController = moduleRef.get<LocationController>(LocationController);
  });

  describe('getStreets', () => {
    it('should return all available streets', async () => {
      const streets = [
          {
            id: 1,
            name: "Gikaly"
          },
          {
            id: 2,
            name: "Kalinina"
          },
          {
            id: 3,
            name: "Pushkin"
          }
        ];
      jest.spyOn(locationService, 'getStreets').mockImplementation(async () => streets);

      expect(await locationController.getStreets()).toBe(streets);
    });
  });

  describe('getCities', () => {
    it('should return all available cities', async () => {
      const cities = [
        {
          id: 1,
          name: "Minsk"
        },
        {
          id: 2,
          name: "Grodno"
        },
        {
          id: 3,
          name: "Slonim"
        },
        {
          id: 4,
          name: "Bobruysk"
        }
      ];
      jest.spyOn(locationService, 'getCities').mockImplementation(async () => cities);

      expect(await locationController.getCities()).toBe(cities);
    });
  });

  describe('getOrCreateLocation', () => {
    it('should get existing location and return its credentials', async () => {
      const cityId = 1;
      const streetId = 1;
      const location = {
        city: {
          id: cityId,
          name: "Minsk"
        },
        street: {
          id: streetId,
          name: "Gikaly"
        },
        home: 5
      };
      const result = {
        id: 7,
        cityId: cityId,
        streetId: streetId,
        home: 5
      };
      jest.spyOn(locationService, 'getOrCreateLocation').mockImplementation(async () => result);

      expect(await locationController.getOrCreateLocation(location)).toBe(result);
    });

    it('should create new location and return its credentials', async () => {
      const location = {
        city: {
          name: "Pinsk"
        },
        street: {
          name: "Gorkogo"
        },
        home: 7
      };
      const result = {
        id: 8,
        cityId: 7,
        streetId: 7,
        home: 7
      };
      jest.spyOn(locationService, 'getOrCreateLocation').mockImplementation(async () => result);

      expect(await locationController.getOrCreateLocation(location)).toBe(result);
    });
  });

});
