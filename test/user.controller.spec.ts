import { Test } from "@nestjs/testing";
import { Role } from '@prisma/client';
import { UserController } from '../src/modules/user/user.controller';
import { UserService } from '../src/modules/user/user.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { prismaMock } from "../src/modules/test/singleton";
import { Decimal } from "@prisma/client/runtime";

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, {
        provide: PrismaService,
        useValue: prismaMock
      }],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('getUsers', () => {
    it('should return all users in the system', async () => {
      const users = [
        {
          id: 1,
          firstName: "Mark",
          lastName: "Putyato",
          email: "m0rk4@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          userRating: new Decimal(5)
        },
        {
          id: 2,
          firstName: "Vlad",
          lastName: "Nevinsky",
          email: "newvlad2001@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          userRating: new Decimal(5)
        }
      ];
      jest.spyOn(userService, 'getUsers').mockImplementation(async () => users);

      expect(await userController.getUsers()).toBe(users);
    });
  });

  describe('getUser', () => {
    it('should return user by valid id', async () => {
      const validId = "1";
      const user = {
        id: +validId,
        firstName: "Mark",
        lastName: "Putyato",
        email: "m0rk4@gmail.com",
        passwordHash: "pass",
        createdAt: new Date(),
        updatedAt: new Date(),
        userRating: new Decimal(5),
        isActive: true,
        role: Role.USER
      };
      jest.spyOn(userService, 'getUser').mockImplementation(async () => user);

      expect(await userController.getUser(validId)).toBe(user);
    });

    it('should return user by invalid id', async () => {
      const validId = "1000000";
      const result = undefined;
      jest.spyOn(userService, 'getUser').mockImplementation(async () => result);

      expect(await userController.getUser(validId)).toBe(result);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by valid email', async () => {
      const validEmail = "m0rk4@gmail.com";
      const user = {
        id: 1,
        firstName: "Mark",
        lastName: "Putyato",
        email: validEmail,
        passwordHash: "pass",
        createdAt: new Date(),
        updatedAt: new Date(),
        userRating: new Decimal(5),
        isActive: true,
        role: Role.USER
      };
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(async () => user);

      expect(await userController.getUserByEmail(validEmail)).toBe(user);
    });

    it('should return user by invalid email', async () => {
      const validEmail = "kolodkonikitos@gmail.com";
      const result = undefined;
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(async () => result);

      expect(await userController.getUserByEmail(validEmail)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create new user and return its credentials', async () => {
      const userToCreate = {
        firstName: "Nikita",
        lastName: "Kolodko",
        email: "kolodkonikita05082001@gmail.com",
        password: "123q456Q"
      };
      const result = {
        id: 5,
        firstName: "Nikita",
        lastName: "Kolodko",
        email: "kolodkonikita05082001@gmail.com",
        passwordHash: "123q456Q",
        createdAt: new Date(),
        updatedAt: new Date(),
        userRating: new Decimal(5),
        isActive: true,
        role: Role.USER
      };
      jest.spyOn(userService, 'createUser').mockImplementation(async () => result);

      expect(await userController.create(userToCreate)).toBe(result);
    });
  });

  describe('activateUser', () => {
    it('should change status of "blocked" user to "active"', async () => {
      const id = "1";
      const result = {
        id: +id
      };
      jest.spyOn(userService, 'activateUser').mockImplementation(async () => result);

      expect(await userController.activateUser(id)).toBe(result);
    });

    it('should not change status of "active" user', async () => {
      const id = "2";
      const result = {
        id: +id
      };
      jest.spyOn(userService, 'activateUser').mockImplementation(async () => result);

      expect(await userController.activateUser(id)).toBe(result);
    });
  });

  describe('blockUser', () => {
    it('should change status of "active" user to "blocked"', async () => {
      const id = "1";
      const result = {
        id: +id
      };
      jest.spyOn(userService, 'blockUser').mockImplementation(async () => result);

      expect(await userController.blockUser(id)).toBe(result);
    });

    it('should not change status of "blocked" user', async () => {
      const id = "3";
      const result = {
        id: +id
      };
      jest.spyOn(userService, 'blockUser').mockImplementation(async () => result);

      expect(await userController.blockUser(id)).toBe(result);
    });
  });

  describe('updateUser', () => {
    it('should change user first name, last name and email', async () => {
      const id = "5";
      const userToUpdate = {
        firstName: "Nikitos",
        lastName: "Kolodko",
        email: "kolodkonikitos@gmail.com"
      };
      const result = {
        id: +id
      }
      jest.spyOn(userService, 'updateUser').mockImplementation(async () => result);

      expect(await userController.updateUser(id, userToUpdate)).toBe(result);
    });
  });

});
