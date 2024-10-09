import { tb_sexo } from '@prisma/client';
export type CreateSexoDto = Omit<tb_sexo, 'id_sexo'>;
