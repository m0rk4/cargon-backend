import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime';
import { Role } from '@prisma/client';

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

    id1 = (
      await prismaService.user.create({
        data: user1,
      })
    ).id;
    id2 = (
      await prismaService.user.create({
        data: user2,
      })
    ).id;
  });

  afterEach(async () => {
    let id = id1;
    await prismaService.user.delete({
      where: { id },
    });

    id = id2;
    await prismaService.user.delete({
      where: { id },
    });
  });

  describe('getUsers', () => {
    it('should return all users in the system', async () => {
      const expectedResult = [
        {
          id: id1,
          firstName: user1.firstName,
          lastName: user1.lastName,
          email: user1.email,
          createdAt: date,
          isActive: true,
          updatedAt: date,
          userRating: new Decimal(5),
        },
        {
          id: id2,
          firstName: user2.firstName,
          lastName: user2.lastName,
          email: user2.email,
          createdAt: date,
          isActive: true,
          updatedAt: date,
          userRating: new Decimal(5),
        },
      ];

      expect(
        (await userService.getUsers()).map((user) => {
          user.createdAt = date;
          user.updatedAt = date;
          return user;
        }),
      ).toStrictEqual(expectedResult);
    });
  });

  describe('getUser', () => {
    it('should return user by valid id', async () => {
      const result = {
        id: id1,
        firstName: user1.firstName,
        lastName: user1.lastName,
        email: user1.email,
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
      expect(await userService.getUser(invalidId)).toStrictEqual(result);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by valid email', async () => {
      const validEmail = 'm0rk4@gmail.com';
      const result = {
        id: id1,
        firstName: user1.firstName,
        lastName: user1.lastName,
        email: user1.email,
        createdAt: date,
        isActive: true,
        updatedAt: date,
        passwordHash,
        role: Role.CUSTOMER,
        userRating: new Decimal(5),
      };

      const user = await userService.getUserByEmail(validEmail);
      user.createdAt = date;
      user.updatedAt = date;
      expect(user).toStrictEqual(result);
    });

    it('should return user by invalid email', async () => {
      const invalidEmail = 'kolodkonikitos@gmail.com';
      const result = null;
      expect(await userService.getUserByEmail(invalidEmail)).toBe(result);
    });
  });

  describe('createUser', () => {
    it('should create new user and return its credentials', async () => {
      const userToCreate = {
        firstName: 'Nikita',
        lastName: 'Kolodko',
        email: 'kolodkonikita05082001@gmail.com',
        passwordHash: '123q456Q',
      };

      const result = {
        id: id2 + 1,
        firstName: userToCreate.firstName,
        lastName: userToCreate.lastName,
        email: userToCreate.email,
        passwordHash: userToCreate.passwordHash,
        createdAt: date,
        updatedAt: date,
        userRating: new Decimal(5),
        isActive: true,
        role: Role.CUSTOMER,
      };

      const user = await userService.createUser(userToCreate);
      user.createdAt = date;
      user.updatedAt = date;
      expect(user).toStrictEqual(result);

      const id = user.id;
      await prismaService.user.delete({
        where: { id },
      });
    });
  });
});
