import { Module } from '@nestjs/common';
import { TipoPersonaService } from './tipo-persona.service';
import { TipoPersonaController } from './tipo-persona.controller';

@Module({
  controllers: [TipoPersonaController],
  providers: [TipoPersonaService],
})
export class TipoPersonaModule {}
