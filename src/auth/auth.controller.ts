import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginPersonalDto } from './dto/login-personal.dto';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { GetUser } from './decorators/get-user.decorator';
import { tb_personal } from '@prisma/client';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createPersonalDto: CreatePersonalDto) {
    return this.authService.register(createPersonalDto);
  }
  @Post('login')
  async login(@Body() loginPersonalDto: LoginPersonalDto) {
    return this.authService.login(loginPersonalDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: tb_personal) {
    return this.authService.checkAuthStatus(user);
  }
}
