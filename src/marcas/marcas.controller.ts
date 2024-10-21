import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Post()
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcasService.create(createMarcaDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.marcasService.findAll(paginationDto);
  }

  @Get('combo')
  findAllMarcasComboBox() {
    return this.marcasService.findComboBoxAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    return this.marcasService.update(id, updateMarcaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcasService.remove(id);
  }
}
