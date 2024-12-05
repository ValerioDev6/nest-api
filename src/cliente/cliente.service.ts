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
  async create(createClienteDto: CreateClienteDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const newCliente = await prisma.tb_cliente.create({
          data: {
            ...createClienteDto,
          },
        });

        return newCliente;
      });
    } catch (error) {
      this.handleExceptions(error);
    }
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
        select: {
          id_cliente: true,
          tb_personas: {
            select: {
              numero_documento: true,
              correo: true,
              telefono: true,
              nombres: true,
              razon_social: true,
              tb_direccion: {
                select: {
                  direccion: true,
                },
              },
            },
          },
        },
      });
      return clientes;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findOne(id: string) {
    try {
      const cliente = await this.prisma.tb_cliente.findUnique({
        where: { id_cliente: id },
        include: {
          tb_personas: {
            select: {
              nombres: true,
              correo: true,
              razon_social: true,
              fecha_nacimiento: true,
              numero_documento: true,
              telefono: true,
              tb_direccion: true,
              tb_pais: true,
              tb_sexo: true,
              tb_telefonos_persona: true,
            },
          },
          tb_ventas: true, // Incluye todas las ventas
        },
      });

      if (!cliente) {
        throw new NotFoundException(`Cliente with ID ${id} not found`);
      }

      return cliente;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    try {
      const { id_persona, ...restUpdateData } = updateClienteDto;

      const updatedCliente = await this.prisma.tb_cliente.update({
        where: { id_cliente: id },
        data: {
          ...restUpdateData,
          ...(id_persona
            ? {
                tb_personas: {
                  connect: { id_persona },
                },
              }
            : undefined),
          tb_ventas: {
            set: [], // Si necesitas manejar las ventas de alguna manera
          },
        },
        include: {
          tb_personas: true,
        },
      });

      return updatedCliente;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const cliente = await this.prisma.tb_cliente.findUnique({
        where: { id_cliente: id },
      });

      if (!cliente) {
        throw new NotFoundException(`cliente with  ID ${id} not found`);
      }

      await this.prisma.tb_cliente.delete({
        where: { id_cliente: id },
      });

      return { message: `cliente with ID ${id} has been deleted` };
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
