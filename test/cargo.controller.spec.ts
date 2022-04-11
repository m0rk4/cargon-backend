import { Test } from "@nestjs/testing";
import { CargoController } from '../src/modules/cargo/cargo.controller';
import { CargoService } from '../src/modules/cargo/cargo.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { prismaMock } from "../src/modules/test/singleton";

describe('CargoController', () => {
  let cargoController: CargoController;
  let cargoService: CargoService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CargoController],
      providers: [CargoService, {
        provide: PrismaService,
        useValue: prismaMock
      }],
    }).compile();

    cargoService = moduleRef.get<CargoService>(CargoService);
    cargoController = moduleRef.get<CargoController>(CargoController);
  });

  describe('getCargo', () => {
    it('should return a cargo by valid id', async () => {
      const validId = "1";
      const resultCargo = {
        id: +validId,
        weight: 10,
        length: 100,
        width: 20,
        height: 30,
        name: "Table",
        orderId: 1
      };
      jest.spyOn(cargoService, 'getCargo').mockImplementation(async () => resultCargo);

      expect(await cargoController.getCargo(validId)).toBe(resultCargo);
    });

    it('should return undefined by invalid id', async () => {
      const invalidId = "1000";
      const resultCargo = undefined;
      jest.spyOn(cargoService, 'getCargo').mockImplementation(async () => resultCargo);

      expect(await cargoController.getCargo(invalidId)).toBe(resultCargo);
    });
  });

  describe('getOrderCargos', () => {
    it('should return a list of cargos by valid orderId', async () => {
      const validOrderId = "1";
      const resultCargoList = [
          {
            "id": 1,
            "weight": 10,
            "length": 100,
            "width": 20,
            "height": 30,
            "name": "Table",
            "orderId": +validOrderId
          },
          {
            "id": 2,
            "weight": 13,
            "length": 10,
            "width": 200,
            "height": 30,
            "name": "Chair",
            "orderId": +validOrderId
          }
        ];
      jest.spyOn(cargoService, 'getOrderCargos').mockImplementation(async () => resultCargoList);

      expect(await cargoController.getOrderCargos(validOrderId)).toBe(resultCargoList);
    });

    it('should return an empty list by invalid orderId', async () => {
      const invalidOrderId = "1000";
      const resultCargoList = [];
      jest.spyOn(cargoService, 'getOrderCargos').mockImplementation(async () => resultCargoList);

      expect(await cargoController.getOrderCargos(invalidOrderId)).toBe(resultCargoList);
    });
  });

  describe('createCargo', () => {
    it('should create new cargo and return it as a response', async () => {
      const orderId = "2";
      const inputCargo = {
        "weight": 1,
        "length": 80,
        "width": 60,
        "height": 1,
        "name": "Carpet"
      };
      const resultCargo = {
        "id": 7,
        "weight": 1,
        "length": 80,
        "width": 60,
        "height": 1,
        "name": "carpet",
        "orderId": +orderId
      };
      jest.spyOn(cargoService, 'createCargo').mockImplementation(async () => resultCargo);

      expect(await cargoController.createCargo(orderId, inputCargo)).toBe(resultCargo);
    });
  });

  describe('updateCargo', () => {
    it('should update existing cargo and return its id as a response', async () => {
      const cargoId = "7";
      const updateCargo = {
        "weight": 2,
        "length": 100,
        "width": 80,
        "height": 1,
        "name": "Carpet"
      };
      const result = {
        "id": +cargoId
      };
      jest.spyOn(cargoService, 'updateCargo').mockImplementation(async () => result);

      expect(await cargoController.updateCargo(cargoId, updateCargo)).toBe(result);
    });
  });

  describe('deleteCargo', () => {
    it('should delete cargo and return its id as a response', async () => {
      const cargoId = "7";
      const result = {
        "id": +cargoId
      };
      jest.spyOn(cargoService, 'deleteCargo').mockImplementation(async () => result);

      expect(await cargoController.deleteCargo(cargoId)).toBe(result);
    });
  });

});
