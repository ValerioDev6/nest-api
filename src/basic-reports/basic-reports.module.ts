import { Module } from '@nestjs/common';
import { BasicReportsService } from './basic-reports.service';
import { BasicReportsController } from './basic-reports.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prima.module';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  controllers: [BasicReportsController],
  imports: [PrismaModule, AuthModule, PrinterModule],
  providers: [BasicReportsService],
})
export class BasicReportsModule {}
