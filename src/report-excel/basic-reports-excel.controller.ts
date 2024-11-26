import { Controller, Get, Res } from '@nestjs/common';
import { BasicReportsExcelService } from './basic-reports-excel.service';
import { Response } from 'express';

@Controller('reports-excel')
export class BasicReportsExcelController {
  constructor(private readonly basicReportsExcelService: BasicReportsExcelService) {}

  @Get('marcas')
  async getMarcasExcel(@Res() response: Response) {
    const workbook = await this.basicReportsExcelService.getMarcasReportExcel();

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader('Content-Disposition', 'attachment; filename=marcas-report.xlsx');

    await workbook.xlsx.write(response);
    response.end();
  }

  @Get('productos')
  async getProductosExcel(@Res() response: Response) {
    const workbook = await this.basicReportsExcelService.getProductosReportExcel();

    response.setHeader(
      'Content-Type',

      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    response.setHeader('Content-Disposition', 'attachment; filename=productos-report.xlsx');

    await workbook.xlsx.write(response);

    response.end();
  }

  @Get('categorias')
  async getCategoriasExcel(@Res() response: Response) {
    const workbook = await this.basicReportsExcelService.getCategegoriasExcelReportData();

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    response.setHeader('Content-Disposition', 'attachment; filename=categorias-report.xlsx');

    await workbook.xlsx.write(response);
    response.end();
  }

  @Get('compras')
  async getComprasExcel(@Res() response: Response) {
    const workbook = await this.basicReportsExcelService.getComprasReportExcel();

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    response.setHeader('Content-Disposition', 'attachment; filename=compras-report.xlsx');

    await workbook.xlsx.write(response);
    response.end();
  }
}
