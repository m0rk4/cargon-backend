import { Test } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { prismaMock } from '../test/singleton';
import { Decimal } from '@prisma/client/runtime';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('getUsers', () => {
    it('should return all users in the system', async () => {
      const users = [
        {
          id: 1,
          firstName: 'Mark',
          lastName: 'Putyato',
          email: 'm0rk4@gmail.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          userRating: new Decimal(5),
        },
        {
          id: 2,
          firstName: 'Vlad',
          lastName: 'Nevinsky',
          email: 'newvlad2001@gmail.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          userRating: new Decimal(5),
        },
      ];
      jest.spyOn(userService, 'getUsers').mockImplementation(async () => users);

      expect(await userController.getUsers()).toBe(users);
    });
  });

  describe('getUser', () => {
    it('should return user by valid id', async () => {
      const validId = '1';
      const user = {
        id: +validId,
        firstName: 'Mark',
        lastName: 'Putyato',
        email: 'm0rk4@gmail.com',
        passwordHash: 'pass',
        createdAt: new Date(),
        updatedAt: new Date(),
        userRating: new Decimal(5),
        isActive: true,
        role: Role.CUSTOMER,
      };
      jest.spyOn(userService, 'getUser').mockImplementation(async () => user);

      expect(await userController.getUser(validId)).toBe(user);
    });

    it('should return user by invalid id', async () => {
      const validId = '1000000';
      const result = undefined;
      jest.spyOn(userService, 'getUser').mockImplementation(async () => result);

      expect(await userController.getUser(validId)).toBe(result);
    });
  });

  describe('activateUser', () => {
    it('should change status of "blocked" user to "active"', async () => {
      const id = '1';
      const result = {
        id: +id,
      };
      jest
        .spyOn(userService, 'activateUser')
        .mockImplementation(async () => result);

      expect(await userController.activateUser(id)).toBe(result);
    });

    it('should not change status of "active" user', async () => {
      const id = '2';
      const result = {
        id: +id,
      };
      jest
        .spyOn(userService, 'activateUser')
        .mockImplementation(async () => result);

      expect(await userController.activateUser(id)).toBe(result);
    });
  });

  describe('blockUser', () => {
    it('should change status of "active" user to "blocked"', async () => {
      const id = '1';
      const result = {
        id: +id,
      };
      jest
        .spyOn(userService, 'blockUser')
        .mockImplementation(async () => result);

      expect(await userController.blockUser(id)).toBe(result);
    });

    it('should not change status of "blocked" user', async () => {
      const id = '3';
      const result = {
        id: +id,
      };
      jest
        .spyOn(userService, 'blockUser')
        .mockImplementation(async () => result);

      expect(await userController.blockUser(id)).toBe(result);
    });
  });
});
