import { Test } from "@nestjs/testing";
import { TransportApplicationController } from '../src/modules/transport-appication/transport-application.controller';
import { TransportApplicationService } from '../src/modules/transport-appication/transport-application.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { prismaMock } from "../src/modules/test/singleton";
import axios, { HttpService } from "@nestjs/axios";

describe('TransportApplicationController', () => {
  let transportApplicationController: TransportApplicationController;
  let transportApplicationService: TransportApplicationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TransportApplicationController],
      providers: [TransportApplicationService, {
        provide: PrismaService,
        useValue: prismaMock
      }, {
        provide: HttpService,
        useValue: jest.mock('axios')
      }],
    }).compile();

    transportApplicationService = moduleRef.get<TransportApplicationService>(TransportApplicationService);
    transportApplicationController = moduleRef.get<TransportApplicationController>(TransportApplicationController);
  });

  describe('getPendingTransportApplications', () => {
    it('should return all transport applications with status "PENDING"', async () => {
      const driverApplications = [
        {
          id: 1,
          documentPublicId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
          createdAt: new Date(),
          driver: {
            id: 1,
            firstName: "Mark",
            lastName: "Putyato"
          }
        }
      ];
      jest
        .spyOn(transportApplicationService, 'getPendingTransportApplications')
        .mockImplementation(async () => driverApplications);

      expect(await transportApplicationController.getPendingTransportApplications()).toBe(driverApplications);
    });
  });

  describe('createTransportApplication', () => {
    it('should create transport application and return its id', async () => {
      const transportApplication = {
        driverId: "1",
        publicId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
      };
      const result = {
        id: 1
      };
      jest.spyOn(transportApplicationService, 'createTransportApplication').mockImplementation(async () => result);

      expect(await transportApplicationController.createTransportApplication(transportApplication)).toBe(result);
    });
  });

  describe('approveTransportApplication', () => {
    it('should approve transport application and return its id', async () => {
      const transportApplicationId = "1";
      const result = {
        id: +transportApplicationId
      };
      jest.spyOn(transportApplicationService, 'approveTransportApplication').mockImplementation(async () => result);

      expect(await transportApplicationController.approveTransportApplication(transportApplicationId)).toBe(result);
    });
  });

  describe('declineTransportApplication', () => {
    it('should decline transport application and return its id', async () => {
      const transportApplicationId = "1";
      const result = {
        id: +transportApplicationId
      };
      jest.spyOn(transportApplicationService, 'declineTransportApplication').mockImplementation(async () => result);

      expect(await transportApplicationController.declineTransportApplication(transportApplicationId)).toBe(result);
    });
  });

});
