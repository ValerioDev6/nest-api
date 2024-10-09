import { Injectable } from '@nestjs/common';
import { CreateTipoPersonaDto } from './dto/create-tipo-persona.dto';
import { UpdateTipoPersonaDto } from './dto/update-tipo-persona.dto';

@Injectable()
export class TipoPersonaService {
  create(createTipoPersonaDto: CreateTipoPersonaDto) {
    return 'This action adds a new tipoPersona';
  }

  findAll() {
    return `This action returns all tipoPersona`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoPersona`;
  }

  update(id: number, updateTipoPersonaDto: UpdateTipoPersonaDto) {
    return `This action updates a #${id} tipoPersona`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoPersona`;
  }
}
