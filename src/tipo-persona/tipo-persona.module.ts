import { Module } from '@nestjs/common';
import { TipoPersonaService } from './tipo-persona.service';
import { TipoPersonaController } from './tipo-persona.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TipoPersonaController],
  imports: [PrismaModule, AuthModule],
  providers: [TipoPersonaService],
})
export class TipoPersonaModule {}
