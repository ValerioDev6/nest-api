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
import { CreateSurcursalDto } from './dto/create-surcursal.dto';
import { UpdateSurcursalDto } from './dto/update-surcursal.dto';

@Injectable()
export class SurcursalService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('SucursalService');

  async create(createSurcursalDto: CreateSurcursalDto) {
    try {
      const { nombre_sucursal, email, telefono, id_direccion, id_tipo_telefono, id_pais } =
        createSurcursalDto;

      const newSucursal = await this.prisma.tb_sucursales.create({
        data: {
          nombre_sucursal,
          telefono,
          email,
          tb_direccion: {
            connect: { id_direccion },
          },
          tb_tipo_telefono: {
            connect: { id_tipo_telefono },
          },
          tb_pais: {
            connect: { id_pais },
          },
        },
      });
      return newSucursal;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5, search = '' } = paginationDto;
    try {
      const [sucursales, total] = await Promise.all([
        this.prisma.tb_sucursales.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { nombre_sucursal: 'asc' },
          include: {
            tb_direccion: true,
            tb_tipo_telefono: true,
            tb_pais: true,
          },
          where: {
            OR: [{ nombre_sucursal: { contains: search } }],
          },
        }),
        this.prisma.tb_sucursales.count({
          where: {
            OR: [
              {
                nombre_sucursal: { contains: search },
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
        sucursales,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findAllSucursalComboBox() {
    try {
      const sucursales = await this.prisma.tb_sucursales.findMany({
        orderBy: {
          nombre_sucursal: 'asc',
        },
      });

      return sucursales;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const sucursal = await this.prisma.tb_sucursales.findUnique({
        where: { id_sucursal: id },
      });

      if (!sucursal) {
        throw new NotFoundException(`Sucursal with ID ${id} not found`);
      }

      return sucursal;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateSurcursalDto: UpdateSurcursalDto) {
    try {
      const existingSucursal = await this.prisma.tb_sucursales.findUnique({
        where: { id_sucursal: id },
      });

      if (!existingSucursal) {
        throw new NotFoundException(`Sucursal with ID ${id} not found`);
      }

      const updateSucursal = await this.prisma.tb_sucursales.update({
        where: { id_sucursal: id },
        data: { ...updateSurcursalDto },
      });

      return updateSucursal;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const sucursal = await this.prisma.tb_sucursales.findUnique({
        where: { id_sucursal: id },
      });

      if (!sucursal) {
        throw new NotFoundException(`Sucursal with  ID ${id} not found`);
      }

      await this.prisma.tb_sucursales.delete({
        where: { id_sucursal: id },
      });

      return { message: `Sucursal with ID ${id} has been deleted` };
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
