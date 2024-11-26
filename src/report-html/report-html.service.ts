import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { getCompraDetalleReport } from 'src/reports/html/compras_by_id_report';
import { getProductoDetalleReport } from 'src/reports/html/producto_detalles_report';
import { getProductosReport } from 'src/reports/pdf/productos.report';
@Injectable()
export class ReportHtmlService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly printerService: PrinterService,
  ) {}
  async getProductoReportPdfById(id: string) {
    try {
      const producto = await this.prisma.tb_productos.findUnique({
        where: {
          id_producto: id,
        },
        select: {
          nombre_producto: true,
          descripcion: true,
          codigo_producto: true,
          stock: true,
          precio_compra: true,
          precio_venta: true,
          fecha_ingreso: true,
          estado_produto: true,
          tb_categorias: {
            select: {
              nombre_cat: true,
            },
          },
          tb_marcas: {
            select: {
              nombre_marca: true,
            },
          },
          tb_sucursales: {
            select: {
              nombre_sucursal: true,
            },
          },
          tb_tipo_propietario: {
            select: {
              descripcion: true,
            },
          },
        },
      });

      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }

      const docDefinition = getProductoDetalleReport({
        producto,
        title: 'DETALLE DE PRODUCTO',
        subTitle: `Producto: ${producto.nombre_producto}`,
      });

      return this.printerService.createPdf(docDefinition);
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al generar el reporte PDF');
    }
  }

  async getCompraReportPdfById(id: string) {
    try {
      const compra = await this.prisma.tb_compra.findUnique({
        where: {
          id_compra: id,
        },
        include: {
          tb_proveedores: {
            select: {
              nombre_comercial: true,
            },
          },
          tb_metodo_pago: {
            select: {
              nombre_metodo_pago: true,
            },
          },
          tb_detalle_compra: {
            select: {
              id_detalle_compra: true,
              tb_productos: {
                select: {
                  nombre_producto: true,
                  codigo_producto: true,
                  precio_compra: true,
                  precio_venta: true,
                },
              },
              cantidad: true,
              precio_unitario: true,
              subtotal: true,
            },
          },
        },
      });

      if (!compra) {
        throw new NotFoundException('Compra no encontrada');
      }

      const docDefinition = getCompraDetalleReport({
        compra: {
          id_compra: compra.id_compra,
          fecha_compra: compra.fecha_compra,
          total_compra: compra.compra_total,
          tb_proveedores: {
            nombre_comercial: compra.tb_proveedores.nombre_comercial,
          },
          tb_metodo_pago: {
            nombre_metodo_pago: compra.tb_metodo_pago.nombre_metodo_pago,
          },
          tb_detalle_compra: compra.tb_detalle_compra,
        },
        title: 'DETALLE DE COMPRA',
        subTitle: `Compra: ${compra.id_compra}`,
      });

      return this.printerService.createPdf(docDefinition);
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al generar el reporte PDF');
    }
  }
}
