import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { RequestCompraDto } from './dto/create-compra.dto';

@Injectable()
export class ComprasService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('ComprasService');

  async create(requestCompra: RequestCompraDto) {
    this.logger.log('Iniciando registro de compra', { data: requestCompra });

    return this.prisma.$transaction(async (prisma) => {
      try {
        // Verificar que vengan productos
        if (!requestCompra.detalles?.length) {
          throw new BadRequestException('La compra debe tener productos');
        }

        // Calcular totales desde los productos
        const subtotal = requestCompra.detalles.reduce(
          (sum, detalle) => sum + detalle.cantidad * Number(detalle.precio_unitario),
          0,
        );

        const igv = subtotal * 0.18;
        const total = subtotal + igv;

        // Crear la compra principal
        const compra = await prisma.tb_compra.create({
          data: {
            proveedor_id: requestCompra.proveedor_id,
            proveedor_ruc: requestCompra.proveedor_ruc,
            proveedor_correo: requestCompra.proveedor_correo,
            id_metodo_pago: requestCompra.id_metodo_pago,
            numero_documento: requestCompra.numero_documento,
            compra_subtotal: subtotal,
            compra_igv: igv,
            compra_total: total,
            compra_comentario: requestCompra.compra_comentario,
          },
        });

        this.logger.log('Compra principal creada', { id_compra: compra.id_compra });

        // Crear los detalles de la compra
        const detallesPromises = requestCompra.detalles.map((detalle) =>
          prisma.tb_detalle_compra.create({
            data: {
              id_compra: compra.id_compra,
              id_producto: detalle.id_producto,
              id_categoria: detalle.id_categoria,
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario,
              subtotal: detalle.cantidad * Number(detalle.precio_unitario),
            },
          }),
        );

        const detallesCreados = await Promise.all(detallesPromises);

        this.logger.log('Detalles de compra creados', {
          id_compra: compra.id_compra,
          total_detalles: detallesCreados.length,
        });

        return {
          message: 'Compra registrada con éxito',
          compra: {
            ...compra,
            detalles: detallesCreados,
          },
        };
      } catch (error) {
        this.logger.error('Error al registrar compra', {
          error: error.message,
          stack: error.stack,
        });

        if (error instanceof BadRequestException) {
          throw error;
        }

        throw new InternalServerErrorException('Error al registrar la compra: ' + error.message);
      }
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5, search = '' } = paginationDto;

    const whereCondition = search
      ? {
          OR: [
            {
              tb_proveedores: {
                OR: [
                  { razon_social: { contains: search } },
                  { nombre_comercial: { contains: search } },
                  {
                    tb_personas: {
                      OR: [
                        { nombres: { contains: search } },
                        { apellido_paterno: { contains: search } },
                        { apellido_materno: { contains: search } },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        }
      : {};

    try {
      const [compras, total] = await Promise.all([
        this.prisma.tb_compra.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            fecha_compra: 'desc',
          },
          where: whereCondition,
          include: {
            tb_proveedores: {
              include: {
                tb_personas: true,
              },
            },
            tb_metodo_pago: true,
          },
        }),
        this.prisma.tb_compra.count({
          where: whereCondition,
        }),
      ]);

      return {
        info: {
          page,
          limit,
          total,
          next:
            page * limit < total
              ? `${process.env.HOST_API}/compras?page=${page + 1}&limit=${limit}&search=${search}`
              : null,
          prev:
            page > 1
              ? `${process.env.HOST_API}/compras?page=${page - 1}&limit=${limit}&search=${search}`
              : null,
        },
        compras,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    const compra = await this.prisma.tb_compra.findUnique({
      where: { id_compra: id },
      include: {
        tb_detalle_compra: {
          include: {
            tb_productos: true,
            tb_categorias: true,
          },
        },
        tb_proveedores: {
          include: {
            tb_personas: true,
          },
        },
        tb_metodo_pago: true,
      },
    });

    if (!compra) {
      throw new NotFoundException(`Compra con ID ${id} no encontrada`);
    }

    return {
      id_compra: compra.id_compra,
      numero_documento: compra.numero_documento,
      fecha_compra: compra.fecha_compra,
      proveedor: {
        id: compra.tb_proveedores?.id_proveedor,
        nombre: compra.tb_proveedores?.tb_personas?.nombres,
        ruc: compra.proveedor_ruc,
        correo: compra.proveedor_correo,
      },
      metodo_pago: compra.tb_metodo_pago?.nombre_metodo_pago,
      subtotal: compra.compra_subtotal,
      igv: compra.compra_igv,
      total: compra.compra_total,
      comentario: compra.compra_comentario,
      detalles: compra.tb_detalle_compra.map((detalle) => ({
        id_detalle: detalle.id_detalle_compra,
        producto: {
          id: detalle.tb_productos?.id_producto,
          nombre: detalle.tb_productos?.nombre_producto,
          codigo: detalle.tb_productos?.codigo_producto,
        },
        categoria: {
          id: detalle.tb_categorias?.id_categoria,
          nombre: detalle.tb_categorias?.nombre_cat,
        },
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.subtotal,
      })),
    };
  }

  async findDetallesByCompraId(id: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 5 } = paginationDto;

    try {
      // Primero verificamos si la compra existe
      const compraExists = await this.prisma.tb_compra.findUnique({
        where: { id_compra: id },
        select: { id_compra: true },
      });

      if (!compraExists) {
        throw new NotFoundException(`Compra con ID ${id} no encontrada`);
      }

      // Obtenemos los detalles paginados
      const [detalles, total] = await Promise.all([
        this.prisma.tb_detalle_compra.findMany({
          where: {
            id_compra: id,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            tb_productos: true,
            tb_categorias: true,
          },
          orderBy: {
            id_detalle_compra: 'asc',
          },
        }),
        this.prisma.tb_detalle_compra.count({
          where: {
            id_compra: id,
          },
        }),
      ]);

      // Calculamos el monto subtotal de los detalles
      const montoSubtotal = detalles.reduce(
        (sum, detalle) => sum + detalle.cantidad * Number(detalle.precio_unitario),
        0,
      );

      // Calculamos el IGV (18%)
      const montoIGV = montoSubtotal * 0.18;

      // Calculamos el monto total
      const montoTotal = montoSubtotal + montoIGV;

      return {
        info: {
          page,
          limit,
          total,
          next: `${process.env.HOST_API}/compras/${id}/detalle?page=${page + 1}&limit=${limit}`,
          prev:
            page > 1
              ? `${process.env.HOST_API}/compras/${id}/detalle?page=${page - 1}&limit=${limit}`
              : null,
        },
        detalles,
        resumen: {
          cantidad_items: total,
          monto_subtotal: montoSubtotal,
          monto_igv: montoIGV,
          monto_total: montoTotal,
        },
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const compra = await this.prisma.tb_compra.findUnique({
        where: { id_compra: id },
        include: { tb_detalle_compra: true },
      });

      if (!compra) {
        throw new NotFoundException(`Compra with ID ${id} not found`);
      }

      await this.prisma.tb_detalle_compra.deleteMany({
        where: { id_compra: id },
      });

      await this.prisma.tb_compra.delete({
        where: { id_compra: id },
      });

      return { message: `Compra with ID ${id} and its related details have been deleted` };
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
