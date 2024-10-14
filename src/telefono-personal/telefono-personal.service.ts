import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTelefonoPersonalDto } from './dto/create-telefono-personal.dto';

@Injectable()
export class TelefonoPersonalService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('TipoZonaService');
  create(createTelefonoPersonalDto: CreateTelefonoPersonalDto) {
    return 'This action adds a new telefonoPersonal';
  }

  findAll() {
    return `This action returns all telefonoPersonal`;
  }
}
