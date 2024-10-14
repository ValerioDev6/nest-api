import { Module } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MarcasController],
  imports: [PrismaModule, AuthModule],
  providers: [MarcasService],
})
export class MarcasModule {}
