import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginPersonalDto } from './dto/login-personal.dto';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { tb_personal } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

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
            apellido_p: true,
            apellido_m: true,
            fecha_nacimiento: true,
            correo: true,
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

    const payload: JwtPayload = { id: nuevoPersonal.id_personal };
    const token = await this.getJwtToken(payload);

    return {
      user: nuevoPersonal,
      access_token: token,
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
    // return {
    //   ...user,
    //   token: this.getJwtToken({ id: user.id_personal }),
    // };
    const { id_personal, email, estado, personal_img, id_rol, id_persona } = user;
    const personaInfo = id_persona
      ? await this.prisma.tb_personas.findUnique({
          where: { id_persona },
          select: {
            nombres: true,
            apellido_p: true,
            apellido_m: true,
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
  async getTokens(userId: string) {
    const payload: JwtPayload = { id: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m', // Token de acceso de corta duración
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d', // Refresh token de larga duración
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
