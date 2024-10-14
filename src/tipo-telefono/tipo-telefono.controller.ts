import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoTelefonoService } from './tipo-telefono.service';
import { CreateTipoTelefonoDto } from './dto/create-tipo-telefono.dto';
import { UpdateTipoTelefonoDto } from './dto/update-tipo-telefono.dto';

@Controller('tipo-telefono')
export class TipoTelefonoController {
  constructor(private readonly tipoTelefonoService: TipoTelefonoService) {}

  @Post()
  create(@Body() createTipoTelefonoDto: CreateTipoTelefonoDto) {
    return this.tipoTelefonoService.create(createTipoTelefonoDto);
  }

  @Get()
  findAll() {
    return this.tipoTelefonoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoTelefonoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoTelefonoDto: UpdateTipoTelefonoDto) {
    return this.tipoTelefonoService.update(+id, updateTipoTelefonoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoTelefonoService.remove(+id);
  }
}
