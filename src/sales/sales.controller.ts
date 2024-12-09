import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  findAll() {
    return this.salesService.getTotales();
  }
  @Get('consulta-mes-semana')
  findAllMesSemanaMes() {
    return this.salesService.getVentasDiasSemanaMes();
  }

  @Get('consulta-mes')
  findAllMes() {
    return this.salesService.obtenerVentasMensuales();
  }

  @Get('consulta-compra-dias')
  findAllCompras() {
    return this.salesService.obtenerComprasDiezDias();
  }
}
