import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ClienteService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('ClienteService');
  create(createClienteDto: CreateClienteDto) {
    return 'This action adds a new cliente';
  }
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search = '' } = paginationDto;

    try {
      const [cliente, total] = await Promise.all([
        this.prisma.tb_cliente.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { fecha_registro: 'desc' },
          where: {
            tb_personas: {
              nombres: {
                contains: search,
              },
            },
          },
          include: {
            tb_personas: true,
          },
        }),
        this.prisma.tb_cliente.count({
          where: {
            tb_personas: {
              nombres: {
                contains: search,
              },
            },
          },
        }),
      ]);

      return {
        info: {
          page,
          limit,
          total,
          next: `${process.env.HOST_API}/cliente?page=${page + 1}&limit=${limit}&search=${search}`,
          prev:
            page > 1
              ? `${process.env.HOST_API}/cliente?page=${page - 1}&limit=${limit}&search=${search}`
              : null,
        },
        cliente,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAllCombo() {
    try {
      const clientes = await this.prisma.tb_cliente.findMany({
        orderBy: {
          id_cliente: 'asc',
        },
      });
      return clientes;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
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
