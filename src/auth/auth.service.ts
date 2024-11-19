import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginPersonalDto } from './dto/login-personal.dto';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { tb_personal } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createPersonalDto: CreatePersonalDto) {
    const { contrasenia, ...rest } = createPersonalDto;

    const personalExiste = await this.prisma.tb_personal.findFirst({
      where: { email: rest.email },
      select: { id_personal: true },
    });

    if (personalExiste) {
      throw new BadRequestException('Ya existe un personal con este email');
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);
    const nuevoPersonal = await this.prisma.tb_personal.create({
      data: {
        ...rest,
        contrasenia: hashedPassword,
      },
      select: {
        id_personal: true,
        email: true,
        estado: true,
        personal_img: true,
        tb_personas: {
          select: {
            id_persona: true,
            nombres: true,
            apellido_paterno: true,
            apellido_materno: true,
            fecha_nacimiento: true,
          },
        },
        tb_rol: {
          select: {
            id_rol: true,
            nombre_rol: true,
          },
        },
      },
    });

    return {
      user: nuevoPersonal,
    };
  }

  async login(loginPersonalDto: LoginPersonalDto) {
    const { email, password } = loginPersonalDto;

    const personal = await this.prisma.tb_personal.findFirst({
      where: { email },
    });

    if (!personal) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, personal.contrasenia);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { contrasenia, ...user } = personal;
    const payload: JwtPayload = { id: personal.id_personal };

    const token = await this.getJwtToken(payload);

    return {
      personal: user,
      access_token: token,
    };
  }

  async checkAuthStatus(user: tb_personal) {
    const { id_personal, email, estado, personal_img, id_rol, id_persona } = user;
    const personaInfo = id_persona
      ? await this.prisma.tb_personas.findUnique({
          where: { id_persona },
          select: {
            nombres: true,
            apellido_paterno: true,
            apellido_materno: true,
          },
        })
      : null;

    const payload: JwtPayload = { id: id_personal };
    const tokens = await this.getJwtToken(payload);

    return {
      id_personal,
      email,
      estado,
      personal_img,
      id_rol,
      persona: personaInfo,
      access_token: tokens,
    };
  }

  async changePassword(idPersonal: string, changePasswordDto: ChangePasswordDto) {
    const personal = await this.prisma.tb_personal.findUnique({
      where: { id_personal: idPersonal },
    });

    if (!personal) {
      throw new UnauthorizedException('Personal no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      personal.contrasenia,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }
    if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
      throw new UnauthorizedException('La nueva contraseña y la confirmación no coinciden');
    }

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.prisma.tb_personal.update({
      where: { id_personal: idPersonal },
      data: { contrasenia: hashedNewPassword },
    });

    return {
      ok: true,
      message: 'Contraseña actualizada exitosamente',
    };
  }
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
