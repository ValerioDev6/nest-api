import { tb_ventas } from '@prisma/client';

export type CreateVentaDto = Omit<tb_ventas, 'id_venta'>;
