import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prima.module';

@Module({
  controllers: [VentasController],
  imports: [AuthModule, PrismaModule],
  providers: [VentasService],
})
export class VentasModule {}
