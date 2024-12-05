import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
// @Auth()
@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Post()
  create(@Body() createPersonalDto: CreatePersonalDto) {
    return this.personalService.create(createPersonalDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.personalService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personalService.findOne(id);
  }

  @Get(':id/detalle')
  findOneDetalle(@Param('id') id: string) {
    return this.personalService.findOneAll(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonalDto: UpdatePersonalDto) {
    return this.personalService.update(+id, updatePersonalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personalService.remove(id);
  }
}
