import { Module } from '@nestjs/common';
import { SurcursalService } from './surcursal.service';
import { SurcursalController } from './surcursal.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SurcursalController],
  imports: [PrismaModule, AuthModule],
  providers: [SurcursalService],
})
export class SurcursalModule {}
