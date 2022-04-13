import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateUserDto } from './model/create-user-dto.interface';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  private static readonly USER_INFO = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    createdAt: true,
    updatedAt: true,
    isActive: true,
    userRating: true,
  };

  async createUser(data: CreateUserDto) {
    return this.prismaService.user.create({
      data: { ...data },
    });
  }

  async getUsers() {
    return this.prismaService.user.findMany({
      select: UserService.USER_INFO,
    });
  }

  async getUser(id: number) {
    return this.prismaService.user.findUnique({
      select: UserService.USER_INFO,
      where: { id },
    });
  }

  async getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async blockUser(id: number) {
    return this.changeUserActivity(id, false);
  }

  async activateUser(id: number) {
    return this.changeUserActivity(id, true);
  }

  private changeUserActivity(id: number, isActive: boolean) {
    return this.prismaService.user.update({
      select: { id: true },
      where: { id },
      data: { isActive },
    });
  }
}
