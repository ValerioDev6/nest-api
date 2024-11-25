import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { RequestCompraDto } from './dto/create-compra.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  create(@Body() createCompraDto: RequestCompraDto) {
    return this.comprasService.create(createCompraDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.comprasService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comprasService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comprasService.remove(id);
  }

  @Get(':id/detalles')
  findDetallesByCompraId(@Param('id') id: string, @Query() paginationDto: PaginationDto) {
    return this.comprasService.findDetallesByCompraId(id, paginationDto);
  }
}
