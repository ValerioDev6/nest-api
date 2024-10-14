import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prima.module';
import { TipoDocumentoController } from './tipo-documento.controller';
import { TipoDocumentoService } from './tipo-documento.service';

@Module({
  controllers: [TipoDocumentoController],
  imports: [PrismaModule, AuthModule],
  providers: [TipoDocumentoService],
})
export class TipoDocumentoModule {}
