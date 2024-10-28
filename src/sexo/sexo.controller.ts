import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SexoService } from './sexo.service';

@Controller('sexo')
export class SexoController {
  constructor(private readonly sexoService: SexoService) {}

  @Get()
  findAll(@Query() paginatioDto: PaginationDto) {
    return this.sexoService.findAll(paginatioDto);
  }

  @Get('combo')
  findAllGeneros() {
    return this.sexoService.findAllCombo();
  }
}
