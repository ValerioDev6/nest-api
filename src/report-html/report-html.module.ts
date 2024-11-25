import { Module } from '@nestjs/common';
import { ReportHtmlService } from './report-html.service';
import { ReportHtmlController } from './report-html.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  controllers: [ReportHtmlController],
  imports: [PrismaModule, PrinterModule],
  providers: [ReportHtmlService],
})
export class ReportHtmlModule {}
