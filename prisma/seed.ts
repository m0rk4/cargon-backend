import { OrderService } from '../src/modules/order/order.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { LocationService } from '../src/modules/location/location.service';
import { CargoService } from '../src/modules/cargo/cargo.service';
import {VehicleService} from "../src/modules/vehicle/vehicle.service";
import { VehicleType } from "@prisma/client"

const prismaService = new PrismaService();
const vehicleService = new VehicleService(prismaService);
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
  const vehicles = [

    {
      driverId: 2,
      yearOfProductionUNIX: 1646210798,
      brand: "VW",
      model: "Crafter",
      registrationNumber: "AB12346",
      vin: "12345NMJ23412",
      insuranceExpiryTsUNIX: 1648900065,
      vehicleType: VehicleType.TRUCK,
      parameters: {
        width: 123,
        height: 233,
        length: 600,
        capacity: 1000,
        mileage: 1654
      }
    },
    {
      driverId: 3,
      yearOfProductionUNIX: 1646210798,
      brand: "Mercedes",
      model: "M",
      registrationNumber: "AB16746",
      vin: "12345NMJ23412",
      insuranceExpiryTsUNIX: 1648900065,
      vehicleType: VehicleType.MINIBUS,
      parameters: {
        width: 13,
        height: 273,
        length: 340,
        capacity: 6000,
        mileage: 154
      }
    },
    {
      driverId: 1,
      yearOfProductionUNIX: 1646210698,
      brand: "Ford",
      model: "Transit",
      registrationNumber: "AB62346",
      vin: "12345NMJ23412",
      insuranceExpiryTsUNIX: 1648908065,
      vehicleType: VehicleType.CAR,
      parameters: {
        width: 130,
        height: 203,
        length: 300,
        capacity: 700,
        mileage: 15334
      }
    }
  ]
  for (const vehicle of vehicles ) {
    await vehicleService.createVehicle(vehicle);
  }


  const orders = [
    {
      userId: 1,
      transportIds: [1],
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
      transportIds: [1, 2],
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
      transportIds: [3],
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
