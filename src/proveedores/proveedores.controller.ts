import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { ProveedoresService } from './proveedores.service';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  create(@Body() createProveedoreDto: CreateProveedoreDto) {
    return this.proveedoresService.create(createProveedoreDto);
  }

  @Get('combo')
  findAllProveedoresCombo() {
    return this.proveedoresService.findAllComboBox();
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.proveedoresService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProveedoreDto: UpdateProveedoreDto) {
    return this.proveedoresService.update(id, updateProveedoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedoresService.remove(id);
  }
}
