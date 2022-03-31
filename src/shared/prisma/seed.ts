import { OrderService } from '../../modules/order/order.service';
import { PrismaService } from './prisma.service';
import { LocationService } from '../../modules/location/location.service';
import { CargoService } from '../../modules/cargo/cargo.service';

const prismaService = new PrismaService();
const orderService = new OrderService(
  prismaService,
  new LocationService(prismaService),
  new CargoService(prismaService),
);

async function main() {
  const passwordHash = 'pass';
  await prismaService.user.createMany({
    data: [
      {
        firstName: 'Mark',
        lastName: 'Putyato',
        email: 'm0rk4@gmail.com',
        passwordHash,
      },
      {
        firstName: 'Vlad',
        lastName: 'Nevinsky',
        email: 'newvlad2001@gmail.com',
        passwordHash,
      },
      {
        firstName: 'Nikita',
        lastName: 'Kolodko',
        email: 'fifa-legend@gmail.com',
        passwordHash,
      },
      {
        firstName: 'Test',
        lastName: 'User',
        email: 'test-user@gmail.com',
        passwordHash,
      },
    ],
  });

  prismaService.driverApplication.createMany({
    data: [
      {
        firstName: 'Tolya',
        lastName: 'Vodila',
        phoneNumber: 'Chetkiy',
        email: 'krivoy.pacan@russia.com',
      },
      {
        firstName: 'Vodila',
        lastName: 'IzTagila',
        phoneNumber: 'Chetkiy',
        email: 'rovnyi.pacan@dvor.com',
      },
      {
        firstName: 'Nikita',
        lastName: 'Mashyna',
        phoneNumber: 'Krutoi',
        email: 'kok.boxer@slonym.com',
      },
    ],
  });

  const orders = [
    {
      userId: 1,
      fromLocation: {
        city: {
          name: 'Minsk',
        },
        street: {
          name: 'Gikaly',
        },
        home: 9,
      },
      toLocation: {
        city: {
          name: 'Gomel',
        },
        street: {
          name: 'Main',
        },
        home: 19,
      },
      cargos: [
        {
          weight: 10,
          length: 100,
          width: 20,
          height: 30,
          name: 'Table',
        },
        {
          weight: 13,
          length: 10,
          width: 200,
          height: 30,
          name: 'Chair',
        },
      ],
    },
    {
      userId: 2,
      fromLocation: {
        city: {
          name: 'Mogilev',
        },
        street: {
          name: 'Mog',
        },
        home: 9,
      },
      toLocation: {
        city: {
          name: 'Slonym',
        },
        street: {
          name: 'Slon',
        },
        home: 19,
      },
      cargos: [
        {
          weight: 10,
          length: 100,
          width: 20,
          height: 30,
          name: 'Sofa',
        },
        {
          weight: 13,
          length: 10,
          width: 200,
          height: 30,
          name: 'Piano',
        },
      ],
    },
    {
      userId: 1,
      fromLocation: {
        city: {
          name: 'Brest',
        },
        street: {
          name: 'breste',
        },
        home: 9,
      },
      toLocation: {
        city: {
          name: 'Bobruysk',
        },
        street: {
          name: 'Bobr',
        },
        home: 19,
      },
      cargos: [
        {
          weight: 10,
          length: 100,
          width: 20,
          height: 30,
          name: 'Door',
        },
        {
          weight: 13,
          length: 10,
          width: 200,
          height: 30,
          name: 'Bed',
        },
      ],
    },
  ];

  for (const order of orders) {
    await orderService.createOrder(order);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaService.$disconnect();
  });
