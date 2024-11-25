import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { RequestVentaDto } from './dto/create-venta.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  create(@Body() createVentaDto: RequestVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  findAll(@Query() pagiantionDto: PaginationDto) {
    return this.ventasService.findAll(pagiantionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventasService.remove(+id);
  }

  @Get(':id/detalles')
  findDetallesByCompraId(@Param('id') id: string, @Query() paginationDto: PaginationDto) {
    return this.ventasService.findDetallesByVentaId(id, paginationDto);
  }
}
