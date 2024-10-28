import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class SexoService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('SexoService');

  async findAllCombo() {
    try {
      const tiposGeneros = await this.prisma.tb_sexo.findMany({
        orderBy: {
          sexo: 'asc',
        },
      });

      return tiposGeneros;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5, search = '' } = paginationDto;
    try {
      const [sexos, total] = await Promise.all([
        this.prisma.tb_sexo.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { sexo: 'asc' },
          where: {
            OR: [{ sexo: { contains: search } }],
          },
        }),
        this.prisma.tb_sexo.count({
          where: {
            OR: [
              {
                sexo: { contains: search },
              },
            ],
          },
        }),
      ]);
      return {
        info: {
          page,
          limit,
          total,
          next: `${process.env.HOST_API}/roles?page=${page + 1}&limit=${limit}&search=${search}`,
          prev:
            page > 1
              ? `${process.env.HOST_API}/roles?page=${page - 1}&limit=${limit}&search=${search}`
              : null,
        },
        sexos,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
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
