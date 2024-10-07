import { tb_personas } from '@prisma/client';
export type CreatePersonaDto = Omit<tb_personas, 'id_persona'>;
