import { Module } from '@nestjs/common';
import { KardexService } from './kardex.service';
import { KardexController } from './kardex.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [KardexController],
  imports: [AuthModule, PrismaModule],
  providers: [KardexService],
})
export class KardexModule {}
