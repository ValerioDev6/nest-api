import { Module } from '@nestjs/common';
import { MetodoPagosService } from './metodo-pagos.service';
import { MetodoPagosController } from './metodo-pagos.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prima.module';

@Module({
  controllers: [MetodoPagosController],
  imports: [AuthModule, PrismaModule],
  providers: [MetodoPagosService],
})
export class MetodoPagosModule {}
