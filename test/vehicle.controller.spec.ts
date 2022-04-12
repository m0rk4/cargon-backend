import { Test } from "@nestjs/testing";
import { VehicleController } from '../src/modules/vehicle/vehicle.controller';
import { VehicleService } from '../src/modules/vehicle/vehicle.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { prismaMock } from "../src/modules/test/singleton";
import { VehicleType } from "@prisma/client";

describe('VehicleController', () => {
  let vehicleController: VehicleController;
  let vehicleService: VehicleService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [VehicleService, {
        provide: PrismaService,
        useValue: prismaMock
      }],
    }).compile();

    vehicleService = moduleRef.get<VehicleService>(VehicleService);
    vehicleController = moduleRef.get<VehicleController>(VehicleController);
  });

  describe('getVehicle', () => {
    it('should return vehicle by valid id', async () => {
      const validId = "1";
      const vehicle = {
        id: +validId,
        yearOfProduction: new Date(),
        brand: "VW",
        model: "Crafter",
        registrationNumber: "AB12346",
        driverId: 2,
        vin: "12345NMJ23412",
        insuranceExpiryTs: new Date(),
        vehicleType: VehicleType.TRUCK
      };
      jest.spyOn(vehicleService, 'getVehicle').mockImplementation(async () => vehicle);

      expect(await vehicleController.getVehicle(validId)).toBe(vehicle);
    });

    it('should return undefined by invalid id', async () => {
      const invalidId = "1000000";
      const result = undefined;
      jest.spyOn(vehicleService, 'getVehicle').mockImplementation(async () => result);

      expect(await vehicleController.getVehicle(invalidId)).toBe(result);
    });
  });

  describe('getDriverVehicles', () => {
    it('should return all vehicles by valid driver id', async () => {
      const validDriverId = "1";
      const vehicles = [
        {
          id: 3,
          yearOfProduction: new Date(),
          brand: "Ford",
          model: "Transit",
          registrationNumber: "AB62346",
          driverId: 1,
          vin: "12345NMJ23412",
          insuranceExpiryTs: new Date(),
          vehicleType: VehicleType.CAR
        }
      ];
      jest.spyOn(vehicleService, 'getDriverVehicles').mockImplementation(async () => vehicles);

      expect(await vehicleController.getDriverVehicles(validDriverId)).toBe(vehicles);
    });

    it('should return empty list by invalid driver id', async () => {
      const invalidDriverId = "1000000";
      const result = [];
      jest.spyOn(vehicleService, 'getDriverVehicles').mockImplementation(async () => result);

      expect(await vehicleController.getDriverVehicles(invalidDriverId)).toBe(result);
    });
  });

  describe('getOrderVehicles', () => {
    it('should return a vehicle by valid order id', async () => {
      const validOrderId = "1";
      const vehicle = [{
        transport: {
          id: 3,
          yearOfProduction: new Date(),
          brand: "Ford",
          model: "Transit",
          registrationNumber: "AB62346",
          driverId: 1,
          vin: "12345NMJ23412",
          insuranceExpiryTs: new Date(),
          vehicleType: VehicleType.CAR
        }
      }];
      jest.spyOn(vehicleService, 'getOrderVehicles').mockImplementation(async () => vehicle);

      expect(await vehicleController.getOrderVehicles(validOrderId)).toBe(vehicle);
    });

    it('should return undefined by invalid order id', async () => {
      const invalidOrderId = "1000000";
      const result = undefined;
      jest.spyOn(vehicleService, 'getOrderVehicles').mockImplementation(async () => result);

      expect(await vehicleController.getOrderVehicles(invalidOrderId)).toBe(result);
    });
  });

  describe('createVehicle', () => {
    it('should create vehicle and return its credentials', async () => {
      const vehicleToCreate = {
        driverId: 1,
        yearOfProductionUNIX: 1649744443,
        brand: "VW",
        model: "Golf",
        registrationNumber: "KB42673",
        vin: "12345NMJ234124422",
        insuranceExpiryTsUNIX: 1681280443,
        vehicleType: VehicleType.CAR,
        parameters: {
          width: 20,
          height: 30,
          length: 50,
          capacity: 200,
          mileage: 200
        }
      };
      const result = {
        id: 4,
        yearOfProduction: new Date(1649744443),
        brand: "VW",
        model: "Golf",
        registrationNumber: "KB42673",
        driverId: 1,
        vin: "12345NMJ234124422",
        insuranceExpiryTs: new Date(1681280443),
        vehicleType: VehicleType.CAR
      };
      jest.spyOn(vehicleService, 'createVehicle').mockImplementation(async () => result);

      expect(await vehicleController.createVehicle(vehicleToCreate)).toBe(result);
    });
  });

});
