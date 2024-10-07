import { tb_rol } from '@prisma/client';
export type CreateRoleDto = Omit<tb_rol, 'id_rol'>;
