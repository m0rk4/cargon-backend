import { Test } from "@nestjs/testing";
import { LocationService } from '../src/modules/location/location.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';

describe('LocationService', () => {
  let locationService: LocationService;
  let prismaService: PrismaService;

  const city1 = {
    name: "Minsk"
  };
  const city2 = {
    name: "Gomel"
  };

  const street1 = {
    name: "Gikaly"
  };
  const street2 = {
    name: "Gorkogo"
  };

  const home1 = 5;
  const home2 = 19;

  let cityId1, cityId2, streetId1, streetId2, locationId1, locationId2;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LocationService, PrismaService],
    }).compile();

    locationService = moduleRef.get<LocationService>(LocationService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    cityId1 = (await prismaService.city.create({
      select: { id: true },
      data: city1
    })).id;
    cityId2 = (await prismaService.city.create({
      select: { id: true },
      data: city2
    })).id;

    streetId1 = (await prismaService.street.create({
      select: { id: true },
      data: street1
    })).id;
    streetId2 = (await prismaService.street.create({
      select: { id: true },
      data: street2
    })).id;

    locationId1 = (await prismaService.location.create({
      select: { id: true },
      data: {
        home: home1,
        streetId: streetId1,
        cityId: cityId1
      }
    })).id;
    locationId2 = (await prismaService.location.create({
      select: { id: true },
      data: {
        home: home2,
        streetId: streetId2,
        cityId: cityId2
      }
    })).id;
  });

  afterEach(async () => {
    await prismaService.location.deleteMany({});
    await prismaService.street.deleteMany({});
    await prismaService.city.deleteMany({});
  });

  describe('getStreets', () => {
    it('should return all available streets', async () => {
      const streets = [
        {
          id: streetId1,
          name: street1.name
        },
        {
          id: streetId2,
          name: street2.name
        }
      ];

      expect(await locationService.getStreets()).toStrictEqual(streets);
    });
  });

  describe('getCities', () => {
    it('should return all available cities', async () => {
      const cities = [
        {
          id: cityId1,
          name: city1.name
        },
        {
          id: cityId2,
          name: city2.name
        }
      ];

      expect(await locationService.getCities()).toStrictEqual(cities);
    });
  });

  describe('getOrCreateLocation', () => {
    it('should get existing location and return its credentials', async () => {
      const home: number = home1;
      const street: number = streetId1;
      const city: number = cityId1;

      const location = {
        home: home,
        street: {
          id: street,
          name: street1.name
        },
        city: {
          id: city,
          name: city1.name
        }
      };
      const result = {
        id: locationId1,
        home: home,
        streetId: street,
        cityId: city
      };

      expect(await locationService.getOrCreateLocation(location)).toStrictEqual(result);
    });

    it('should create new location and return its credentials', async () => {
      const home = 11;
      const street = "Pushkin";
      const city = "Pinsk";

      const location = {
        home: home,
        street: {
          name: street
        },
        city: {
          name: city
        }
      };
      const result = {
        id: locationId2 + 1,
        home: home,
        streetId: streetId2 + 1,
        cityId: cityId2 + 1
      };

      expect(await locationService.getOrCreateLocation(location)).toStrictEqual(result);
    });
  });

});
