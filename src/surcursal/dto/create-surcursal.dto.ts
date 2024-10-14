import { tb_sucursales } from '@prisma/client';
export type CreateSurcursalDto = Omit<tb_sucursales, 'id_sucursal'>;
