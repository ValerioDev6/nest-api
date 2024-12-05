import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginPersonalDto } from './dto/login-personal.dto';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { GetUser } from './decorators/get-user.decorator';
import { tb_personal } from '@prisma/client';
import { Auth } from './decorators/auth.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordDtoIndividual } from './dto/cambiar-passowrd-individual.dto';

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

  @Post('change-password')
  @Auth()
  changePassword(@GetUser() user: tb_personal, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(user.id_personal, changePasswordDto);
  }
  // Controlador
  @Post('change-password-personal')
  changePasswordByAdmin(@Body() changePasswordDto: ChangePasswordDtoIndividual) {
    return this.authService.changePassword(changePasswordDto.idPersonal, changePasswordDto);
  }
}
