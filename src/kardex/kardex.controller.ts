import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { KardexService } from './kardex.service';
import { CreateKardexDto } from './dto/create-kardex.dto';
import { UpdateKardexDto } from './dto/update-kardex.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @Post()
  create(@Body() createKardexDto: CreateKardexDto) {
    return this.kardexService.create(createKardexDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.kardexService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kardexService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKardexDto: UpdateKardexDto) {
    return this.kardexService.update(+id, updateKardexDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kardexService.remove(+id);
  }
}
