import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const personal = await this.prisma.tb_personal.findUnique({
      where: { id_personal: id },
      include: { tb_personas: true },
    });

    if (!personal) {
      throw new UnauthorizedException('Token no válido');
    }

    if (!personal.estado) {
      throw new UnauthorizedException('Usuario inactivo, contacte al administrador');
    }

    return personal;
  }
}
