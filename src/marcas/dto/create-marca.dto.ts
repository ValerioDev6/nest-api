import { tb_marcas } from '@prisma/client';

export type CreateMarcaDto = Omit<tb_marcas, 'id_marca'>;
