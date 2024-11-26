import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { footerSection } from './sections/footer.section';
import { Decimal } from '@prisma/client/runtime/library';

interface CompraData {
  id_compra: string;
  proveedor_ruc?: string;
  numero_documento?: string;
  compra_subtotal?: Decimal;
  compra_igv?: Decimal;
  compra_total?: Decimal;
  fecha_compra?: Date;
  tb_proveedores?: {
    nombre_comercial: string;
  };
  tb_metodo_pago?: {
    nombre_metodo_pago: string;
  };
}

interface ReportOptions {
  title?: string;
  subTitle?: string;
  compras: CompraData[];
}

export const getComprasReport = (options: ReportOptions): TDocumentDefinitions => {
  const { title, subTitle, compras } = options;

  // Formatear fecha
  const formatFecha = (fecha?: Date) => {
    return fecha
      ? new Date(fecha).toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'Sin fecha';
  };

  // Formatear precio
  const formatPrecio = (precio?: Decimal) => {
    return precio ? `S/. ${precio.toFixed(2)}` : 'S/. 0.00';
  };

  // Calcular totales
  const totalCompras = compras.length;
  const totalMontoCompras = compras.reduce(
    (sum, compra) => sum + (compra.compra_total?.toNumber() || 0),
    0,
  );

  // Agrupar por método de pago
  const metodosPago = compras.reduce(
    (acc, compra) => {
      const metodo = compra.tb_metodo_pago?.nombre_metodo_pago || 'Sin método';
      if (!acc[metodo]) {
        acc[metodo] = {
          cantidad: 0,
          total: 0,
        };
      }
      acc[metodo].cantidad++;
      acc[metodo].total += compra.compra_total?.toNumber() || 0;
      return acc;
    },
    {} as Record<string, { cantidad: number; total: number }>,
  );

  return {
    pageOrientation: 'landscape',
    header: headerSection({
      title: title ?? 'REPORTE DE COMPRAS',
      subtitle: subTitle ?? 'Listado detallado de compras',
    }),
    footer: footerSection,
    pageMargins: [40, 100, 40, 50],
    content: [
      {
        layout: 'customLayout01',
        table: {
          headerRows: 1,
          widths: ['8%', '15%', '12%', '12%', '10%', '10%', '10%', '10%', '13%'],
          body: [
            [
              { text: 'ID', style: { bold: true }, color: 'white' },
              { text: 'Proveedor', style: { bold: true }, color: 'white' },
              { text: 'RUC', style: { bold: true }, color: 'white' },
              { text: 'Nº Documento', style: { bold: true }, color: 'white' },
              { text: 'Subtotal', style: { bold: true }, color: 'white' },
              { text: 'IGV', style: { bold: true }, color: 'white' },
              { text: 'Total', style: { bold: true }, color: 'white' },
              { text: 'Método Pago', style: { bold: true }, color: 'white' },
              { text: 'Fecha', style: { bold: true }, color: 'white' },
            ],
            ...compras.map((compra) => [
              { text: compra.id_compra.slice(-8) }, // Mostrar solo últimos 8 caracteres
              { text: compra.tb_proveedores?.nombre_comercial || 'Sin proveedor' },
              { text: compra.proveedor_ruc || 'Sin RUC' },
              { text: compra.numero_documento || 'Sin documento' },
              { text: formatPrecio(compra.compra_subtotal) },
              { text: formatPrecio(compra.compra_igv) },
              { text: formatPrecio(compra.compra_total) },
              { text: compra.tb_metodo_pago?.nombre_metodo_pago || 'Sin método' },
              { text: formatFecha(compra.fecha_compra) },
            ]),
          ],
        },
      },
      {
        text: 'Resumen de Compras',
        style: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 20],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              {},
              { text: 'Total de Compras', bold: true, alignment: 'right' },
              { text: totalCompras.toString(), bold: true, alignment: 'center' },
            ],
            [
              {},
              { text: 'Monto Total de Compras', bold: true, alignment: 'right' },
              { text: `S/. ${totalMontoCompras.toFixed(2)}`, bold: true, alignment: 'center' },
            ],
          ],
        },
      },
      {
        text: 'Detalle por Método de Pago',
        style: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 10],
        },
      },
      {
        layout: 'lightHorizontalLines',
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: 'Método de Pago', bold: true },
              { text: 'Número de Compras', bold: true, alignment: 'center' },
              { text: 'Monto Total', bold: true, alignment: 'right' },
            ],
            ...Object.entries(metodosPago).map(([metodo, datos]) => [
              { text: metodo },
              { text: datos.cantidad.toString(), alignment: 'center' },
              { text: `S/. ${datos.total.toFixed(2)}`, alignment: 'right' },
            ]),
          ],
        },
      },
    ],
    defaultStyle: {
      fontSize: 8,
    },
  };
};
