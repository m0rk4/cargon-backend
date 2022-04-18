import { Test } from "@nestjs/testing";
import { TransportApplicationService } from '../src/modules/transport-appication/transport-application.service';
import { UserService } from '../src/modules/user/user.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { HttpService } from "@nestjs/axios";

describe('TransportApplicationService', () => {
  let transportApplicationService: TransportApplicationService;
  let userService: UserService;
  let prismaService: PrismaService;

  const date = new Date();
  const transportApplication1 = {
    driverId: 0,
    documentPublicId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
  };
  const transportApplication2 = {
    driverId: 0,
    documentPublicId: "123e4567-e89b-12d3-a456-426614174000"
  };
  const user = {
    firstName: "Nikita",
    lastName: "Kolodko",
    email: "fifa-legend@gmail.com",
    passwordHash: "pass",
  };
  let id1, id2, userId;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TransportApplicationService, UserService, PrismaService, {
        provide: HttpService,
        useValue: jest.mock('axios')
      }],
    }).compile();

    transportApplicationService = moduleRef.get<TransportApplicationService>(TransportApplicationService);
    userService = moduleRef.get<UserService>(UserService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    userId = (await prismaService.user.create({
      data: user
    })).id;
    transportApplication1.driverId = userId;
    transportApplication2.driverId = userId;

    id1 = (await prismaService.transportApplication.create({
      select: { id: true },
      data: transportApplication1
    })).id;
    id2 = (await prismaService.transportApplication.create({
      select: { id: true },
      data: transportApplication2
    })).id;
  });

  afterEach(async () => {
    let id = id1;
    await prismaService.transportApplication.delete({
      where: { id }
    });

    id = id2;
    await prismaService.transportApplication.delete({
      where: { id }
    });

    id = userId;
    await prismaService.user.delete({
      where: { id }
    });
  });

  describe('getPendingTransportApplications', () => {
    it('should return all transport applications with status "PENDING"', async () => {
      const driverApplications = [
        {
          id: id1,
          documentPublicId: transportApplication1.documentPublicId,
          createdAt: date,
          driver: {
            id: userId,
            firstName: user.firstName,
            lastName: user.lastName
          }
        },
        {
          id: id2,
          documentPublicId: transportApplication2.documentPublicId,
          createdAt: date,
          driver: {
            id: userId,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      ];

      expect((await transportApplicationService.getPendingTransportApplications()).map(application => {
        application.createdAt = date;
        return application;
      })).toStrictEqual(driverApplications);
    });
  });

  describe('createTransportApplication', () => {
    it('should create transport application and return its id', async () => {
      const documentPublicId = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
      const result = {
        id: id2 + 1
      };

      expect(await transportApplicationService.createTransportApplication(userId, documentPublicId)).toStrictEqual(result);

      const id = result.id;
      await prismaService.transportApplication.delete({
        where: { id }
      });
    });
  });

  describe('approveTransportApplication', () => {
    it('should approve transport application and return its id', async () => {
      const result = {
        id: id1
      };
      expect(await transportApplicationService.approveTransportApplication(id1)).toStrictEqual(result);
    });
  });

  describe('declineTransportApplication', () => {
    it('should decline transport application and return its id', async () => {
      const result = {
        id: id2
      };
      expect(await transportApplicationService.declineTransportApplication(id2)).toStrictEqual(result);
    });
  });

});
