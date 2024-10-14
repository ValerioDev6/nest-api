import { Module } from '@nestjs/common';
import { DireccionService } from './direccion.service';
import { DireccionController } from './direccion.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DireccionController],
  imports: [PrismaModule, AuthModule],
  providers: [DireccionService],
})
export class DireccionModule {}
