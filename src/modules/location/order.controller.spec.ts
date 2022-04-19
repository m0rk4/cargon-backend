import { Test } from '@nestjs/testing';
import { OrderStatus } from '@prisma/client';
import { OrderController } from '../order/order.controller';
import { OrderService } from '../order/order.service';
import { CargoService } from '../cargo/cargo.service';
import { LocationService } from './location.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { prismaMock } from '../test/singleton';
import { Decimal } from '@prisma/client/runtime';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        LocationService,
        CargoService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    orderService = moduleRef.get<OrderService>(OrderService);
    orderController = moduleRef.get<OrderController>(OrderController);
  });

  describe('getPendingOrders', () => {
    it('should return all orders with status PENDING', async () => {
      const orders = [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 1,
            email: 'mark@mail.ru',
            firstName: 'Mark',
            lastName: 'Putyato',
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: 1,
              weight: 10,
              length: 100,
              width: 20,
              height: 30,
              name: 'Table',
              orderId: 1,
            },
            {
              id: 2,
              weight: 13,
              length: 10,
              width: 200,
              height: 30,
              name: 'Chair',
              orderId: 1,
            },
          ],
          driver: null,
          fromLocation: {
            home: 9,
            city: {
              name: 'Minsk',
            },
            street: {
              name: 'Gikaly',
            },
          },
          toLocation: {
            home: 19,
            city: {
              name: 'Gomel',
            },
            street: {
              name: 'Pushkin',
            },
          },
          status: OrderStatus.PENDING,
        },
        {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 2,
            email: 'vlad@mail.ru',
            firstName: 'Vlad',
            lastName: 'Nevinsky',
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: 3,
              weight: 10,
              length: 100,
              width: 20,
              height: 30,
              name: 'Sofa',
              orderId: 2,
            },
            {
              id: 4,
              weight: 13,
              length: 10,
              width: 200,
              height: 30,
              name: 'Piano',
              orderId: 2,
            },
          ],
          driver: null,
          fromLocation: {
            home: 9,
            city: {
              name: 'Mogilev',
            },
            street: {
              name: 'Mogilevskaya',
            },
          },
          toLocation: {
            home: 19,
            city: {
              name: 'Slonim',
            },
            street: {
              name: 'Pushkin',
            },
          },
          status: OrderStatus.PENDING,
        },
      ];
      jest
        .spyOn(orderService, 'getPendingOrders')
        .mockImplementation(async () => orders);

      expect(await orderController.getPendingOrders()).toBe(orders);
    });
  });

  describe('getApprovedOrders', () => {
    it('should return all orders with status APPROVED', async () => {
      const orders = [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 1,
            email: 'mark@mail.ru',
            firstName: 'Mark',
            lastName: 'Putyato',
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: 1,
              weight: 10,
              length: 100,
              width: 20,
              height: 30,
              name: 'Table',
              orderId: 1,
            },
            {
              id: 2,
              weight: 13,
              length: 10,
              width: 200,
              height: 30,
              name: 'Chair',
              orderId: 1,
            },
          ],
          driver: null,
          fromLocation: {
            home: 9,
            city: {
              name: 'Minsk',
            },
            street: {
              name: 'Gikaly',
            },
          },
          toLocation: {
            home: 19,
            city: {
              name: 'Gomel',
            },
            street: {
              name: 'Pushkin',
            },
          },
          status: OrderStatus.APPROVED,
        },
      ];
      jest
        .spyOn(orderService, 'getApprovedOrders')
        .mockImplementation(async () => orders);

      expect(await orderController.getApprovedOrders()).toBe(orders);
    });
  });

  describe('getUserOrders', () => {
    it('should return all orders by valid user id', async () => {
      const validUserId = '1';
      const orders = [
        {
          id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: +validUserId,
            email: 'mark@mail.ru',
            firstName: 'Mark',
            lastName: 'Putyato',
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: 5,
              weight: 10,
              length: 100,
              width: 20,
              height: 30,
              name: 'Door',
              orderId: 3,
            },
            {
              id: 6,
              weight: 13,
              length: 10,
              width: 200,
              height: 30,
              name: 'Bed',
              orderId: 3,
            },
          ],
          driver: null,
          fromLocation: {
            home: 9,
            city: {
              name: 'Brest',
            },
            street: {
              name: 'Brestskaya',
            },
          },
          toLocation: {
            home: 19,
            city: {
              name: 'Bobruysk',
            },
            street: {
              name: 'Pushkin',
            },
          },
          status: OrderStatus.PENDING,
        },
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: +validUserId,
            email: 'mark@mail.ru',
            firstName: 'Mark',
            lastName: 'Putyato',
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: 1,
              weight: 10,
              length: 100,
              width: 20,
              height: 30,
              name: 'Table',
              orderId: 1,
            },
            {
              id: 2,
              weight: 13,
              length: 10,
              width: 200,
              height: 30,
              name: 'Chair',
              orderId: 1,
            },
          ],
          driver: null,
          fromLocation: {
            home: 9,
            city: {
              name: 'Minsk',
            },
            street: {
              name: 'Gikaly',
            },
          },
          toLocation: {
            home: 19,
            city: {
              name: 'Gomel',
            },
            street: {
              name: 'Gomelskaya',
            },
          },
          status: OrderStatus.APPROVED,
        },
      ];
      jest
        .spyOn(orderService, 'getUserOrders')
        .mockImplementation(async () => orders);

      expect(await orderController.getUserOrders(+validUserId)).toBe(orders);
    });

    it('should return empty list by invalid user id', async () => {
      const invalidId = '1000000';
      const result = [];
      jest
        .spyOn(orderService, 'getUserOrders')
        .mockImplementation(async () => result);

      expect(await orderController.getUserOrders(+invalidId)).toBe(result);
    });
  });

  describe('getDriverOrders', () => {
    it('should return all orders by valid driver id', async () => {
      const validDriverId = '1';
      const orders = [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 2,
            email: 'vlad@mail.ru',
            firstName: 'Vlad',
            lastName: 'Nevinsky',
            userRating: new Decimal(5),
          },
          cargos: [
            {
              id: 1,
              weight: 10,
              length: 100,
              width: 20,
              height: 30,
              name: 'Table',
              orderId: 1,
            },
            {
              id: 2,
              weight: 13,
              length: 10,
              width: 200,
              height: 30,
              name: 'Chair',
              orderId: 1,
            },
          ],
          driver: {
            id: 1,
            email: 'mark@mail.ru',
            firstName: 'Mark',
            lastName: 'Putyato',
            userRating: new Decimal(5),
          },
          fromLocation: {
            home: 9,
            city: {
              name: 'Minsk',
            },
            street: {
              name: 'Gikaly',
            },
          },
          toLocation: {
            home: 19,
            city: {
              name: 'Gomel',
            },
            street: {
              name: 'Gomelskaya',
            },
          },
          status: OrderStatus.BOOKED,
        },
      ];
      jest
        .spyOn(orderService, 'getDriverOrders')
        .mockImplementation(async () => orders);

      expect(await orderController.getDriverOrders(+validDriverId)).toBe(
        orders,
      );
    });

    it('should return empty list by invalid driver id', async () => {
      const invalidId = '1000000';
      const result = [];
      jest
        .spyOn(orderService, 'getDriverOrders')
        .mockImplementation(async () => result);

      expect(await orderController.getDriverOrders(+invalidId)).toBe(result);
    });
  });

  describe('getOrder', () => {
    it('should return order by valid id', async () => {
      const validId = '1';
      const order = {
        id: +validId,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          email: 'mark@mail.ru',
          firstName: 'Mark',
          lastName: 'Putyato',
          userRating: new Decimal(5),
        },
        cargos: [
          {
            id: 1,
            weight: 10,
            length: 100,
            width: 20,
            height: 30,
            name: 'Table',
            orderId: +validId,
          },
          {
            id: 2,
            weight: 13,
            length: 10,
            width: 200,
            height: 30,
            name: 'Chair',
            orderId: +validId,
          },
        ],
        driver: null,
        fromLocation: {
          home: 9,
          city: {
            name: 'Minsk',
          },
          street: {
            name: 'Gikaly',
          },
        },
        toLocation: {
          home: 19,
          city: {
            name: 'Gomel',
          },
          street: {
            name: 'Pushkin',
          },
        },
        status: OrderStatus.PENDING,
      };
      jest
        .spyOn(orderService, 'getOrder')
        .mockImplementation(async () => order);

      expect(await orderController.getOrder(validId)).toBe(order);
    });

    it('should return undefined by invalid id', async () => {
      const invalidId = '1000000';
      const result = undefined;
      jest
        .spyOn(orderService, 'getOrder')
        .mockImplementation(async () => result);

      expect(await orderController.getOrder(invalidId)).toBe(result);
    });
  });

  describe('createOrder', () => {
    it('should create order and return its credentials', async () => {
      const ownerId = 1;
      const order = {
        fromLocation: {
          city: {
            id: 1,
            name: 'Minsk',
          },
          street: {
            id: 1,
            name: 'Gikaly',
          },
          home: 5,
        },
        toLocation: {
          city: {
            id: 2,
            name: 'Gomel',
          },
          street: {
            id: 7,
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
      const result = {
        id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId,
        driverId: null,
        fromLocationId: 7,
        toLocationId: 12,
        status: OrderStatus.PENDING,
      };
      jest
        .spyOn(orderService, 'createOrder')
        .mockImplementation(async () => result);

      expect(await orderController.createOrder(ownerId, order)).toBe(result);
    });
  });

  describe('approveOrder', () => {
    it('should change order status to "APPROVED" and return its id', async () => {
      const id = '4';
      const result = {
        id: +id,
      };
      jest
        .spyOn(orderService, 'approveOrder')
        .mockImplementation(async () => result);

      expect(await orderController.approveOrder(id)).toBe(result);
    });
  });

  describe('declineOrder', () => {
    it('should change order status to "DECLINED" and return its id', async () => {
      const id = '4';
      const result = {
        id: +id,
      };
      jest
        .spyOn(orderService, 'declineOrder')
        .mockImplementation(async () => result);

      expect(await orderController.declineOrder(id)).toBe(result);
    });
  });

  describe('bookOrder', () => {
    it('should set driver to order and change its status to "BOOKED"', async () => {
      const orderId = '1';
      const driverId = '1';
      const bookOrderDto = {
        transportIds: [1, 2],
      };
      const result = {
        id: +orderId,
      };
      jest
        .spyOn(orderService, 'bookOrder')
        .mockImplementation(async () => result);

      expect(
        await orderController.bookOrder(orderId, +driverId, bookOrderDto),
      ).toBe(result);
    });
  });

  describe('releaseOrder', () => {
    it('should change order status to "APPROVED" and return its id', async () => {
      const id = '1';
      const result: [{ id: number }, { count: number }] = [
        {
          id: +id,
        },
        {
          count: 2,
        },
      ];
      jest
        .spyOn(orderService, 'releaseOrder')
        .mockImplementation(async () => result);

      expect(await orderController.releaseOrder(id)).toBe(result);
    });
  });

  describe('completeOrder', () => {
    it('should change order status to "COMPLETED" and return its id', async () => {
      const id = '1';
      const result = {
        id: +id,
      };
      jest
        .spyOn(orderService, 'completeOrder')
        .mockImplementation(async () => result);

      expect(await orderController.completeOrder(id)).toBe(result);
    });
  });

  describe('updateOrder', () => {
    it('should update order', async () => {
      const id = '4';
      const order = {
        fromLocation: {
          city: {
            id: 1,
            name: 'Minsk',
          },
          street: {
            id: 1,
            name: 'Gikaly',
          },
          home: 5,
        },
        toLocation: {
          city: {
            id: 2,
            name: 'Gomel',
          },
          street: {
            id: 7,
            name: 'Gorkogo',
          },
          home: 19,
        },
      };
      const result = {
        id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 1,
        driverId: null,
        fromLocationId: 7,
        toLocationId: 9,
        status: OrderStatus.DECLINED,
      };
      jest
        .spyOn(orderService, 'updateOrderLocations')
        .mockImplementation(async () => result);

      expect(await orderController.updateOrderLocations(id, order)).toBe(
        result,
      );
    });
  });
});
