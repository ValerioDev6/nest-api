import { Controller, Get } from '@nestjs/common';
import { TelefonoPersonalService } from './telefono-personal.service';

@Controller('telefono-personal')
export class TelefonoPersonalController {
  constructor(private readonly telefonoPersonalService: TelefonoPersonalService) {}

  @Get()
  findAll() {
    return this.telefonoPersonalService.findAll();
  }
}
