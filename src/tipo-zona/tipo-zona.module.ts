import { Module } from '@nestjs/common';
import { TipoZonaService } from './tipo-zona.service';
import { TipoZonaController } from './tipo-zona.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TipoZonaController],
  imports: [PrismaModule, AuthModule],
  providers: [TipoZonaService],
})
export class TipoZonaModule {}
