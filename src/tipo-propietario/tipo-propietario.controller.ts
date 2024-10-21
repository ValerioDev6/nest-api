import { Controller, Get } from '@nestjs/common';
import { TipoPropietarioService } from './tipo-propietario.service';

@Controller('tipo-propietario')
export class TipoPropietarioController {
  constructor(private readonly tipoPropietarioService: TipoPropietarioService) {}

  @Get()
  findAll() {
    return this.tipoPropietarioService.findAll();
  }
}
