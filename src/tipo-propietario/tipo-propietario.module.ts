import { Module } from '@nestjs/common';
import { TipoPropietarioService } from './tipo-propietario.service';
import { TipoPropietarioController } from './tipo-propietario.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TipoPropietarioController],
  imports: [PrismaModule, AuthModule],
  providers: [TipoPropietarioService],
})
export class TipoPropietarioModule {}
