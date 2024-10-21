import { Controller, Get, Res } from '@nestjs/common';
import { BasicReportsExcelService } from './basic-reports-excel.service';
import { Response } from 'express';

@Controller('basic-reports-excel')
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
}
