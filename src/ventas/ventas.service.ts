import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class VentasService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('VentasService');
  create(createVentaDto: CreateVentaDto) {
    return 'This action adds a new venta';
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5, search = '' } = paginationDto;

    const whereCondition = search
      ? {
          OR: [
            {
              tb_cliente: {
                tb_personas: {
                  nombres: {
                    contains: search,
                  },
                },
              },
            },
            {
              numero_documento: {
                contains: search,
              },
            },
            {
              serie_documento: {
                contains: search,
              },
            },
          ],
        }
      : {};

    try {
      const [ventas, total] = await Promise.all([
        this.prisma.tb_ventas.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            fecha_venta: 'desc',
          },
          where: whereCondition,
          include: {
            tb_cliente: {
              include: {
                tb_personas: {
                  select: {
                    nombres: true,
                  },
                },
              },
            },
            tb_metodo_pago: {
              select: {
                nombre_metodo_pago: true,
              },
            },
            tb_sucursales: {
              select: {
                nombre_sucursal: true,
              },
            },
            tb_personal: {
              include: {
                tb_personas: {
                  select: {
                    nombres: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.tb_ventas.count({
          where: whereCondition,
        }),
      ]);

      return {
        info: {
          page: page,
          limit: limit,
          total,
          next: `${process.env.HOST_API}/ventas?page=${page + 1}&limit=${limit}&search=${search}`,
          prev:
            page > 1
              ? `${process.env.HOST_API}/ventas?page=${page - 1}&limit=${limit}&search=${search}`
              : null,
        },
        ventas,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} venta`;
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
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
