import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './model/create-user-dto.interface';
import { UpdateUserDto } from './model/update-user-dto.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('find')
  async getUserByEmail(@Query('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(+id);
  }

  @Put(':id/block')
  async blockUser(@Param('id') id: string) {
    return this.userService.blockUser(+id);
  }

  @Put(':id/activate')
  async activateUser(@Param('id') id: string) {
    return this.userService.activateUser(+id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
