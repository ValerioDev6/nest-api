import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { getHelloWordReport, getMarcasReport } from 'src/reports/pdf';
import { getProductosReport } from 'src/reports/pdf/productos.report';

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
        include: {
          tb_marcas: true,
          tb_categorias: true,
          tb_tipo_propietario: true,
          tb_sucursales: true
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
}
