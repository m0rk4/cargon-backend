import { Test } from '@nestjs/testing';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { prismaMock } from '../test/singleton';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto';
import { LoginResponse } from './types';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
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

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('signupLocal', () => {
    it('should call signup in service', async () => {
      const signupDto: SignUpDto = {
        firstName: 'Mark',
        lastName: 'Mark',
        password: '12345678',
        email: 'test@mail.ru',
      };
      jest
        .spyOn(authService, 'signupLocal')
        .mockImplementation(async () => Promise.resolve());

      await authController.signupLocal(signupDto);

      expect(authService.signupLocal).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('signinLocal', () => {
    it('should call signin in service', async () => {
      const signinDto: SignInDto = {
        password: '12345678',
        email: 'test@mail.ru',
      };
      const response = { accessToken: 'test-access token' } as LoginResponse;
      jest
        .spyOn(authService, 'signinLocal')
        .mockImplementation(async () => response);

      const result = await authController.signinLocal(signinDto);

      expect(result).toBe(response);
      expect(authService.signinLocal).toHaveBeenCalledWith(signinDto);
    });
  });
});
