import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { PrismaService } from 'src/prisma/prisma.service';
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
        producto, // Ahora pasamos el producto directamente
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
}
