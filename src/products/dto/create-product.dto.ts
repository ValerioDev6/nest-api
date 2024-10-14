import { tb_productos } from '@prisma/client';

export type CreateProductDto = Omit<tb_productos, 'id_producto' | 'fecha_creacion' | 'updated_at'>;
