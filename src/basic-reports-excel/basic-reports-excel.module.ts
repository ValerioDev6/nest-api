import { Module } from '@nestjs/common';
import { BasicReportsExcelService } from './basic-reports-excel.service';
import { BasicReportsExcelController } from './basic-reports-excel.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [BasicReportsExcelController],
  imports: [PrismaModule, AuthModule],
  providers: [BasicReportsExcelService],
})
export class BasicReportsExcelModule {}
