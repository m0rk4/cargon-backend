import { Test } from "@nestjs/testing";
import { DriverApplicationService } from '../src/modules/driver-application/driver-application.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { DriverApplicationStatus } from "@prisma/client";

describe('DriverApplicationService', () => {
  let driverApplicationService: DriverApplicationService;
  let prismaService: PrismaService;

  const date = new Date();
  const driverApplication1 = {
    firstName: "Vodila",
    lastName: "IzTagila",
    phoneNumber: "+375291234321",
    email: "rovnyi.pacan@dvor.com"
  };
  const driverApplication2 = {
    firstName: "Tolya",
    lastName: "Vodila",
    phoneNumber: "+375291241725",
    email: "krivoy.pacan@russia.com"
  };
  const driverApplication3 = {
    firstName: "Nikita",
    lastName: "Mashyna",
    phoneNumber: "+375291221617",
    email: "kick.boxer@slonym.com"
  };
  let id1, id2, id3;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DriverApplicationService, PrismaService],
    }).compile();

    driverApplicationService = moduleRef.get<DriverApplicationService>(DriverApplicationService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    id1 = (await prismaService.driverApplication.create({
      data: driverApplication1
    })).id;
    id2 = (await prismaService.driverApplication.create({
      data: driverApplication2
    })).id;
    id3 = (await prismaService.driverApplication.create({
      data: driverApplication3
    })).id;
    await driverApplicationService.approveApplication(id2);
    await driverApplicationService.declineApplication(id3);
  });

  afterEach(async () => {
    let id = id1;
    await prismaService.driverApplication.delete({
      where: { id }
    });

    id = id2;
    await prismaService.driverApplication.delete({
      where: { id }
    });

    id = id3;
    await prismaService.driverApplication.delete({
      where: { id }
    });
  });

  describe('getPendingDriverApplications', () => {
    it('should return all driver applications with status "PENDING"', async () => {
      const driverApplications = [
        {
          id: id1,
          firstName: "Vodila",
          lastName: "IzTagila",
          phoneNumber: "+375291234321",
          email: "rovnyi.pacan@dvor.com",
          createdAt: date,
          updatedAt: date,
          status: DriverApplicationStatus.PENDING
        }
      ];

      expect((await driverApplicationService.getPendingDriverApplications()).map(driver => {
        driver.createdAt = date;
        driver.updatedAt = date;
        return driver;
      })).toStrictEqual(driverApplications);
    });
  });

  describe('createDriverApplication', () => {
    it('should create driver application and return its info', async () => {
      const driverApplication = {
        firstName: "Nikita",
        lastName: "Kolodko",
        phoneNumber: "+375291717215",
        email: "kolodkonikitos@gmail.com"
      };
      const result = {
        id: id3 + 1,
        firstName: "Nikita",
        lastName: "Kolodko",
        phoneNumber: "+375291717215",
        email: "kolodkonikitos@gmail.com",
        status: DriverApplicationStatus.PENDING,
        createdAt: date,
        updatedAt: date
      };

      const driver = await driverApplicationService.createDriverApplication(driverApplication);
      driver.createdAt = date;
      driver.updatedAt = date;
      expect(driver).toStrictEqual(result);

      const id = driver.id;
      await prismaService.driverApplication.delete({
        where: { id }
      });
    });
  });

  describe('approveApplication', () => {
    it('should change "PENDING" status of application to "APPROVED"', async () => {
      const updateResult = {
        id: +id1
      };
      const getResult = [];

      expect(await driverApplicationService.approveApplication(id1)).toStrictEqual(updateResult);
      expect(await driverApplicationService.getPendingDriverApplications()).toStrictEqual(getResult);
    });
  });

  describe('declineApplication', () => {
    it('should change "PENDING" status of application to "DECLINED"', async () => {
      const updateResult = {
        id: +id1
      };
      const getResult = [];

      expect(await driverApplicationService.declineApplication(id1)).toStrictEqual(updateResult);
      expect(await driverApplicationService.getPendingDriverApplications()).toStrictEqual(getResult);
    });
  });

});
