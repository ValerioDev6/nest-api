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
        select: {
          id_compra: true,
          fecha_compra: true,
          numero_documento: true,
          compra_subtotal: true,
          compra_igv: true,
          compra_total: true,
          compra_comentario: true,

          tb_proveedores: {
            select: {
              tb_personas: {
                select: {
                  nombres: true,
                  razon_social: true,
                },
              },
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
              cantidad: true,
              precio_unitario: true,
              subtotal: true,

              tb_productos: {
                select: {
                  nombre_producto: true,
                  codigo_producto: true,
                  precio_compra: true,
                  precio_venta: true,
                },
              },
            },
          },
        },
      });

      if (!compra) {
        throw new NotFoundException('Compra no encontrada');
      }

      const docDefinition = getCompraDetalleReport({
        compra,
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
