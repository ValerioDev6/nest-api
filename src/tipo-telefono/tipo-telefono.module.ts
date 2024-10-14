import { Module } from '@nestjs/common';
import { TipoTelefonoService } from './tipo-telefono.service';
import { TipoTelefonoController } from './tipo-telefono.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TipoTelefonoController],
  imports: [PrismaModule, AuthModule],
  providers: [TipoTelefonoService],
})
export class TipoTelefonoModule {}
