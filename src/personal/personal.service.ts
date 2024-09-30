import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PersonalService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('PersonalService');

  async create(createPersonalDto: CreatePersonalDto) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    try {
      const [personal, total] = await Promise.all([
        this.prisma.tb_personal.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { email: 'asc' },
          include: {
            tb_personas: true,
            tb_rol: true,
          },
        }),
        this.prisma.tb_personal.count(),
      ]);

      return {
        info: {
          page,
          limit,
          total,
          next: `${process.env.HOST_API}/personal?page=${page + 1}&limit=${limit}`,
          prev:
            page > 1 ? `${process.env.HOST_API}/personal?page=${page - 1}&limit=${limit}` : null,
        },
        personal,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findOne(id: string) {
    try {
      const personal = await this.prisma.tb_personal.findUnique({
        where: { id_personal: id },
        include: {
          tb_personas: true,
          tb_rol: true,
        },
      });

      if (!personal) throw new NotFoundException(`Personal con ID ${id} no encontrado`);

      return personal;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  update(id: number, updatePersonalDto: UpdatePersonalDto) {
    return `This action updates a #${id} personal`;
  }

  async remove(id: string) {
    try {
      const personal = await this.findOne(id);
      await this.prisma.tb_personal.delete({
        where: { id_personal: id },
      });

      return { message: `Personal con ID ${id} eliminado correctamente` };
    } catch (error) {
      this.handleExceptions(error);
    }
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
