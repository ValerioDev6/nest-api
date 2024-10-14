import { Controller, Get } from '@nestjs/common';
import { TipoDocumentoService } from './tipo-documento.service';

@Controller('tipo-documento')
export class TipoDocumentoController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {}

  @Get()
  findAll() {
    return this.tipoDocumentoService.findAll();
  }
}
