import { tb_cliente } from '@prisma/client';

export type CreateClienteDto = Omit<tb_cliente, 'id_cliente'>;
