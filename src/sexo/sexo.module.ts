import { Module } from '@nestjs/common';
import { SexoService } from './sexo.service';
import { SexoController } from './sexo.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SexoController],
  imports: [PrismaModule, AuthModule],
  providers: [SexoService],
})
export class SexoModule {}
