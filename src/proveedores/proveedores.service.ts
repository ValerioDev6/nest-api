import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';

@Injectable()
export class ProveedoresService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('ProveedoresService');

  async create(createProveedoreDto: CreateProveedoreDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const newProveedor = await prisma.tb_proveedores.create({
          data: {
            ...createProveedoreDto,
          },
        });

        return newProveedor;
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findAllComboBox() {
    try {
      const proveedores = await this.prisma.tb_proveedores.findMany({
        orderBy: {
          tb_personas: {
            nombres: 'asc',
          },
        },
        select: {
          id_proveedor: true,
          tb_personas: {
            select: {
              numero_documento: true,
              correo: true,
              telefono: true,
              nombres: true,
              tb_direccion: {
                select: {
                  direccion: true,
                },
              }, // Incluye tb_direccion directamente en select
            },
          },
        },
      });

      return proveedores;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5, search = '' } = paginationDto;

    try {
      const [proveedores, total] = await Promise.all([
        this.prisma.tb_proveedores.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            tb_personas: {
              OR: [
                { nombres: { contains: search } },
                { apellido_paterno: { contains: search } },
                { apellido_materno: { contains: search } },
              ],
            },
          },
          include: {
            tb_personas: {
              include: {
                tb_tipo_persona: true,
                tb_tipo_documento: true,
                tb_sexo: true,
                tb_direccion: true,
                tb_pais: true,
                tb_tipo_telefono: true,
              },
            },
          },
        }),
        this.prisma.tb_proveedores.count({
          where: {
            tb_personas: {
              OR: [
                { nombres: { contains: search } },
                { apellido_paterno: { contains: search } },
                { apellido_materno: { contains: search } },
              ],
            },
          },
        }),
      ]);

      return {
        info: {
          page,
          limit,
          total,
          next:
            page * limit < total
              ? `${process.env.HOST_API}/proveedores?page=${page + 1}&limit=${limit}&search=${search}`
              : null,
          prev:
            page > 1
              ? `${process.env.HOST_API}/proveedores?page=${page - 1}&limit=${limit}&search=${search}`
              : null,
        },
        proveedores,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const proveedor = await this.prisma.tb_proveedores.findUnique({
        where: { id_proveedor: id },
      });

      if (!proveedor) {
        throw new NotFoundException(`proveedor with ID ${id} not found`);
      }

      return proveedor;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  update(id: string, updateProveedoreDto: UpdateProveedoreDto) {
    return `This action updates a #${id} proveedore`;
  }

  async remove(id: string) {
    try {
      const proveedor = await this.prisma.tb_proveedores.findUnique({
        where: { id_proveedor: id },
      });

      if (!proveedor) {
        throw new NotFoundException(`proveedor with  ID ${id} not found`);
      }

      await this.prisma.tb_proveedores.delete({
        where: { id_proveedor: id },
      });

      return { message: `proveedor with ID ${id} has been deleted` };
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
