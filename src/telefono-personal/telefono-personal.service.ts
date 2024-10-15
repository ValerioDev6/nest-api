import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TelefonoPersonalService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('TipoZonaService');

  findAll() {
    return `This action returns all telefonoPersonal`;
  }
}
