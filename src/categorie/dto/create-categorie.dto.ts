import { tb_categorias } from '@prisma/client';
export type CreateCategorieDto = Omit<tb_categorias, 'id_categoria'>;
