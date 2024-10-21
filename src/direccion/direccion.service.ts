import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DireccionService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('DireccionService');

  create(createDireccionDto: CreateDireccionDto) {
    return 'This action adds a new direccion';
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5, search = '' } = paginationDto;
    try {
      const [direcciones, total] = await Promise.all([
        this.prisma.tb_direccion.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { direccion: 'asc' },
          include: {
            tb_tipo_via: true,
            tb_tipo_zona: true,
          },

          where: {
            OR: [
              {
                direccion: { contains: search },
              },
            ],
          },
        }),
        this.prisma.tb_direccion.count({
          where: {
            OR: [{ direccion: { contains: search } }],
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
        direcciones,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAllComboBox() {
    try {
      const direcciones = await this.prisma.tb_direccion.findMany({
        orderBy: {
          direccion: 'asc',
        },
      });

      return direcciones;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} direccion`;
  }

  update(id: number, updateDireccionDto: UpdateDireccionDto) {
    return `This action updates a #${id} direccion`;
  }

  remove(id: number) {
    return `This action removes a #${id} direccion`;
  }

  private handleExceptions(error: any) {
    this.logger.error(error);
    if (error instanceof HttpException) {
      throw error;
    }
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

//  angulo jayo rossangel
