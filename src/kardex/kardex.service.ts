import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateKardexDto } from './dto/create-kardex.dto';
import { UpdateKardexDto } from './dto/update-kardex.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class KardexService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('KardexService');
  create(createKardexDto: CreateKardexDto) {
    return 'This action adds a new kardex';
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search = '' } = paginationDto;

    const whereCondition = search
      ? {
          OR: [
            {
              tb_productos: {
                nombre_producto: {
                  contains: search,
                },
              },
            },
          ],
        }
      : {};

    try {
      const [kardex, total] = await Promise.all([
        this.prisma.tb_kardex.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            fecha_movimiento: 'desc',
          },
          where: whereCondition,
          include: {
            tb_productos: {
              select: {
                nombre_producto: true,
              },
            },
          },
        }),
        this.prisma.tb_kardex.count({
          where: whereCondition,
        }),
      ]);

      return {
        info: {
          page,
          limit,
          total,
          next: `${process.env.HOST_API}/kardex?page=${page + 1}&limit=${limit}&search=${search}`,
          prev:
            page > 1
              ? `${process.env.HOST_API}/kardex?page=${page - 1}&limit=${limit}&search=${search}`
              : null,
        },
        kardex,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} kardex`;
  }

  update(id: number, updateKardexDto: UpdateKardexDto) {
    return `This action updates a #${id} kardex`;
  }

  remove(id: number) {
    return `This action removes a #${id} kardex`;
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
