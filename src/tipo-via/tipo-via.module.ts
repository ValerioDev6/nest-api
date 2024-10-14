import { Module } from '@nestjs/common';
import { TipoViaService } from './tipo-via.service';
import { TipoViaController } from './tipo-via.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TipoViaController],
  imports: [PrismaModule, AuthModule],
  providers: [TipoViaService],
})
export class TipoViaModule {}
