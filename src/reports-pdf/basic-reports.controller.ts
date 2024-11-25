import { Controller, Get, Res } from '@nestjs/common';
import { BasicReportsService } from './basic-reports.service';
import { Response } from 'express';

@Controller('reports-pdf')
export class BasicReportsController {
  constructor(private readonly basicReportsService: BasicReportsService) {}

  @Get('marcas')
  async getMarcas(@Res() response: Response) {
    const pdfDoc = await this.basicReportsService.getMarcasReportPdf();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Marcas Reportes';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('productos')
  async getProductos(@Res() response: Response) {
    const pdfDoc = await this.basicReportsService.getProductosReportPdf();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Productos Reportes';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('categorias')
  async getCategorias(@Res() response: Response) {
    const pdfDoc = await this.basicReportsService.getCategoriasReportPdfData();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Categorias Reportes';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
