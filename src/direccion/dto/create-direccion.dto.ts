import { tb_direccion } from '@prisma/client';
export type CreateDireccionDto = Omit<tb_direccion, 'id_direccion'>;
