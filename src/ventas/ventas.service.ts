import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RequestVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, tb_personal } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interfaces';

@Injectable()
export class VentasService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('VentasService');

  // async create(requestVenta: RequestVentaDto, personal: tb_personal) {
  //   this.logger.log('Iniciando registro de venta', { data: requestVenta });

  //   return await this.prisma.$transaction(async (prisma) => {
  //     try {
  //       // Validar que vengan productos
  //       if (!requestVenta.detalles?.length) {
  //         throw new BadRequestException('La venta debe tener productos');
  //       }

  //       // Calcular totales desde los productos
  //       const subtotal = requestVenta.detalles.reduce(
  //         (sum, detalle) => sum + detalle.cantidad * Number(detalle.precio_unitario),
  //         0,
  //       );

  //       // Calcular impuesto (IGV)
  //       const impuesto = subtotal * 0.18; // IGV del 18%
  //       const precio_total = subtotal + impuesto;

  //       // Crear la venta principal usando el ID del personal desde el token
  //       const venta = await prisma.tb_ventas.create({
  //         data: {
  //           ...requestVenta,
  //           id_personal: personal.id, // Usar el ID del personal desde el token
  //           subtotal,
  //           impuesto,
  //           precio_total,
  //           estado_venta: requestVenta.estado_venta || 'COMPLETADA',
  //         },
  //       });

  //       this.logger.log('Venta principal creada', { id_venta: venta.id_venta });

  //       // Crear los detalles de la venta
  //       const detallesPromises = requestVenta.detalles.map((detalle) =>
  //         prisma.tb_detalle_venta.create({
  //           data: {
  //             id_venta: venta.id_venta,
  //             id_producto: detalle.id_producto,
  //             cantidad: detalle.cantidad,
  //             precio_unitario: detalle.precio_unitario,
  //             subtotal: detalle.cantidad * Number(detalle.precio_unitario),
  //             precio: detalle.precio,
  //             descuento: detalle.descuento || 0,
  //           },
  //         }),
  //       );

  //       const detallesCreados = await Promise.all(detallesPromises);

  //       this.logger.log('Detalles de venta creados', {
  //         id_venta: venta.id_venta,
  //         total_detalles: detallesCreados.length,
  //       });

  //       return {
  //         message: 'Venta registrada con éxito',
  //         venta: {
  //           ...venta,
  //           detalles: detallesCreados,
  //         },
  //       };
  //     } catch (error) {
  //       this.logger.error('Error al registrar venta', {
  //         error: error.message,
  //         stack: error.stack,
  //       });

  //       if (error instanceof BadRequestException) {
  //         throw error;
  //       }

  //       throw new InternalServerErrorException('Error al registrar la venta: ' + error.message);
  //     }
  //   });
  // }

  async create(requestVenta: RequestVentaDto, personal: tb_personal) {
    this.logger.log('Iniciando registro de venta', { data: requestVenta });

    return this.prisma.$transaction(async (prisma) => {
      try {
        // Validar que vengan productos
        if (!requestVenta.detalles?.length) {
          throw new BadRequestException('La venta debe tener productos');
        }

        // Calcular totales desde los productos
        const subtotal = requestVenta.detalles.reduce(
          (sum, detalle) => sum + detalle.cantidad * Number(detalle.precio_unitario),
          0,
        );

        const impuesto = subtotal * 0.18; // IGV del 18%
        const precio_total = subtotal + impuesto;

        // Crear la venta principal
        const venta = await prisma.tb_ventas.create({
          data: {
            id_personal: personal.id_personal,
            id_cliente: requestVenta.id_cliente || null,
            tipo_documento: requestVenta.tipo_documento || 'BOLETA',
            numero_documento: requestVenta.numero_documento,
            serie_documento: requestVenta.serie_documento,
            estado_venta: requestVenta.estado_venta || 'COMPLETADA',
            fecha_venta: requestVenta.fecha_venta,
            subtotal,
            impuesto,
            precio_total,
            observaciones: requestVenta.observaciones,
            id_metodo_pago: requestVenta.id_metodo_pago || null,
          } as Prisma.tb_ventasUncheckedCreateInput,
        });

        this.logger.log('Venta principal creada', { id_venta: venta.id_venta });

        // Crear los detalles de la venta
        const detallesPromises = requestVenta.detalles.map((detalle) =>
          prisma.tb_detalle_venta.create({
            data: {
              id_venta: venta.id_venta,
              id_producto: detalle.id_producto,
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario,
              subtotal: detalle.cantidad * Number(detalle.precio_unitario),
              descuento: detalle.descuento || 0,
            },
          }),
        );

        const detallesCreados = await Promise.all(detallesPromises);

        this.logger.log('Detalles de venta creados', {
          id_venta: venta.id_venta,
          total_detalles: detallesCreados.length,
        });

        return {
          message: 'Venta registrada con éxito',
          venta: {
            ...venta,
            detalles: detallesCreados,
          },
        };
      } catch (error) {
        this.logger.error('Error al registrar venta', {
          error: error.message,
          stack: error.stack,
        });

        if (error instanceof BadRequestException) {
          throw error;
        }

        throw new InternalServerErrorException('Error al registrar la venta: ' + error.message);
      }
    });
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

  async findOne(id: string) {
    const venta = await this.prisma.tb_ventas.findUnique({
      where: { id_venta: id },
      include: {
        tb_detalle_venta: {
          include: {
            tb_productos: true,
          },
        },
        tb_cliente: {
          include: {
            tb_personas: true,
          },
        },
        tb_metodo_pago: true,
        tb_sucursales: true,
        tb_personal: {
          include: {
            tb_personas: true,
            tb_rol: true,
          },
        },
      },
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return {
      id_venta: venta.id_venta,
      fecha_venta: venta.fecha_venta,
      numero_documento: venta.numero_documento,
      serie_documento: venta.serie_documento,
      tipo_documento: venta.tipo_documento,
      cliente: {
        id: venta.tb_cliente?.id_cliente,
        nombre: venta.tb_cliente?.tb_personas?.nombres,
      },
      metodo_pago: venta.tb_metodo_pago?.nombre_metodo_pago,
      sucursal: venta.tb_sucursales?.nombre_sucursal,
      personal: {
        id: venta.tb_personal?.id_personal,
        nombre:
          venta.tb_personal?.tb_personas?.nombres +
          ' ' +
          venta.tb_personal?.tb_personas?.apellido_paterno +
          ' ' +
          venta.tb_personal?.tb_personas?.apellido_materno,
        email: venta.tb_personal?.email,
        rol: venta.tb_personal?.tb_rol?.nombre_rol,
      },
      subtotal: venta.subtotal,
      impuesto: venta.impuesto,
      precio_total: venta.precio_total,
      estado_venta: venta.estado_venta,
      observaciones: venta.observaciones,
      detalles: venta.tb_detalle_venta.map((detalle) => ({
        id_detalle_venta: detalle.id_detalle_venta,
        producto: {
          id: detalle.tb_productos?.id_producto,
          nombre: detalle.tb_productos?.nombre_producto,
          codigo: detalle.tb_productos?.codigo_producto,
        },
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.subtotal,
        descuento: detalle.descuento,
      })),
    };
  }
  async findDetallesByVentaId(id: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 5 } = paginationDto;

    try {
      // Obtener los detalles paginados y el total
      const [detalles, total] = await Promise.all([
        this.prisma.tb_detalle_venta.findMany({
          where: {
            id_venta: id,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            tb_productos: true,
          },
          orderBy: {
            id_detalle_venta: 'asc',
          },
        }),
        this.prisma.tb_detalle_venta.count({
          where: {
            id_venta: id,
          },
        }),
      ]);

      // Obtener la venta para el resumen
      const venta = await this.prisma.tb_ventas.findUnique({
        where: { id_venta: id },
        select: {
          subtotal: true,
          impuesto: true,
          precio_total: true,
        },
      });

      return {
        info: {
          page,
          limit,
          total,
          next: `${process.env.HOST_API}/ventas/${id}/detalle?page=${page + 1}&limit=${limit}`,
          prev:
            page > 1
              ? `${process.env.HOST_API}/ventas/${id}/detalle?page=${page - 1}&limit=${limit}`
              : null,
        },
        detalles,
        resumen: {
          cantidad_items: total,
          subtotal: venta.subtotal.toString(),
          monto_total: venta.subtotal.toString(),
          igv: venta.impuesto?.toString(),
          precio_total: venta.precio_total?.toString(),
        },
      };
    } catch (error) {
      this.handleExceptions(error);
    }
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
