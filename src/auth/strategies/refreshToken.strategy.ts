import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload) {
    const refreshToken = req.body?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('Refresh token not found');

    return {
      ...payload,
      refreshToken,
    };
  }
}
