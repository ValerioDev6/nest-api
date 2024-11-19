import { Module } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ComprasController],
  imports: [PrismaModule, AuthModule],
  providers: [ComprasService],
})
export class ComprasModule {}
