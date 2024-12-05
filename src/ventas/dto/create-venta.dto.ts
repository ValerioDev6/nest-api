import { tb_ventas, tb_detalle_venta } from '@prisma/client';

// DTO para crear venta (excluyendo id_venta generado automáticamente)
export type CreateVentaDto = Omit<tb_ventas, 'id_venta'>;
// DTO para crear detalle de venta (excluyendo ids generados automáticamente)
export type CreateDetalleVentaDto = Omit<tb_detalle_venta, 'id_detalle_venta' | 'id_venta'>;

// Interface para request completo de venta
export interface RequestVentaDto extends CreateVentaDto {
  detalles: CreateDetalleVentaDto[];
}
