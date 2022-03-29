import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateUserDto } from './model/create-user-dto.interface';
import { UpdateUserDto } from './model/update-user-dto.interface';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(data: CreateUserDto) {
    // TODO: implement user registration logic
    const hash = data.password;
    delete data.password;

    return this.prismaService.user.create({
      data: { ...data, passwordHash: hash },
    });
  }

  async getUsers() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    });
  }

  async getUser(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return this.prismaService.user.update({
      select: { id: true },
      where: { id },
      data,
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
      select: {
        id: true,
      },
      where: { id },
      data: { isActive },
    });
  }
}
