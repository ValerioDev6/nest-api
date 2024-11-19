import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetodoPagosService } from './metodo-pagos.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';

@Controller('metodo-pagos')
export class MetodoPagosController {
  constructor(private readonly metodoPagosService: MetodoPagosService) {}

  @Post()
  create(@Body() createMetodoPagoDto: CreateMetodoPagoDto) {
    return this.metodoPagosService.create(createMetodoPagoDto);
  }

  @Get()
  findAll() {
    return this.metodoPagosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodoPagosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetodoPagoDto: UpdateMetodoPagoDto) {
    return this.metodoPagosService.update(+id, updateMetodoPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodoPagosService.remove(+id);
  }
}
