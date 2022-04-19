import { Test } from "@nestjs/testing";
import { CargoService } from '../src/modules/cargo/cargo.service';
import { OrderService } from '../src/modules/order/order.service';
import { LocationService } from '../src/modules/location/location.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';

describe('CargoService', () => {
  let cargoService: CargoService;
  let orderService: OrderService;
  let prismaService: PrismaService;

  const user = {
    firstName: "Ivan",
    lastName: "Zelezinski",
    email: "ivanzel@gmail.com",
    passwordHash: "pass",
  };
  const order = {
    userId: 0,
    fromLocation: {
      city: {
        name: "Minsk"
      },
      street: {
        name: "Gikaly"
      },
      home: 5
    },
    toLocation: {
      city: {
        name: "Gomel"
      },
      street: {
        name: "Gorkogo"
      },
      home: 19
    },
    cargos: []
  };
  const cargo = {
    orderId: 0,
    weight: 10,
    length: 50,
    width: 100,
    height: 60,
    name: "Table"
  };

  let cargoId, userId, orderId;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CargoService, OrderService, LocationService, PrismaService],
    }).compile();

    cargoService = moduleRef.get<CargoService>(CargoService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    orderService = moduleRef.get<OrderService>(OrderService);

    userId = (await prismaService.user.create({
      data: user
    })).id;

    order.userId = userId;
    orderId = (await orderService.createOrder(order)).id;

    cargo.orderId = orderId;
    cargoId = (await prismaService.cargo.create({
      data: cargo
    })).id;
  });

  afterEach(async () => {
    await prismaService.cargo.deleteMany({});
    await prismaService.order.delete({
      where: { id: orderId }
    });
    await prismaService.user.delete({
      where: { id: userId }
    });
    await prismaService.location.deleteMany({});
    await prismaService.street.deleteMany({});
    await prismaService.city.deleteMany({});
  });

  describe('getCargo', () => {
    it('should return a cargo by valid id', async () => {
      const resultCargo = {
        id: cargoId,
        weight: cargo.weight,
        length: cargo.length,
        width: cargo.width,
        height: cargo.height,
        name: cargo.name,
        orderId: orderId
      };

      expect(await cargoService.getCargo(cargoId)).toStrictEqual(resultCargo);
    });

    it('should return null by invalid id', async () => {
      const invalidId = 100000000;
      const result = null;
      expect(await cargoService.getCargo(invalidId)).toStrictEqual(result);
    });
  });

  describe('getOrderCargos', () => {
    it('should return a list of cargos by valid orderId', async () => {
      const resultCargoList = [
        {
          id: cargoId,
          weight: cargo.weight,
          length: cargo.length,
          width: cargo.width,
          height: cargo.height,
          name: cargo.name,
          orderId: orderId
        }
      ];

      expect(await cargoService.getOrderCargos(orderId)).toStrictEqual(resultCargoList);
    });

    it('should return an empty list by invalid orderId', async () => {
      const invalidOrderId = 100000000;
      const result = [];
      expect(await cargoService.getOrderCargos(invalidOrderId)).toStrictEqual(result);
    });
  });

  describe('createCargo', () => {
    it('should return a created cargo', async () => {
      const createCargo = {
        weight: 20,
        length: 250,
        width: 200,
        height: 40,
        name: "Sofa"
      };
      const result = {
        id: 0,
        orderId: orderId,
        weight: createCargo.weight,
        length: createCargo.length,
        width: createCargo.width,
        height: createCargo.height,
        name: createCargo.name
      };

      const returnedCargo = await cargoService.createCargo(orderId, createCargo);
      result.id = returnedCargo.id;
      expect(returnedCargo).toStrictEqual(result);
    });
  });

  describe('updateCargo', () => {
    it('should update existing cargo', async () => {
      const updateCargo = {
        weight: 2,
        length: 100,
        width: 80,
        height: 1,
        name: "Carpet"
      };
      const updateResult = {
        id: cargoId
      };
      const getResult = {
        id: cargoId,
        weight: updateCargo.weight,
        length: updateCargo.length,
        width: updateCargo.width,
        height: updateCargo.height,
        name: updateCargo.name,
        orderId: orderId
      };

      expect(await cargoService.updateCargo(cargoId, updateCargo)).toStrictEqual(updateResult);
      expect(await cargoService.getCargo(cargoId)).toStrictEqual(getResult);
    });
  });

  describe('deleteCargo', () => {
    it('should delete existing cargo', async () => {
      const deleteResult = {
        id: cargoId
      };
      const getResult = [];

      expect(await cargoService.deleteCargo(cargoId)).toStrictEqual(deleteResult);
      expect(await cargoService.getOrderCargos(orderId)).toStrictEqual(getResult);
    });
  });

});
