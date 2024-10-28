import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PersonaService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('PersonaService');

  async create(createPersonaDto: CreatePersonaDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const newPersona = await prisma.tb_personas.create({
          data: {
            ...createPersonaDto,
          },
          include: {
            tb_sexo: true,
            tb_direccion: true,
            tb_tipo_persona: true,
            tb_tipo_documento: true,
            tb_tipo_telefono: true,
            tb_pais: true,
          },
        });

        return newPersona;
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  findAll() {
    return `This action returns all persona`;
  }

  // Obtener personas por tipo para combos/selects
  async getPersonasByTipo(tipoPersona: string) {
    try {
      const personas = await this.prisma.tb_personas.findMany({
        where: {
          id_tipo_persona: tipoPersona,
        },
        select: {
          id_persona: true,
          nombres: true,
          apellido_paterno: true,
          apellido_materno: true,
        },
      });

      return personas.map((persona) => ({
        id_persona: persona.id_persona,
        nombre_completo:
          `${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno}`.trim(),
      }));
    } catch (error) {
      throw new Error(`Error al obtener personas: ${error.message}`);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} persona`;
  }

  update(id: number, updatePersonaDto: UpdatePersonaDto) {
    return `This action updates a #${id} persona`;
  }

  remove(id: number) {
    return `This action removes a #${id} persona`;
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

  static readonly TIPO_PERSONA = {
    PERSONAL: 'df091edc-83c7-11ef-8655-00e04cf010f7', // Reemplazar con el UUID real
    CLIENTE: 'df09389f-83c7-11ef-8655-00e04cf010f7', // Reemplazar con el UUID real
    PROVEEDOR: 'df093a97-83c7-11ef-8655-00e04cf010f7', // Reemplazar con el UUID real
  };
}
