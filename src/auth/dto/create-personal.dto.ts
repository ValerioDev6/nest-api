import { tb_personal } from '@prisma/client';
export type CreatePersonalDto = Omit<tb_personal, 'id_personal'>;
