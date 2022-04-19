import { Test } from '@nestjs/testing';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { prismaMock } from '../test/singleton';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { Role, User } from '@prisma/client';
import { JwtPayload, LoginResponse } from './types';
import { SignInDto } from './dto';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ForbiddenException } from '@nestjs/common';

describe('AuthController', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        AuthService,
        UserService,
        ConfigService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('getToken', () => {
    it('should get token', async () => {
      const user = {
        id: 1,
        email: 'test@email.com',
        role: Role.CUSTOMER,
      } as User;
      const jwtPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
      const token = 'token';
      const secret = 'secret';
      const expiresInMillis = 1000;

      jest
        .spyOn(configService, 'get')
        .mockImplementation((args) =>
          args === 'AT_SECRET' ? secret : expiresInMillis,
        );
      jest.spyOn(jwtService, 'signAsync').mockImplementation(async () => token);

      const result = await authService.getToken(user);

      expect(jwtService.signAsync).toHaveBeenCalledWith(jwtPayload, {
        secret,
        expiresIn: expiresInMillis / 1000,
      });
      expect(configService.get).toBeCalled();
      expect(result).toEqual({
        user,
        accessToken: token,
        expiresIn: expiresInMillis,
      });
    });
  });

  describe('signinLocal', () => {
    it('should sign in', async () => {
      const signinDto: SignInDto = {
        email: 'test@email.com',
        password: 'pass',
      };
      const user = { email: signinDto.email } as User;
      const tokenResponse: LoginResponse = {
        user,
        accessToken: 'test',
        expiresIn: 123,
      };

      jest
        .spyOn(userService, 'getUserByEmail')
        .mockImplementation(async () => user);
      jest
        .spyOn(authService, 'getToken')
        .mockImplementation(async () => tokenResponse);

      const result = await authService.signinLocal(signinDto);

      expect(result).toBe(tokenResponse);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(user.email);
      expect(authService.getToken).toHaveBeenCalledWith(user);
    });
  });

  describe('signupLocal', () => {
    it('should sign up successfully', async () => {
      const signupDto: SignUpDto = {
        email: 'test@mail.ru',
        firstName: 'Test',
        lastName: 'Test',
        password: 'Test',
      };
      const user = { email: signupDto.email } as User;
      jest
        .spyOn(userService, 'createUser')
        .mockImplementation(async () => user);

      await authService.signupLocal(signupDto);

      expect(userService.createUser).toHaveBeenCalled();
    });

    it('should not sign up', async () => {
      const signupDto: SignUpDto = {
        email: 'test@mail.ru',
        firstName: 'Test',
        lastName: 'Test',
        password: 'Test',
      };
      jest.spyOn(userService, 'createUser').mockImplementation(async () => {
        throw new PrismaClientKnownRequestError(
          'message',
          'P2002',
          'ver1',
          null,
        );
      });

      await expect(async () => {
        await authService.signupLocal(signupDto);
      }).rejects.toThrow(ForbiddenException);
    });
  });
});
