import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('RolesService');

  async create(createRoleDto: CreateRoleDto) {
    try {
      const { nombre_rol, descripcion, estado } = createRoleDto;
      const newRole = await this.prisma.tb_rol.create({
        data: {
          nombre_rol,
          descripcion,
          estado,
        },
      });

      return newRole;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findAllCombo() {
    try {
      const roles = await this.prisma.tb_rol.findMany({
        orderBy: {
          nombre_rol: 'asc',
        },
      });
      return roles;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5, search = '' } = paginationDto;

    try {
      const [roles, total] = await Promise.all([
        this.prisma.tb_rol.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { nombre_rol: 'asc' },
          where: {
            OR: [{ nombre_rol: { contains: search } }, { descripcion: { contains: search } }],
          },
        }),
        this.prisma.tb_rol.count({
          where: {
            OR: [{ nombre_rol: { contains: search } }, { descripcion: { contains: search } }],
          },
        }),
      ]);

      return {
        info: {
          page,
          limit,
          total,
          next: `${process.env.HOST_API}/roles?page=${page + 1}&limit=${limit}&search=${search}`,
          prev:
            page > 1
              ? `${process.env.HOST_API}/roles?page=${page - 1}&limit=${limit}&search=${search}`
              : null,
        },
        roles,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const role = await this.prisma.tb_rol.findUnique({
        where: { id_rol: id },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      return role;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const existingRole = await this.prisma.tb_rol.findUnique({
        where: { id_rol: id },
      });

      if (!existingRole) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      const updatedRole = await this.prisma.tb_rol.update({
        where: { id_rol: id },
        data: { ...updateRoleDto },
      });

      return updatedRole;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const role = await this.prisma.tb_rol.findUnique({
        where: { id_rol: id },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      await this.prisma.tb_rol.delete({
        where: { id_rol: id },
      });

      return { message: `Role with ID ${id} has been deleted` };
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
