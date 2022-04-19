import { Test } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import { CargoService } from '../cargo/cargo.service';
import { LocationService } from '../location/location.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { VehicleType } from '@prisma/client';

describe('VehicleService', () => {
  let vehicleService: VehicleService;
  let orderService: OrderService;
  let prismaService: PrismaService;

  const vehicle1 = {
    driverId: 0,
    yearOfProductionUNIX: 1649744443,
    brand: 'VW',
    model: 'Golf',
    registrationNumber: 'KB42673',
    vin: '12345NMJ234124422',
    insuranceExpiryTsUNIX: 1681280443,
    vehicleType: VehicleType.CAR,
    parameters: {
      width: 20,
      height: 30,
      length: 50,
      capacity: 200,
      mileage: 200,
    },
  };

  const vehicle2 = {
    driverId: 0,
    yearOfProductionUNIX: 1649744443,
    brand: 'VW',
    model: 'Golf',
    registrationNumber: 'KB15203',
    vin: '12345NMJ234124423',
    insuranceExpiryTsUNIX: 1681280443,
    vehicleType: VehicleType.CAR,
    parameters: {
      width: 40,
      height: 40,
      length: 60,
      capacity: 300,
      mileage: 200,
    },
  };

  const user = {
    firstName: 'Mark',
    lastName: 'Putyato',
    email: 'm0rk4@gmail.com',
    passwordHash: 'pass',
  };

  const order = {
    userId: 0,
    fromLocation: {
      city: {
        name: 'Minsk',
      },
      street: {
        name: 'Gikaly',
      },
      home: 5,
    },
    toLocation: {
      city: {
        name: 'Gomel',
      },
      street: {
        name: 'Gorkogo',
      },
      home: 19,
    },
    cargos: [
      {
        weight: 13,
        length: 10,
        width: 200,
        height: 30,
        name: 'Chair',
      },
    ],
  };

  let id1, id2, userId, orderId;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        VehicleService,
        UserService,
        OrderService,
        CargoService,
        LocationService,
        PrismaService,
      ],
    }).compile();

    orderService = moduleRef.get<OrderService>(OrderService);
    vehicleService = moduleRef.get<VehicleService>(VehicleService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    userId = (
      await prismaService.user.create({
        data: user,
      })
    ).id;
    vehicle1.driverId = userId;
    vehicle2.driverId = userId;

    id1 = (await vehicleService.createVehicle(vehicle1)).vehicleId;
    id2 = (await vehicleService.createVehicle(vehicle2)).vehicleId;

    orderId = (await orderService.createOrder(userId, order)).id;
    await orderService.bookOrder(orderId, userId, {
      transportIds: [id1, id2],
    });
  });

  afterEach(async () => {
    await prismaService.cargo.deleteMany({});
    await prismaService.orderTransport.deleteMany({});
    await prismaService.order.deleteMany({});
    await prismaService.location.deleteMany({});
    await prismaService.street.deleteMany({});
    await prismaService.city.deleteMany({});
    await prismaService.vehicleParameters.deleteMany({});
    await prismaService.vehicle.deleteMany({});
    await prismaService.user.deleteMany({});
  });

  describe('getVehicle', () => {
    it('should return vehicle by valid id', async () => {
      const vehicle = {
        id: id1,
        yearOfProduction: new Date(
          new Date(vehicle1.yearOfProductionUNIX * 1000).setHours(3, 0, 0, 0),
        ),
        brand: vehicle1.brand,
        model: vehicle1.model,
        registrationNumber: vehicle1.registrationNumber,
        driverId: userId,
        vin: vehicle1.vin,
        insuranceExpiryTs: new Date(vehicle1.insuranceExpiryTsUNIX * 1000),
        vehicleType: vehicle1.vehicleType,
      };

      expect(await vehicleService.getVehicle(id1)).toStrictEqual(vehicle);
    });

    it('should return null by invalid id', async () => {
      const invalidId = 100000000;
      const result = null;
      expect(await vehicleService.getVehicle(invalidId)).toBe(result);
    });
  });

  describe('getDriverVehicles', () => {
    it('should return all vehicles by valid driver id', async () => {
      const vehicles = [
        {
          id: id1,
          yearOfProduction: new Date(
            new Date(vehicle1.yearOfProductionUNIX * 1000).setHours(3, 0, 0, 0),
          ),
          brand: vehicle1.brand,
          model: vehicle1.model,
          registrationNumber: vehicle1.registrationNumber,
          driverId: userId,
          vin: vehicle1.vin,
          insuranceExpiryTs: new Date(vehicle1.insuranceExpiryTsUNIX * 1000),
          vehicleType: vehicle1.vehicleType,
        },
        {
          id: id2,
          yearOfProduction: new Date(
            new Date(vehicle2.yearOfProductionUNIX * 1000).setHours(3, 0, 0, 0),
          ),
          brand: vehicle2.brand,
          model: vehicle2.model,
          registrationNumber: vehicle2.registrationNumber,
          driverId: userId,
          vin: vehicle2.vin,
          insuranceExpiryTs: new Date(vehicle2.insuranceExpiryTsUNIX * 1000),
          vehicleType: vehicle2.vehicleType,
        },
      ];

      expect(await vehicleService.getDriverVehicles(userId)).toStrictEqual(
        vehicles,
      );
    });

    it('should return empty list by invalid driver id', async () => {
      const invalidDriverId = 100000000;
      const result = [];
      expect(
        await vehicleService.getDriverVehicles(invalidDriverId),
      ).toStrictEqual(result);
    });
  });

  describe('getOrderVehicles', () => {
    it('should return all vehicles by valid order id', async () => {
      const vehicles = [
        {
          transport: {
            id: id1,
            yearOfProduction: new Date(
              new Date(vehicle1.yearOfProductionUNIX * 1000).setHours(
                3,
                0,
                0,
                0,
              ),
            ),
            brand: vehicle1.brand,
            model: vehicle1.model,
            registrationNumber: vehicle1.registrationNumber,
            driverId: userId,
            vin: vehicle1.vin,
            insuranceExpiryTs: new Date(vehicle1.insuranceExpiryTsUNIX * 1000),
            vehicleType: vehicle1.vehicleType,
          },
        },
        {
          transport: {
            id: id2,
            yearOfProduction: new Date(
              new Date(vehicle2.yearOfProductionUNIX * 1000).setHours(
                3,
                0,
                0,
                0,
              ),
            ),
            brand: vehicle2.brand,
            model: vehicle2.model,
            registrationNumber: vehicle2.registrationNumber,
            driverId: userId,
            vin: vehicle2.vin,
            insuranceExpiryTs: new Date(vehicle2.insuranceExpiryTsUNIX * 1000),
            vehicleType: vehicle2.vehicleType,
          },
        },
      ];

      expect(await vehicleService.getOrderVehicles(orderId)).toStrictEqual(
        vehicles,
      );
    });

    it('should return empty list by invalid order id', async () => {
      const invalidOrderId = 1000000;
      const result = [];
      expect(
        await vehicleService.getOrderVehicles(invalidOrderId),
      ).toStrictEqual(result);
    });
  });

  describe('createVehicle', () => {
    it('should create vehicle and return its credentials', async () => {
      const vehicleToCreate = {
        driverId: userId,
        yearOfProductionUNIX: 1650216238,
        brand: 'Audi',
        model: 'A8',
        registrationNumber: 'KB10105',
        vin: '12345NMJ234122244',
        insuranceExpiryTsUNIX: 1681741438,
        vehicleType: VehicleType.CAR,
        parameters: {
          width: 20,
          height: 30,
          length: 50,
          capacity: 200,
          mileage: 200,
        },
      };
      const result = {
        vehicleId: 0,
        width: vehicleToCreate.parameters.width,
        height: vehicleToCreate.parameters.height,
        length: vehicleToCreate.parameters.length,
        capacity: vehicleToCreate.parameters.capacity,
        mileage: vehicleToCreate.parameters.mileage,
      };

      const parameters = await vehicleService.createVehicle(vehicleToCreate);
      result.vehicleId = parameters.vehicleId;
      expect(parameters).toStrictEqual(result);
    });
  });

  describe('updateMileage', () => {
    it('should increment distance on vehicle by id', async () => {
      const distance = 100;
      const vehicleId = id1;

      await vehicleService.updateMileage(id1, distance);
      const vehicleParameters =
        await prismaService.vehicleParameters.findUnique({
          where: { vehicleId },
        });
      expect(vehicleParameters.mileage).toStrictEqual(
        vehicle1.parameters.mileage + distance,
      );
    });
  });
});
