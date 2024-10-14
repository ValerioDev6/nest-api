import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTipoTelefonoDto } from './dto/create-tipo-telefono.dto';
import { UpdateTipoTelefonoDto } from './dto/update-tipo-telefono.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TipoTelefonoService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('TipoTelefonoService');
  create(createTipoTelefonoDto: CreateTipoTelefonoDto) {
    return 'This action adds a new tipoTelefono';
  }

  async findAll() {
    try {
      const tiposTelfonos = await this.prisma.tb_tipo_telefono.findMany({
        orderBy: {
          tipo_telefono: 'asc',
        },
      });

      return tiposTelfonos;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoTelefono`;
  }

  update(id: number, updateTipoTelefonoDto: UpdateTipoTelefonoDto) {
    return `This action updates a #${id} tipoTelefono`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoTelefono`;
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new BadRequestException('Ya existe un registro con esos datos únicos');
        case 'P2014':
          throw new BadRequestException('El registro viola una restricción de relación');
        case 'P2003':
          throw new BadRequestException('El registro viola una restricción de clave foránea');
        case 'P2025':
          throw new NotFoundException('No se encontró el registro para actualizar o eliminar');
      }
    }

    if (error instanceof NotFoundException) {
      throw error;
    }

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado. Por favor, contacte al administrador.',
    );
  }
}
