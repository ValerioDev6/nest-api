import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TelefonoPersonalService } from './telefono-personal.service';
import { CreateTelefonoPersonalDto } from './dto/create-telefono-personal.dto';
import { UpdateTelefonoPersonalDto } from './dto/update-telefono-personal.dto';

@Controller('telefono-personal')
export class TelefonoPersonalController {
  constructor(private readonly telefonoPersonalService: TelefonoPersonalService) {}

  @Post()
  create(@Body() createTelefonoPersonalDto: CreateTelefonoPersonalDto) {
    return this.telefonoPersonalService.create(createTelefonoPersonalDto);
  }

  @Get()
  findAll() {
    return this.telefonoPersonalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.telefonoPersonalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTelefonoPersonalDto: UpdateTelefonoPersonalDto) {
    return this.telefonoPersonalService.update(+id, updateTelefonoPersonalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.telefonoPersonalService.remove(+id);
  }
}
