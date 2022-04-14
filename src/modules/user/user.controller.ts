import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../../shared/decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from '../../shared/guards';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.MANAGER)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Put(':id/block')
  @UseGuards(RoleGuard)
  @Roles(Role.MANAGER)
  async blockUser(@Param('id') id: string) {
    return this.userService.blockUser(+id);
  }

  @Put(':id/activate')
  @UseGuards(RoleGuard)
  @Roles(Role.MANAGER)
  async activateUser(@Param('id') id: string) {
    return this.userService.activateUser(+id);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(+id);
  }
}
