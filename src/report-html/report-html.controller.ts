import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportHtmlService } from './report-html.service';
import { Response } from 'express';

@Controller('report-html')
export class ReportHtmlController {
  constructor(private readonly reportHtmlService: ReportHtmlService) {}

  @Get('reporte/:id')
  async getProductoDetallePdf(@Param('id') id: string, @Res() response: Response) {
    const pdfDoc = await this.reportHtmlService.getProductoReportPdfById(id);

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Detalle de Producto Icases Store';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('compras/:id')
  async getCompraDetallePdf(@Param('id') id: string, @Res() response: Response) {
    const pdfDoc = await this.reportHtmlService.getCompraReportPdfById(id);

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Detalle de Compra Icases Store';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
