import { Controller, Get, Post, Body, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { RequestVentaDto } from './dto/create-venta.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interfaces';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { tb_cliente, tb_personal } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
@Auth()
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  // @Post()
  // create(@Body() createVentaDto: RequestVentaDto) {
  //   return this.ventasService.create(createVentaDto);
  // }

  @Post()
  create(@Body() createVentaDto: RequestVentaDto, @GetUser() user: tb_personal) {
    return this.ventasService.create(createVentaDto, user);
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
