import { Test } from "@nestjs/testing";
import { UserService } from '../src/modules/user/user.service';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { Decimal } from "@prisma/client/runtime";
import { Role } from "@prisma/client";

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const date = new Date();
  const passwordHash = 'pass';
  const user1 = {
    firstName: 'Mark',
    lastName: 'Putyato',
    email: 'm0rk4@gmail.com',
    passwordHash,
  };
  const user2 = {
    firstName: 'Vlad',
    lastName: 'Nevinsky',
    email: 'newvlad2001@gmail.com',
    passwordHash,
  };
  let id1, id2;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    await prismaService.user.deleteMany({});
    id1 = (await prismaService.user.create({
      data: user1
    })).id;
    id2 = (await prismaService.user.create({
      data: user2
    })).id;
  });

  describe('getUsers', () => {
    it('should return all users in the system', async () => {
      const expectedResult = [{
          id: id1,
          firstName: "Mark",
          lastName: "Putyato",
          email: "m0rk4@gmail.com",
          createdAt: date,
          isActive: true,
          updatedAt: date,
          userRating: new Decimal(5),
        },
        {
          "id": id2,
          "firstName": "Vlad",
          "lastName": "Nevinsky",
          "email": "newvlad2001@gmail.com",
          "createdAt": date,
          "isActive": true,
          "updatedAt": date,
          "userRating": new Decimal(5),
        }
      ];

      expect((await userService.getUsers()).map(user => {
        user.createdAt = date;
        user.updatedAt = date;
        return user;
      })).toStrictEqual(expectedResult);
    });
  });

  describe('getUser', () => {
    it('should return user by valid id', async () => {
      const result = {
        id: id1,
        firstName: "Mark",
        lastName: "Putyato",
        email: "m0rk4@gmail.com",
        createdAt: date,
        isActive: true,
        updatedAt: date,
        userRating: new Decimal(5),
      };

      const user = await userService.getUser(id1);
      user.createdAt = date;
      user.updatedAt = date;
      expect(user).toStrictEqual(result);
    });

    it('should return undefined by invalid id', async () => {
      const invalidId = 100000000;
      const result = null;
      expect(await userService.getUser(invalidId)).toBe(result);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by valid email', async () => {
      const validEmail = "m0rk4@gmail.com";
      const result = {
        id: id1,
        firstName: "Mark",
        lastName: "Putyato",
        email: "m0rk4@gmail.com",
        createdAt: date,
        isActive: true,
        updatedAt: date,
        userRating: new Decimal(5),
      };

      const user = await userService.getUserByEmail(validEmail);
      user.createdAt = date;
      user.updatedAt = date;
      expect(user).toStrictEqual(result);
    });

    it('should return user by invalid email', async () => {
      const invalidEmail = "kolodkonikitos@gmail.com";
      const result = null;
      expect(await userService.getUserByEmail(invalidEmail)).toBe(result);
    });
  });

  describe('createUser', () => {
    it('should create new user and return its credentials', async () => {
      const userToCreate = {
        firstName: "Nikita",
        lastName: "Kolodko",
        email: "kolodkonikita05082001@gmail.com",
        password: "123q456Q"
      };
      const result = {
        id: id2 + 1,
        firstName: "Nikita",
        lastName: "Kolodko",
        email: "kolodkonikita05082001@gmail.com",
        passwordHash: "123q456Q",
        createdAt: date,
        updatedAt: date,
        userRating: new Decimal(5),
        isActive: true,
        role: Role.USER
      };

      const user = await userService.createUser(userToCreate);
      user.createdAt = date;
      user.updatedAt = date;
      expect(user).toStrictEqual(result);
    });
  });

  // TODO: create tests for activateUser and blockUser

  describe('updateUser', () => {
    it('should change user first name, last name and email', async () => {
      const userToUpdate = {
        firstName: "Nikitos",
        lastName: "Kolodko",
        email: "kolodkonikitos@gmail.com"
      };
      const resultUpdate = {
        id: +id1
      }
      const resultUser = {
        id: id1,
        firstName: "Nikitos",
        lastName: "Kolodko",
        email: "kolodkonikitos@gmail.com",
        createdAt: date,
        isActive: true,
        updatedAt: date,
        userRating: new Decimal(5),
      };

      expect(await userService.updateUser(id1, userToUpdate)).toStrictEqual(resultUpdate);
      const user = await userService.getUser(id1);
      user.createdAt = date;
      user.updatedAt = date;
      expect(user).toStrictEqual(resultUser);
    });
  });

});