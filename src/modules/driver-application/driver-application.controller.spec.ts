import { Test } from '@nestjs/testing';
import { DriverApplicationController } from './driver-application.controller';
import { DriverApplicationService } from './driver-application.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { prismaMock } from '../test/singleton';
import { DriverApplicationStatus } from '@prisma/client';

describe('DriverApplicationController', () => {
  let driverApplicationController: DriverApplicationController;
  let driverApplicationService: DriverApplicationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DriverApplicationController],
      providers: [
        DriverApplicationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    driverApplicationService = moduleRef.get<DriverApplicationService>(
      DriverApplicationService,
    );
    driverApplicationController = moduleRef.get<DriverApplicationController>(
      DriverApplicationController,
    );
  });

  describe('getPendingDriverApplications', () => {
    it('should return all driver applications with status "PENDING"', async () => {
      const driverApplications = [
        {
          id: 1,
          firstName: 'Vodila',
          lastName: 'IzTagila',
          phoneNumber: '+375291234321',
          email: 'rovnyi.pacan@dvor.com',
          status: DriverApplicationStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest
        .spyOn(driverApplicationService, 'getPendingDriverApplications')
        .mockImplementation(async () => driverApplications);

      expect(
        await driverApplicationController.getPendingDriverApplications(),
      ).toBe(driverApplications);
    });
  });

  describe('createDriverApplication', () => {
    it('should create driver application and return its info', async () => {
      const driverApplication = {
        firstName: 'Vodila',
        lastName: 'IzTagila',
        phoneNumber: '+375291234321',
        email: 'rovnyi.pacan@dvor.com',
      };
      const result = {
        id: 1,
        firstName: 'Vodila',
        lastName: 'IzTagila',
        phoneNumber: '+375291234321',
        email: 'rovnyi.pacan@dvor.com',
        status: DriverApplicationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(driverApplicationService, 'createDriverApplication')
        .mockImplementation(async () => result);

      expect(
        await driverApplicationController.createDriverApplication(
          driverApplication,
        ),
      ).toBe(result);
    });
  });

  describe('approveApplication', () => {
    it('should change "PENDING" status of application to "APPROVED"', async () => {
      const id = '1';
      const result = {
        id: +id,
      };
      jest
        .spyOn(driverApplicationService, 'approveApplication')
        .mockImplementation(async () => result);

      expect(await driverApplicationController.approveApplication(id)).toBe(
        result,
      );
    });
  });

  describe('declineApplication', () => {
    it('should change "PENDING" status of application to "DECLINED"', async () => {
      const id = '1';
      const result = {
        id: +id,
      };
      jest
        .spyOn(driverApplicationService, 'declineApplication')
        .mockImplementation(async () => result);

      expect(await driverApplicationController.declineApplication(id)).toBe(
        result,
      );
    });
  });
});
