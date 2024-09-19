import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginPersonalDto } from './dto/login-personal.dto';
import { CreatePersonalDto } from './dto/create-personal.dto';

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
}
