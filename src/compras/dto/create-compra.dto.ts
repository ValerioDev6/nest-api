/* eslint-disable @typescript-eslint/no-unused-vars */
import { tb_compra, tb_detalle_compra } from '@prisma/client';

// DTOs simplificados
export type CreateCompraDto = Omit<tb_compra, 'id_compra'>;
export type CreateDetalleCompraDto = Omit<tb_detalle_compra, 'id_detalle_compra' | 'id_compra'>;

// Interface para el request completo
export interface RequestCompraDto extends CreateCompraDto {
  detalles: CreateDetalleCompraDto[];
}
