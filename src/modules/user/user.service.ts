import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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
      where: {
        id,
      },
      data: {
        isActive,
      },
    });
  }
}
