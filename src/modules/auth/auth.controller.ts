import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { Tokens } from './types';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from '../../shared/decorators';
import { LocalAuthGuard } from '../../shared/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: SignUpDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(HttpStatus.CREATED)
  signinLocal(@Body() dto: SignInDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }
}
