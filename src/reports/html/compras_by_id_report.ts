import type { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CurrencyFormatter, DateFormatter } from 'src/helpers';
import { footerSection } from '../pdf/sections/footer.section';
import { Decimal } from '@prisma/client/runtime/library'; // Asegúrate de importar Decimal correctamente

const logo: Content = {
  image: 'src/assets/icases-store-v1.png',
  width: 70,
  height: 70,
  margin: [30, 10],
};

const styles: StyleDictionary = {
  header: {
    fontSize: 20,
    bold: true,
    margin: [0, 30, 0, 0],
  },
  subHeader: {
    fontSize: 16,
    bold: true,
    margin: [0, 20, 0, 0],
  },
};

export interface Compra {
  id_compra: string;
  fecha_compra: Date | null;
  numero_documento: string | null;
  compra_subtotal: Decimal | null;
  compra_igv: Decimal | null;
  compra_total: Decimal | null;
  compra_comentario: string | null;
  tb_proveedores: {
    tb_personas: {
      nombres: string | null;
      razon_social: string | null;
    };
  };
  tb_metodo_pago: {
    nombre_metodo_pago: string | null;
  };
  tb_detalle_compra: CompraDetalle[];
}

export interface CompraDetalle {
  id_detalle_compra: string;
  cantidad: number | null;
  precio_unitario: Decimal | null;
  subtotal: Decimal | null;
  tb_productos: {
    nombre_producto: string | null;
    codigo_producto: string | null;
    precio_compra: Decimal | null;
    precio_venta: Decimal | null;
  };
}

interface ReportValues {
  title?: string;
  subTitle?: string;
  compra: Compra;
}

export const getCompraDetalleReport = (value: ReportValues): TDocumentDefinitions => {
  const { compra, title, subTitle } = value;

  // Conversión segura de Decimal a número
  const subTotal = compra.tb_detalle_compra.reduce(
    (acc, detalle) =>
      acc +
      (detalle.cantidad || 0) *
        (detalle.precio_unitario ? parseFloat(detalle.precio_unitario.toString()) : 0),
    0,
  );

  const igv = compra.compra_igv ? parseFloat(compra.compra_igv.toString()) : subTotal * 0.18;
  const total = compra.compra_total ? parseFloat(compra.compra_total.toString()) : subTotal + igv;

  return {
    styles: styles,
    header: logo,
    pageMargins: [40, 60, 40, 60],
    footer: footerSection,
    content: [
      // Título de la empresa
      {
        text: 'Icases Store\n',
        style: 'header',
      },

      // Información de contacto y recibo
      {
        columns: [
          {
            text: 'Dirección de tu empresa\nTeléfono\nCorreo electrónico',
          },
          {
            text: [
              {
                text: `Compra No. ${compra.id_compra}\n`,
                bold: true,
              },
              `Fecha de Compra: ${compra.fecha_compra ? DateFormatter.getDDMMMMYYYY(compra.fecha_compra) : 'N/A'}\n`,
              `Número de Documento: ${compra.numero_documento || 'N/A'}\n`,
              `Método de Pago: ${compra.tb_metodo_pago?.nombre_metodo_pago || 'N/A'}`,
            ],
            alignment: 'right',
          },
        ],
      },

      // Información del Proveedor
      {
        text: [
          {
            text: 'Datos del Proveedor:\n',
            style: 'subHeader',
          },
          `Nombre: ${compra.tb_proveedores?.tb_personas?.nombres || 'N/A'}\n`,
          `Razón Social: ${compra.tb_proveedores?.tb_personas?.razon_social || 'N/A'}\n`,
          `Comentario: ${compra.compra_comentario || 'N/A'}`,
        ],
        margin: [0, 10],
      },

      // Tabla de detalles de la compra
      {
        layout: 'lightHorizontalLines',
        margin: [0, 20],
        table: {
          headerRows: 1,
          widths: ['15%', '35%', '15%', '20%', '15%'],
          body: [
            ['Código', 'Producto', 'Cantidad', 'Precio Unitario', 'Subtotal'],
            ...compra.tb_detalle_compra.map((detalle) => [
              detalle.tb_productos?.codigo_producto || 'N/A',
              detalle.tb_productos?.nombre_producto || 'N/A',
              (detalle.cantidad || 0).toString(),
              {
                text: CurrencyFormatter.formatCurrency(
                  detalle.precio_unitario ? parseFloat(detalle.precio_unitario.toString()) : 0,
                ),
                alignment: 'right',
              },
              {
                text: CurrencyFormatter.formatCurrency(
                  detalle.subtotal
                    ? parseFloat(detalle.subtotal.toString())
                    : (detalle.cantidad || 0) *
                        (detalle.precio_unitario
                          ? parseFloat(detalle.precio_unitario.toString())
                          : 0),
                ),
                alignment: 'right',
              },
            ]),
          ],
        },
      },

      // Totales
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            layout: 'noBorders',
            table: {
              body: [
                [
                  'Subtotal',
                  {
                    text: CurrencyFormatter.formatCurrency(subTotal),
                    alignment: 'right',
                  },
                ],
                [
                  'IGV (18%)',
                  {
                    text: CurrencyFormatter.formatCurrency(igv),
                    alignment: 'right',
                  },
                ],
                [
                  { text: 'Total', bold: true },
                  {
                    text: CurrencyFormatter.formatCurrency(total),
                    alignment: 'right',
                    bold: true,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  };
};
