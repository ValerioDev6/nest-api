import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MarcasService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('MarcasService');

  async create(createMarcaDto: CreateMarcaDto) {
    const { nombre_marca, estado, created_at } = createMarcaDto;

    try {
      const normalizedNombreMarca = nombre_marca.trim().toLowerCase();

      const existingMarca = await this.prisma.tb_marcas.findFirst({
        where: {
          nombre_marca: {
            equals: normalizedNombreMarca,
          },
        },
      });

      if (existingMarca) {
        throw new BadRequestException(`Ya existe una marca con el nombre "${nombre_marca.trim()}"`);
      }
      const newMarca = await this.prisma.tb_marcas.create({
        data: {
          nombre_marca,
          estado,
          created_at,
        },
      });
      newMarca;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findComboBoxAll() {
    try {
      const marcas = await this.prisma.tb_marcas.findMany({
        orderBy: {
          nombre_marca: 'asc',
        },
      });

      return marcas;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5, search = '' } = paginationDto;

    try {
      const [marcas, total] = await Promise.all([
        this.prisma.tb_marcas.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { nombre_marca: 'asc' },
          where: {
            OR: [{ nombre_marca: { contains: search } }],
          },
        }),
        this.prisma.tb_marcas.count({
          where: {
            OR: [
              {
                nombre_marca: { contains: search },
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
        marcas,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const marcas = await this.prisma.tb_marcas.findUnique({
        where: { id_marca: id },
      });

      if (!marcas) {
        throw new NotFoundException(`Marca with ID ${id} not found`);
      }

      return marcas;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async update(id: string, updateMarcaDto: UpdateMarcaDto) {
    try {
      const existingMarca = await this.prisma.tb_marcas.findUnique({
        where: { id_marca: id },
      });

      if (!existingMarca) {
        throw new NotFoundException(`Marca with ID ${id} not found`);
      }

      // Normalizar el nombre para comprobar si ya existe otra marca con el mismo nombre
      const normalizedNombreMarca = updateMarcaDto.nombre_marca?.trim().toLowerCase();
      const marcaConMismoNombre = await this.prisma.tb_marcas.findFirst({
        where: {
          nombre_marca: normalizedNombreMarca,
          id_marca: {
            not: id, // Excluir la marca actual del chequeo
          },
        },
      });

      if (marcaConMismoNombre) {
        throw new BadRequestException(
          `Ya existe una marca con el nombre "${updateMarcaDto.nombre_marca.trim()}"`,
        );
      }

      const updatedMarca = await this.prisma.tb_marcas.update({
        where: { id_marca: id },
        data: { ...updateMarcaDto },
      });

      return updatedMarca;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const marca = await this.prisma.tb_marcas.findUnique({
        where: { id_marca: id },
      });

      if (!marca) {
        throw new NotFoundException(`Marca with ID ${id} not found`);
      }

      await this.prisma.tb_marcas.delete({
        where: { id_marca: id },
      });

      return { message: `Marca with ID ${id} has been deleted` };
    } catch (error) {
      this.handleExceptions(error);
    }
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
