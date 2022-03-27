import { Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getNotApprovedDriverApplications() {
    return this.userService.getUsers();
  }

  @Put(':id/block')
  async blockUser(@Param('id') id: string) {
    return this.userService.blockUser(+id);
  }

  @Put(':id/activate')
  async activateUser(@Param('id') id: string) {
    return this.userService.activateUser(+id);
  }
}
