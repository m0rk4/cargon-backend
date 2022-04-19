import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';

import { SignInDto } from './dto';
import { JwtPayload, LoginResponse } from './types';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<JwtPayload> {
    const user = await this.userService.getUserByEmail(email);

    if (!user?.isActive) {
      throw new UnauthorizedException(
        "User account doesn't exist or has been disabled",
      );
    }

    const passwordMatches = await argon.verify(user.passwordHash, password);
    if (!passwordMatches) {
      throw new UnauthorizedException("Email or password didn't match");
    }

    return {
      sub: user.id,
      role: user.role,
      email: user.email,
    };
  }

  async signupLocal(dto: SignUpDto): Promise<void> {
    const passwordHash = await argon.hash(dto.password);

    try {
      await this.userService.createUser({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials incorrect');
        }
      }
      throw error;
    }
  }

  async signinLocal(dto: SignInDto): Promise<LoginResponse> {
    const user = await this.userService.getUserByEmail(dto.email);
    return await this.getToken(user);
  }

  async getToken(user: User): Promise<LoginResponse> {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('AT_SECRET'),
      expiresIn:
        this.configService.get<number>('AT_EXPIRES_IN_MILLISECONDS') / 1000,
    });

    delete user.passwordHash;
    return {
      user,
      accessToken: access_token,
      expiresIn: this.configService.get<number>('AT_EXPIRES_IN_MILLISECONDS'),
    };
  }
}
