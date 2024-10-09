import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoPersonaService } from './tipo-persona.service';
import { CreateTipoPersonaDto } from './dto/create-tipo-persona.dto';
import { UpdateTipoPersonaDto } from './dto/update-tipo-persona.dto';

@Controller('tipo-persona')
export class TipoPersonaController {
  constructor(private readonly tipoPersonaService: TipoPersonaService) {}

  @Post()
  create(@Body() createTipoPersonaDto: CreateTipoPersonaDto) {
    return this.tipoPersonaService.create(createTipoPersonaDto);
  }

  @Get()
  findAll() {
    return this.tipoPersonaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoPersonaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoPersonaDto: UpdateTipoPersonaDto) {
    return this.tipoPersonaService.update(+id, updateTipoPersonaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoPersonaService.remove(+id);
  }
}
