import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { getHelloWordReport, getMarcasReport } from 'src/reports/pdf';
import { getProductosReport } from 'src/reports/pdf/productos.report';
import { getCategoriasReport } from '../reports/pdf/categorias.report';

@Injectable()
export class BasicReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly printerService: PrinterService,
  ) {}

  hello() {
    const docDefinition = getHelloWordReport({
      name: 'Valerio',
    });
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }

  async getMarcasReportPdf() {
    try {
      const marcas = await this.prisma.tb_marcas.findMany({
        select: {
          id_marca: true,
          nombre_marca: true,
          estado: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          nombre_marca: 'asc',
        },
      });

      const docDefinition = getMarcasReport({ marcas });
      return this.printerService.createPdf(docDefinition);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  async getProductosReportPdf() {
    try {
      const productos = await this.prisma.tb_productos.findMany({
        select: {
          nombre_producto: true,
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
        orderBy: {
          nombre_producto: 'asc',
        },
      });

      const docDefinition = getProductosReport({ productos });
      return this.printerService.createPdf(docDefinition);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  async getCategoriasReportPdfData() {
    try {
      const categorias = await this.prisma.tb_categorias.findMany({
        select: {
          id_categoria: true,
          nombre_cat: true,
          estado: true,
          created_at: true,
          updated_at: true,
        },
      });

      const docDefinition = getCategoriasReport({ categorias });
      return this.printerService.createPdf(docDefinition);
    } catch {
      throw new Error('Failed to generate PDF report');
    }
  }
}
