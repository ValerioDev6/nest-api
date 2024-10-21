import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateSurcursalDto } from './dto/create-surcursal.dto';
import { UpdateSurcursalDto } from './dto/update-surcursal.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { SurcursalService } from './surcursal.service';

@Controller('surcursal')
export class SurcursalController {
  constructor(private readonly surcursalService: SurcursalService) {}

  @Post()
  create(@Body() createSurcursalDto: CreateSurcursalDto) {
    return this.surcursalService.create(createSurcursalDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.surcursalService.findAll(paginationDto);
  }

  @Get('combo')
  findAllSucursalesComboBox() {
    return this.surcursalService.findAllSucursalComboBox();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surcursalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurcursalDto: UpdateSurcursalDto) {
    return this.surcursalService.update(id, updateSurcursalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surcursalService.remove(id);
  }
}
