import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { footerSection } from './sections/footer.section';
import { Decimal } from '@prisma/client/runtime/library';

interface VentaData {
  id_venta: string;
  fecha_venta?: Date;
  numero_documento: string;
  tipo_documento: string;
  subtotal: Decimal;
  impuesto?: Decimal;
  precio_total?: Decimal;
  estado_venta: string;
  serie_documento?: string;
  tb_cliente?: {
    id_persona: string;
    tb_personas: {
      nombres: string;
      apellido_paterno: string;
      apellido_materno: string;
      numero_documento: string;
      correo?: string;
      telefono?: string;
    };
  };
  tb_personal?: {
    id_persona: string;
    tb_personas: {
      nombres: string;
      apellido_paterno: string;
      apellido_materno: string;
      numero_documento: string;
      correo?: string;
      telefono?: string;
    };
  };
  tb_metodo_pago?: {
    nombre_metodo_pago: string;
  };
}

interface ReportOptions {
  title?: string;
  subTitle?: string;
  ventas: VentaData[];
}

export const getVentasReport = (options: ReportOptions): TDocumentDefinitions => {
  const { title, subTitle, ventas } = options;

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

  // Formatear nombre completo
  const formatNombreCompleto = (persona?: {
    tb_personas: {
      nombres: string;
      apellido_paterno: string;
      apellido_materno: string;
    };
  }) => {
    return persona
      ? `${persona.tb_personas.nombres} ${persona.tb_personas.apellido_paterno} ${persona.tb_personas.apellido_materno || ''}`.trim()
      : 'Sin nombre';
  };

  // Formatear precio
  const formatPrecio = (precio?: Decimal) => {
    return precio ? `S/. ${precio.toFixed(2)}` : 'S/. 0.00';
  };

  // Calcular totales
  const totalVentas = ventas.length;
  const totalMontoVentas = ventas.reduce(
    (sum, venta) => sum + (venta.precio_total?.toNumber() || 0),
    0,
  );

  // Agrupar por método de pago
  const metodosPago = ventas.reduce(
    (acc, venta) => {
      const metodo = venta.tb_metodo_pago?.nombre_metodo_pago || 'Sin método';
      if (!acc[metodo]) {
        acc[metodo] = {
          cantidad: 0,
          total: 0,
        };
      }
      acc[metodo].cantidad++;
      acc[metodo].total += venta.precio_total?.toNumber() || 0;
      return acc;
    },
    {} as Record<string, { cantidad: number; total: number }>,
  );

  return {
    pageOrientation: 'landscape',
    header: headerSection({
      title: title ?? 'REPORTE DE VENTAS',
      subtitle: subTitle ?? 'Listado detallado de ventas',
    }),
    footer: footerSection,
    pageMargins: [40, 100, 40, 50],
    content: [
      {
        layout: 'customLayout01',
        table: {
          headerRows: 1,
          widths: ['6%', '15%', '10%', '8%', '8%', '8%', '10%', '10%', '15%', '10%'],
          body: [
            [
              { text: 'ID', style: { bold: true }, color: 'white' },
              { text: 'Cliente', style: { bold: true }, color: 'white' },
              { text: 'Doc. Cliente', style: { bold: true }, color: 'white' },
              { text: 'Subtotal', style: { bold: true }, color: 'white' },
              { text: 'Impuesto', style: { bold: true }, color: 'white' },
              { text: 'Total', style: { bold: true }, color: 'white' },
              { text: 'Método Pago', style: { bold: true }, color: 'white' },
              { text: 'Vendedor', style: { bold: true }, color: 'white' },
              { text: 'Fecha', style: { bold: true }, color: 'white' },
            ],
            ...ventas.map((venta) => [
              { text: venta.id_venta.slice(-8) },
              { text: formatNombreCompleto(venta.tb_cliente) },
              { text: venta.tb_cliente?.tb_personas.numero_documento || 'Sin documento' },
              { text: formatPrecio(venta.subtotal) },
              { text: formatPrecio(venta.impuesto) },
              { text: formatPrecio(venta.precio_total) },
              { text: venta.tb_metodo_pago?.nombre_metodo_pago || 'Sin método' },
              { text: formatNombreCompleto(venta.tb_personal) },
              { text: formatFecha(venta.fecha_venta) },
            ]),
          ],
        },
      },
      {
        text: 'Resumen de Ventas',
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
              { text: 'Total de Ventas', bold: true, alignment: 'right' },
              { text: totalVentas.toString(), bold: true, alignment: 'center' },
            ],
            [
              {},
              { text: 'Monto Total de Ventas', bold: true, alignment: 'right' },
              { text: `S/. ${totalMontoVentas.toFixed(2)}`, bold: true, alignment: 'center' },
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
              { text: 'Número de Ventas', bold: true, alignment: 'center' },
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
