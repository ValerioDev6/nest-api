import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class CategorieService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('CategorieService');

  async create(createCategorieDto: CreateCategorieDto) {
    const { nombre_cat, estado, created_at } = createCategorieDto;

    try {
      const normalizedNombreCat = nombre_cat.trim().toLowerCase();

      const existingCategoria = await this.prisma.tb_categorias.findFirst({
        where: {
          nombre_cat: {
            equals: normalizedNombreCat,
          },
        },
      });

      if (existingCategoria) {
        throw new BadRequestException(
          `Ya existe una categoria con el nombre "${nombre_cat.trim()}"`,
        );
      }
      const newCategorie = await this.prisma.tb_categorias.create({
        data: {
          nombre_cat,
          estado,
          created_at,
        },
      });

      return newCategorie;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findAllComboBox() {
    try {
      const categorias = await this.prisma.tb_categorias.findMany({
        orderBy: {
          nombre_cat: 'asc',
        },
      });

      return categorias;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5, search = '' } = paginationDto;

    try {
      const [categories, total] = await Promise.all([
        this.prisma.tb_categorias.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { nombre_cat: 'asc' },
          where: {
            OR: [{ nombre_cat: { contains: search } }],
          },
        }),
        this.prisma.tb_categorias.count({
          where: {
            OR: [{ nombre_cat: { contains: search } }],
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
        categories,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const categorie = await this.prisma.tb_categorias.findUnique({
        where: { id_categoria: id },
      });

      if (!categorie) {
        throw new NotFoundException(`Categorie with ID ${id} not found`);
      }

      return categorie;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateCategorieDto: UpdateCategorieDto) {
    try {
      const { nombre_cat } = updateCategorieDto;
      const normalizedNombreCat = nombre_cat.trim().toLowerCase();

      const existingCategorie = await this.prisma.tb_categorias.findUnique({
        where: { id_categoria: id },
      });

      if (!existingCategorie) {
        throw new NotFoundException(`Categorie with ID ${id} not found`);
      }

      // Verificar si el nuevo nombre ya está siendo utilizado por otra categoría
      const categoriaConMismoNombre = await this.prisma.tb_categorias.findFirst({
        where: {
          nombre_cat: normalizedNombreCat,
          id_categoria: {
            not: id, // Ignorar el registro actual
          },
        },
      });

      if (categoriaConMismoNombre) {
        throw new BadRequestException(
          `Ya existe una categoría con el nombre "${nombre_cat.trim()}"`,
        );
      }

      // Realizar la actualización
      const updatedCategorie = await this.prisma.tb_categorias.update({
        where: { id_categoria: id },
        data: {
          ...updateCategorieDto,
        },
      });

      return updatedCategorie;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const categorie = await this.prisma.tb_categorias.findUnique({
        where: { id_categoria: id },
      });

      if (!categorie) {
        throw new NotFoundException(`Categorie with ID ${id} not found`);
      }

      await this.prisma.tb_categorias.delete({
        where: { id_categoria: id },
      });

      return { message: `Categorie with ID ${id} has been deleted` };
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
