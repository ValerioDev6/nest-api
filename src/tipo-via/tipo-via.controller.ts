import { Controller, Get } from '@nestjs/common';
import { TipoViaService } from './tipo-via.service';

@Controller('tipo-via')
export class TipoViaController {
  constructor(private readonly tipoViaService: TipoViaService) {}

  @Get()
  findAll() {
    return this.tipoViaService.findAll();
  }
}
