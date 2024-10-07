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
import * as bcrypt from 'bcrypt';

@Injectable()
export class PersonalService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('PersonalService');

  async create(createPersonalDto: CreatePersonalDto) {
    const { id_persona, contrasenia, ...restPersonalData } = createPersonalDto;

    try {
      // Usamos una transacción para asegurar la integridad de los datos
      return await this.prisma.$transaction(async (prisma) => {
        // Verificamos si la persona existe
        const persona = await prisma.tb_personas.findUnique({
          where: { id_persona },
        });

        if (!persona) {
          throw new BadRequestException('La persona asociada no existe');
        }

        // Encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(contrasenia, 10);

        // Creamos el personal
        const newPersonal = await prisma.tb_personal.create({
          data: {
            ...restPersonalData,
            id_persona,
            contrasenia: hashedPassword,
          },
          include: {
            tb_personas: true,
            tb_rol: true,
          },
        });

        return newPersonal;
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Ya existe un personal con ese email');
      }
      throw new InternalServerErrorException('Error al crear el personal');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search = '' } = paginationDto;

    try {
      const [personal, total] = await Promise.all([
        this.prisma.tb_personal.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { email: 'asc' },
          where: {
            tb_personas: {
              nombres: {
                contains: search,
              },
            },
          },
          include: {
            tb_personas: true,
            tb_rol: true,
          },
        }),
        this.prisma.tb_personal.count({
          where: {
            tb_personas: {
              nombres: {
                contains: search,
              },
            },
          },
        }),
      ]);

      return {
        info: {
          page,
          limit,
          total,
          next: `${process.env.HOST_API}/personal?page=${page + 1}&limit=${limit}&search=${search}`,
          prev:
            page > 1
              ? `${process.env.HOST_API}/personal?page=${page - 1}&limit=${limit}&search=${search}`
              : null,
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
          tb_personas: {
            include: {
              tb_pais: true,
              tb_tipo_telefono: true,
              tb_sexo: true,
              tb_direccion: true,
              tb_tipo_persona: true,
              tb_tipo_documento: true,
              tb_telefonos_persona: true,
            },
          },
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
