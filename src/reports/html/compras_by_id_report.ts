import { Decimal } from '@prisma/client/runtime/library';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from '../pdf/sections/header.section';
import { footerSection } from '../pdf/sections/footer.section';

export const getCompraDetalleReport = (options: {
  compra: {
    id_compra: string;
    fecha_compra: Date;
    total_compra: Decimal;
    tb_proveedores: { nombre_comercial: string };
    tb_metodo_pago: { nombre_metodo_pago: string };
    tb_detalle_compra: {
      id_detalle_compra: string;
      tb_productos: {
        nombre_producto: string;
        codigo_producto: string;
        precio_compra: Decimal;
        precio_venta: Decimal;
      };
      cantidad: number;
      precio_unitario: Decimal;
      subtotal: Decimal;
    }[];
  };
  title?: string;
  subTitle?: string;
}): TDocumentDefinitions => {
  const { compra, title, subTitle } = options;

  return {
    pageOrientation: 'portrait',
    header: headerSection({
      title: title ?? 'DETALLE DE COMPRA',
      subtitle: subTitle ?? `Compra: ${compra.id_compra}`,
    }),
    footer: footerSection,
    pageMargins: [40, 80, 40, 50],
    content: [
      {
        layout: 'customLayout01',
        table: {
          headerRows: 1,
          widths: ['20%', '20%', '15%', '15%', '15%', '15%'],
          body: [
            [
              { text: 'Producto', style: { bold: true }, color: 'white' },
              { text: 'Código', style: { bold: true }, color: 'white' },
              { text: 'Cantidad', style: { bold: true }, color: 'white' },
              { text: 'P. Unitario', style: { bold: true }, color: 'white' },
              { text: 'Subtotal', style: { bold: true }, color: 'white' },
              { text: 'Proveedor', style: { bold: true }, color: 'white' },
            ],
            ...compra.tb_detalle_compra.map((detalle) => [
              { text: detalle.tb_productos.nombre_producto },
              { text: detalle.tb_productos.codigo_producto },
              { text: detalle.cantidad.toString(), alignment: 'center' },
              { text: `S/. ${detalle.precio_unitario.toFixed(2)}`, alignment: 'right' },
              { text: `S/. ${detalle.subtotal.toFixed(2)}`, alignment: 'right' },
              { text: compra.tb_proveedores.nombre_comercial },
            ]),
            [{ text: '', colSpan: 6, border: [false, false, false, false] }, {}, {}, {}, {}, {}],
            [
              { text: 'Total', colSpan: 4, alignment: 'right', bold: true },
              {},
              {},
              {},
              { text: `S/. ${compra.total_compra.toFixed(2)}`, alignment: 'right', bold: true },
              {},
            ],
          ],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', 'auto', '*'],
          body: [
            [
              { text: 'Fecha de Compra', bold: true, alignment: 'right' },
              {
                text: new Date(compra.fecha_compra).toLocaleDateString('es-PE'),
                alignment: 'center',
              },
              {
                text: `Método de Pago: ${compra.tb_metodo_pago.nombre_metodo_pago}`,
                alignment: 'right',
              },
            ],
          ],
        },
      },
    ],
    defaultStyle: {
      fontSize: 9,
    },
  };
};
