import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MetodoPagosService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('MetodoPagosService');
  create(createMetodoPagoDto: CreateMetodoPagoDto) {
    return 'This action adds a new metodoPago';
  }

  async findAll() {
    try {
      const metodoPagos = await this.prisma.tb_metodo_pago.findMany({
        orderBy: {
          nombre_metodo_pago: 'asc',
        },
      });

      return metodoPagos;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} metodoPago`;
  }

  update(id: number, updateMetodoPagoDto: UpdateMetodoPagoDto) {
    return `This action updates a #${id} metodoPago`;
  }

  remove(id: number) {
    return `This action removes a #${id} metodoPago`;
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new BadRequestException('Ya existe un registro con esos datos únicos');
        case 'P2014':
          throw new BadRequestException('El registro viola una restricción de relación');
        case 'P2003':
          throw new BadRequestException('El registro viola una restricción de clave foránea');
        case 'P2025':
          throw new NotFoundException('No se encontró el registro para actualizar o eliminar');
      }
    }

    if (error instanceof NotFoundException) {
      throw error;
    }

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado. Por favor, contacte al administrador.',
    );
  }
}
