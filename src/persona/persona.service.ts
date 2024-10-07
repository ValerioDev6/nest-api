import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PersonaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPersonaDto: CreatePersonaDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const id_persona = uuidv4();

        const newPersona = await prisma.tb_personas.create({
          data: {
            id_persona,
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
      if (error.code === 'P2002') {
        throw new BadRequestException('Ya existe una persona con esos datos únicos');
      }
      throw new InternalServerErrorException('Error al crear la persona');
    }
  }
  findAll() {
    return `This action returns all persona`;
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
}
