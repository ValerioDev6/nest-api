import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [InventarioController],
  imports: [PrismaModule, AuthModule],
  providers: [InventarioService],
})
export class InventarioModule {}
