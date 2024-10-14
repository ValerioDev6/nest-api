import { tb_proveedores } from '@prisma/client';

export type CreateProveedoreDto = Omit<tb_proveedores, 'id_proovedor'>;
