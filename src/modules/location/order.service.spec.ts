import { Test } from '@nestjs/testing';
import { OrderService } from '../order/order.service';
import { CargoService } from '../cargo/cargo.service';
import { LocationService } from './location.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { OrderStatus, VehicleType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

describe('OrderService', () => {
  let orderService: OrderService;
  let vehicleService: VehicleService;
  let prismaService: PrismaService;

  const date = new Date();

  const user = {
    firstName: 'Vlad',
    lastName: 'Kabral',
    email: 'kabral@gmail.com',
    passwordHash: 'pass',
  };

  const driver = {
    firstName: 'Sanya',
    lastName: 'Varvar',
    email: 'sanya_varvar@gmail.com',
    passwordHash: 'pass',
  };

  const vehicle = {
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

  const order1 = {
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
    cargos: [],
  };

  const order2 = {
    userId: 0,
    fromLocation: {
      city: {
        name: 'Slonim',
      },
      street: {
        name: 'Pushkin',
      },
      home: 12,
    },
    toLocation: {
      city: {
        name: 'Mogilev',
      },
      street: {
        name: 'Mogilevskaya',
      },
      home: 10,
    },
    cargos: [],
  };

  const order3 = {
    userId: 0,
    fromLocation: {
      city: {
        name: 'Brest',
      },
      street: {
        name: 'Brestskaya',
      },
      home: 1,
    },
    toLocation: {
      city: {
        name: 'Grodno',
      },
      street: {
        name: 'Lenin',
      },
      home: 100,
    },
    cargos: [],
  };

  const cargo1 = {
    orderId: 0,
    weight: 10,
    length: 50,
    width: 100,
    height: 60,
    name: 'Table',
  };

  const cargo2 = {
    orderId: 0,
    weight: 13,
    length: 10,
    width: 200,
    height: 30,
    name: 'Chair',
  };

  const cargo3 = {
    orderId: 0,
    weight: 20,
    length: 250,
    width: 200,
    height: 60,
    name: 'Sofa',
  };

  let cargoId1,
    cargoId2,
    cargoId3,
    userId,
    driverId,
    vehicleId,
    orderId1,
    orderId2,
    orderId3;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderService,
        CargoService,
        LocationService,
        VehicleService,
        PrismaService,
      ],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    orderService = moduleRef.get<OrderService>(OrderService);
    vehicleService = moduleRef.get<VehicleService>(VehicleService);

    userId = (
      await prismaService.user.create({
        data: user,
      })
    ).id;
    driverId = (
      await prismaService.user.create({
        data: driver,
      })
    ).id;

    vehicle.driverId = driverId;
    vehicleId = (await vehicleService.createVehicle(vehicle)).vehicleId;

    orderId1 = (await orderService.createOrder(userId, order1)).id;
    orderId2 = (await orderService.createOrder(userId, order2)).id;
    orderId3 = (await orderService.createOrder(userId, order3)).id;
    await orderService.approveOrder(orderId2);
    await orderService.approveOrder(orderId3);
    await orderService.bookOrder(orderId3, driverId, {
      transportIds: [vehicleId],
    });

    cargo1.orderId = orderId1;
    cargoId1 = (
      await prismaService.cargo.create({
        data: cargo1,
      })
    ).id;
    cargo2.orderId = orderId2;
    cargoId2 = (
      await prismaService.cargo.create({
        data: cargo2,
      })
    ).id;
    cargo3.orderId = orderId3;
    cargoId3 = (
      await prismaService.cargo.create({
        data: cargo3,
      })
    ).id;
  });

  afterEach(async () => {
    await prismaService.cargo.deleteMany({});
    await prismaService.orderTransport.deleteMany({});
    await prismaService.vehicleParameters.deleteMany({});
    await prismaService.vehicle.deleteMany({});
    await prismaService.order.deleteMany({});
    await prismaService.user.deleteMany({});
    await prismaService.location.deleteMany({});
    await prismaService.street.deleteMany({});
    await prismaService.city.deleteMany({});
  });

  describe('getPendingOrders', () => {
    it('should return all orders with status "PENDING"', async () => {
      const orders = [
        {
          id: orderId1,
          createdAt: date,
          updatedAt: date,
          user: {
            id: userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: cargoId1,
              weight: cargo1.weight,
              length: cargo1.length,
              width: cargo1.width,
              height: cargo1.height,
              name: cargo1.name,
              orderId: orderId1,
            },
          ],
          driver: null,
          fromLocation: order1.fromLocation,
          toLocation: order1.toLocation,
          status: OrderStatus.PENDING,
        },
      ];

      expect(
        (await orderService.getPendingOrders()).map((order) => {
          order.createdAt = date;
          order.updatedAt = date;
          return order;
        }),
      ).toStrictEqual(orders);
    });
  });

  describe('getApprovedOrders', () => {
    it('should return all orders with status "APPROVED"', async () => {
      const orders = [
        {
          id: orderId2,
          createdAt: date,
          updatedAt: date,
          user: {
            id: userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: cargoId2,
              weight: cargo2.weight,
              length: cargo2.length,
              width: cargo2.width,
              height: cargo2.height,
              name: cargo2.name,
              orderId: orderId2,
            },
          ],
          driver: null,
          fromLocation: order2.fromLocation,
          toLocation: order2.toLocation,
          status: OrderStatus.APPROVED,
        },
      ];

      expect(
        (await orderService.getApprovedOrders()).map((order) => {
          order.createdAt = date;
          order.updatedAt = date;
          return order;
        }),
      ).toStrictEqual(orders);
    });
  });

  describe('getUserOrders', () => {
    it('should return all orders by valid user id', async () => {
      const orders = [
        {
          id: orderId1,
          createdAt: date,
          updatedAt: date,
          user: {
            id: userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: cargoId1,
              weight: cargo1.weight,
              length: cargo1.length,
              width: cargo1.width,
              height: cargo1.height,
              name: cargo1.name,
              orderId: orderId1,
            },
          ],
          driver: null,
          fromLocation: order1.fromLocation,
          toLocation: order1.toLocation,
          status: OrderStatus.PENDING,
        },
        {
          id: orderId2,
          createdAt: date,
          updatedAt: date,
          user: {
            id: userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: cargoId2,
              weight: cargo2.weight,
              length: cargo2.length,
              width: cargo2.width,
              height: cargo2.height,
              name: cargo2.name,
              orderId: orderId2,
            },
          ],
          driver: null,
          fromLocation: order2.fromLocation,
          toLocation: order2.toLocation,
          status: OrderStatus.APPROVED,
        },
        {
          id: orderId3,
          createdAt: date,
          updatedAt: date,
          user: {
            id: userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: cargoId3,
              weight: cargo3.weight,
              length: cargo3.length,
              width: cargo3.width,
              height: cargo3.height,
              name: cargo3.name,
              orderId: orderId3,
            },
          ],
          driver: {
            id: driverId,
            email: driver.email,
            firstName: driver.firstName,
            lastName: driver.lastName,
            userRating: new Decimal(5),
          },
          fromLocation: order3.fromLocation,
          toLocation: order3.toLocation,
          status: OrderStatus.BOOKED,
        },
      ];

      expect(
        (await orderService.getUserOrders(userId)).map((order) => {
          order.createdAt = date;
          order.updatedAt = date;
          return order;
        }),
      ).toStrictEqual(orders);
    });

    it('should return empty list by invalid user id', async () => {
      const invalidId = 1000000;
      const result = [];
      expect(await orderService.getUserOrders(invalidId)).toStrictEqual(result);
    });
  });

  describe('getDriverOrders', () => {
    it('should return all orders by valid driver id', async () => {
      const orders = [
        {
          id: orderId3,
          createdAt: date,
          updatedAt: date,
          user: {
            id: userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: cargoId3,
              weight: cargo3.weight,
              length: cargo3.length,
              width: cargo3.width,
              height: cargo3.height,
              name: cargo3.name,
              orderId: orderId3,
            },
          ],
          driver: {
            id: driverId,
            email: driver.email,
            firstName: driver.firstName,
            lastName: driver.lastName,
            userRating: new Decimal(5),
          },
          fromLocation: order3.fromLocation,
          toLocation: order3.toLocation,
          status: OrderStatus.BOOKED,
        },
      ];

      expect(
        (await orderService.getDriverOrders(driverId)).map((order) => {
          order.createdAt = date;
          order.updatedAt = date;
          return order;
        }),
      ).toStrictEqual(orders);
    });

    it('should return empty list by invalid driver id', async () => {
      const invalidId = 100000000;
      const result = [];
      expect(await orderService.getDriverOrders(invalidId)).toStrictEqual(
        result,
      );
    });
  });

  describe('getOrder', () => {
    it('should return order by valid id', async () => {
      const order = {
        id: orderId1,
        createdAt: date,
        updatedAt: date,
        user: {
          id: userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userRating: new Decimal(5),
        },
        cargos: [
          {
            id: cargoId1,
            weight: cargo1.weight,
            length: cargo1.length,
            width: cargo1.width,
            height: cargo1.height,
            name: cargo1.name,
            orderId: orderId1,
          },
        ],
        driver: null,
        fromLocation: order1.fromLocation,
        toLocation: order1.toLocation,
        status: OrderStatus.PENDING,
      };

      const returnedOrder = await orderService.getOrder(orderId1);
      returnedOrder.createdAt = date;
      returnedOrder.updatedAt = date;
      expect(returnedOrder).toStrictEqual(order);
    });

    it('should return null by invalid id', async () => {
      const invalidId = 100000000;
      const result = null;
      expect(await orderService.getOrder(invalidId)).toStrictEqual(result);
    });
  });

  describe('approveOrder', () => {
    it('should change order status from "PENDING" to "APPROVED"', async () => {
      const updateResult = {
        id: orderId1,
      };
      const getResult = {
        id: orderId1,
        createdAt: date,
        updatedAt: date,
        user: {
          id: userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userRating: new Decimal(5),
        },
        cargos: [
          {
            id: cargoId1,
            weight: cargo1.weight,
            length: cargo1.length,
            width: cargo1.width,
            height: cargo1.height,
            name: cargo1.name,
            orderId: orderId1,
          },
        ],
        driver: null,
        fromLocation: order1.fromLocation,
        toLocation: order1.toLocation,
        status: OrderStatus.APPROVED,
      };

      expect(await orderService.approveOrder(orderId1)).toStrictEqual(
        updateResult,
      );
      const order = await orderService.getOrder(orderId1);
      order.createdAt = date;
      order.updatedAt = date;
      expect(order).toStrictEqual(getResult);
    });

    it('should not change order status from "APPROVED"', async () => {
      const updateResult = {
        id: orderId2,
      };
      const getResult = {
        id: orderId2,
        createdAt: date,
        updatedAt: date,
        user: {
          id: userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userRating: new Decimal(5),
        },
        cargos: [
          {
            id: cargoId2,
            weight: cargo2.weight,
            length: cargo2.length,
            width: cargo2.width,
            height: cargo2.height,
            name: cargo2.name,
            orderId: orderId2,
          },
        ],
        driver: null,
        fromLocation: order2.fromLocation,
        toLocation: order2.toLocation,
        status: OrderStatus.APPROVED,
      };

      expect(await orderService.approveOrder(orderId2)).toStrictEqual(
        updateResult,
      );
      const order = await orderService.getOrder(orderId2);
      order.createdAt = date;
      order.updatedAt = date;
      expect(order).toStrictEqual(getResult);
    });
  });

  describe('declineOrder', () => {
    it('should change order status to "DECLINED"', async () => {
      const updateResult = {
        id: orderId1,
      };
      const getResult = {
        id: orderId1,
        createdAt: date,
        updatedAt: date,
        user: {
          id: userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userRating: new Decimal(5),
        },
        cargos: [
          {
            id: cargoId1,
            weight: cargo1.weight,
            length: cargo1.length,
            width: cargo1.width,
            height: cargo1.height,
            name: cargo1.name,
            orderId: orderId1,
          },
        ],
        driver: null,
        fromLocation: order1.fromLocation,
        toLocation: order1.toLocation,
        status: OrderStatus.DECLINED,
      };

      expect(await orderService.declineOrder(orderId1)).toStrictEqual(
        updateResult,
      );
      const order = await orderService.getOrder(orderId1);
      order.createdAt = date;
      order.updatedAt = date;
      expect(order).toStrictEqual(getResult);
    });
  });

  describe('bookOrder', () => {
    it('should set driver to order and change its status from "APPROVED" to "BOOKED"', async () => {
      const bookOrderDto = {
        transportIds: [vehicleId],
      };
      const updateResult = {
        id: orderId2,
      };
      const getResult = {
        id: orderId2,
        createdAt: date,
        updatedAt: date,
        user: {
          id: userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userRating: new Decimal(5),
        },
        cargos: [
          {
            id: cargoId2,
            weight: cargo2.weight,
            length: cargo2.length,
            width: cargo2.width,
            height: cargo2.height,
            name: cargo2.name,
            orderId: orderId2,
          },
        ],
        driver: {
          id: driverId,
          email: driver.email,
          firstName: driver.firstName,
          lastName: driver.lastName,
          userRating: new Decimal(5),
        },
        fromLocation: order2.fromLocation,
        toLocation: order2.toLocation,
        status: OrderStatus.BOOKED,
      };

      expect(
        await orderService.bookOrder(orderId2, driverId, bookOrderDto),
      ).toStrictEqual(updateResult);
      const order = await orderService.getOrder(orderId2);
      order.createdAt = date;
      order.updatedAt = date;
      expect(order).toStrictEqual(getResult);
    });
  });

  describe('releaseOrder', () => {
    it('should change "BOOKED" order status to "APPROVED"', async () => {
      const updateResult: [{ id: number }, { count: number }] = [
        {
          id: orderId3,
        },
        {
          count: 1,
        },
      ];
      const getResult = {
        id: orderId3,
        createdAt: date,
        updatedAt: date,
        user: {
          id: userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userRating: new Decimal(5),
        },
        cargos: [
          {
            id: cargoId3,
            weight: cargo3.weight,
            length: cargo3.length,
            width: cargo3.width,
            height: cargo3.height,
            name: cargo3.name,
            orderId: orderId3,
          },
        ],
        driver: null,
        fromLocation: order3.fromLocation,
        toLocation: order3.toLocation,
        status: OrderStatus.APPROVED,
      };

      expect(await orderService.releaseOrder(orderId3)).toStrictEqual(
        updateResult,
      );
      const order = await orderService.getOrder(orderId3);
      order.createdAt = date;
      order.updatedAt = date;
      expect(order).toStrictEqual(getResult);
    });

    it('should not change status of "APPROVED" order', async () => {
      const updateResult: [{ id: number }, { count: number }] = [
        {
          id: orderId2,
        },
        {
          count: 0,
        },
      ];
      const getResult = {
        id: orderId2,
        createdAt: date,
        updatedAt: date,
        user: {
          id: userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userRating: new Decimal(5),
        },
        cargos: [
          {
            id: cargoId2,
            weight: cargo2.weight,
            length: cargo2.length,
            width: cargo2.width,
            height: cargo2.height,
            name: cargo2.name,
            orderId: orderId2,
          },
        ],
        driver: null,
        fromLocation: order2.fromLocation,
        toLocation: order2.toLocation,
        status: OrderStatus.APPROVED,
      };

      expect(await orderService.releaseOrder(orderId2)).toStrictEqual(
        updateResult,
      );
      const order = await orderService.getOrder(orderId2);
      order.createdAt = date;
      order.updatedAt = date;
      expect(order).toStrictEqual(getResult);
    });
  });

  describe('completeOrder', () => {
    it('should change order status to "COMPLETED"', async () => {
      const updateResult = {
        id: orderId3,
      };
      const getResult = {
        id: orderId3,
        createdAt: date,
        updatedAt: date,
        user: {
          id: userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userRating: new Decimal(5),
        },
        cargos: [
          {
            id: cargoId3,
            weight: cargo3.weight,
            length: cargo3.length,
            width: cargo3.width,
            height: cargo3.height,
            name: cargo3.name,
            orderId: orderId3,
          },
        ],
        driver: {
          id: driverId,
          email: driver.email,
          firstName: driver.firstName,
          lastName: driver.lastName,
          userRating: new Decimal(5),
        },
        fromLocation: order3.fromLocation,
        toLocation: order3.toLocation,
        status: OrderStatus.COMPLETED,
      };

      expect(await orderService.completeOrder(orderId3)).toStrictEqual(
        updateResult,
      );
      const order = await orderService.getOrder(orderId3);
      order.createdAt = date;
      order.updatedAt = date;
      expect(order).toStrictEqual(getResult);
    });
  });
});
