import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginPersonalDto } from './dto/login-personal.dto';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Register method (remains largely unchanged)
  async register(createPersonalDto: CreatePersonalDto) {
    const { contrasenia, id_persona, ...rest } = createPersonalDto;

    // Verificar si la persona existe
    const personaExiste = await this.prisma.tb_personas.findUnique({
      where: { id_persona },
    });

    if (!personaExiste) {
      throw new BadRequestException('La persona no existe en el sistema');
    }

    // Verificar si ya existe un personal para esta persona
    const personalExiste = await this.prisma.tb_personal.findFirst({
      where: { id_persona },
    });

    if (personalExiste) {
      throw new BadRequestException('Ya existe un personal para esta persona');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    // Crear el nuevo personal
    const nuevoPersonal = await this.prisma.tb_personal.create({
      data: {
        ...rest,
        id_persona,
        contrasenia: hashedPassword,
      },
    });

    // Generar token
    const payload: JwtPayload = { id: nuevoPersonal.id_personal };

    return {
      ...nuevoPersonal,
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginPersonalDto: LoginPersonalDto) {
    const { email, password } = loginPersonalDto;

    // Validate credentials
    const personal = await this.prisma.tb_personal.findFirst({
      where: { email },
    });

    if (!personal) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, personal.contrasenia);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generate JWT
    const payload: JwtPayload = { id: personal.id_personal };
    return {
      access_token: this.getJwtToken(payload),
    };
  }

  // Helper method for generating JWT
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
