import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('ProductosService');

  async create(createProductDto: CreateProductDto) {
    try {
      const {
        nombre_producto,
        descripcion,
        stock,
        is_active,
        precio_compra,
        precio_venta,
        id_marca,
        id_categoria,
        id_sucursal,
        producto_img,
        codigo_producto,
        fecha_ingreso,
        id_tipo_propietario,
        estado_produto,
      } = createProductDto;

      const newProduct = await this.prisma.tb_productos.create({
        data: {
          nombre_producto,
          descripcion,
          stock,
          is_active,
          precio_compra,
          precio_venta,
          producto_img,
          fecha_ingreso,
          codigo_producto,
          estado_produto,

          tb_marcas: {
            connect: { id_marca },
          },
          tb_categorias: {
            connect: { id_categoria },
          },

          tb_sucursales: {
            connect: { id_sucursal },
          },
          tb_tipo_propietario: {
            connect: { id_tipo_propietario },
          },
        },
      });

      return newProduct;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5, search = '' } = paginationDto;

    try {
      const [productos, total] = await Promise.all([
        this.prisma.tb_productos.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { nombre_producto: 'asc' },
          include: {
            tb_marcas: {
              select: { nombre_marca: true },
            },
            tb_categorias: {
              select: { nombre_cat: true },
            },
            tb_tipo_propietario: {
              select: { descripcion: true },
            },
            tb_sucursales: {
              select: { nombre_sucursal: true },
            },
          },
          where: {
            OR: [{ nombre_producto: { contains: search } }],
          },
        }),
        this.prisma.tb_productos.count({
          where: {
            OR: [
              {
                nombre_producto: { contains: search },
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
        productos,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAllCombo() {
    try {
      const productos = await this.prisma.tb_productos.findMany({
        orderBy: {
          nombre_producto: 'asc',
        },
        select: {
          id_producto: true,
          nombre_producto: true,
          precio_venta: true,
          stock: true,
          tb_marcas: {
            select: {
              nombre_marca: true,
            },
          },
        },
      });
      return productos;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findOne(id: string) {
    try {
      const producto = await this.prisma.tb_productos.findUnique({
        where: { id_producto: id },
      });

      if (!producto) {
        throw new NotFoundException(`Producto with ID ${id} not found`);
      }

      return producto;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const existingProducto = await this.prisma.tb_productos.findUnique({
        where: { id_producto: id },
      });

      if (!existingProducto) {
        throw new NotFoundException(`Producto with ID ${id} not found`);
      }

      const updateProducto = await this.prisma.tb_productos.update({
        where: { id_producto: id },
        data: { ...updateProductDto },
      });

      return updateProducto;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const producto = await this.prisma.tb_productos.findUnique({
        where: { id_producto: id },
      });

      if (!producto) {
        throw new NotFoundException(`Producto with  ID ${id} not found`);
      }

      await this.prisma.tb_productos.delete({
        where: { id_producto: id },
      });

      return { message: `Producto with ID ${id} has been deleted` };
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
