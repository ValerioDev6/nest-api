import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  controllers: [SalesController],
  imports: [PrismaModule, AuthModule, PrinterModule],
  providers: [SalesService],
})
export class SalesModule {}
