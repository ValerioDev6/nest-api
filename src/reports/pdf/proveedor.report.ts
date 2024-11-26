import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { footerSection } from './sections/footer.section';
import { Decimal } from '@prisma/client/runtime/library';

interface ProveedorData {
  id_proveedor: string;
  nombre_comercial: string;
  estado_proveedor: string;
  total_compras: Decimal;
  ultima_compra: Date | null;

  tb_personas: {
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    numero_documento: string;
    correo?: string;
    telefono?: string;
  } | null;
}

interface ReportOptions {
  title?: string;
  subTitle?: string;
  proveedores: ProveedorData[];
}

export const getProveedoresReport = (options: ReportOptions): TDocumentDefinitions => {
  const { title, subTitle, proveedores } = options;

  const formatFecha = (fecha: Date | null) => {
    if (!fecha) return 'No registrada';
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatMonto = (monto: Decimal) => {
    return `S/. ${monto.toFixed(2)}`;
  };

  return {
    pageOrientation: 'landscape',
    header: headerSection({
      title: title ?? 'REPORTE DE PROVEEDORES',
      subtitle: subTitle ?? 'Listado de proveedores',
    }),
    footer: footerSection,
    pageMargins: [40, 100, 40, 50],
    content: [
      {
        layout: 'customLayout01',
        table: {
          headerRows: 1,
          widths: ['15%', '15%', '10%', '10%', '15%', '15%', '10%', '10%'],
          body: [
            [
              { text: 'Nombre Comercial', style: { bold: true }, color: 'white' },
              { text: 'Nombre Completo', style: { bold: true }, color: 'white' },
              { text: 'Documento', style: { bold: true }, color: 'white' },
              { text: 'Estado', style: { bold: true }, color: 'white' },
              { text: 'Correo', style: { bold: true }, color: 'white' },
              { text: 'Teléfono', style: { bold: true }, color: 'white' },
              { text: 'Total Compras', style: { bold: true }, color: 'white' },
              { text: 'Última Compra', style: { bold: true }, color: 'white' },
            ],
            ...proveedores.map((proveedor) => [
              { text: proveedor.nombre_comercial || 'Sin nombre comercial' },
              {
                text: proveedor.tb_personas
                  ? `${proveedor.tb_personas.nombres} ${proveedor.tb_personas.apellido_paterno} ${proveedor.tb_personas.apellido_materno}`
                  : 'Sin información personal',
              },
              {
                text: proveedor.tb_personas
                  ? proveedor.tb_personas.numero_documento
                  : 'Sin documento',
              },
              { text: proveedor.estado_proveedor },
              {
                text: proveedor.tb_personas?.correo || 'Sin correo',
              },
              {
                text: proveedor.tb_personas?.telefono || 'Sin teléfono',
              },
              {
                text: formatMonto(proveedor.total_compras || new Decimal(0)),
                alignment: 'right',
              },
              {
                text: formatFecha(proveedor.ultima_compra),
                alignment: 'center',
              },
            ]),
            [
              { text: '', colSpan: 8, border: [false, false, false, false] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: '', colSpan: 6, border: [false, false, false, false] },
              {},
              {},
              {},
              {},
              {},
              { text: 'Total', alignment: 'right', bold: true },
              { text: `${proveedores.length} proveedores`, alignment: 'center', bold: true },
            ],
          ],
        },
      },
      {
        text: 'Totales',
        style: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', 'auto'],
          body: [
            [
              { text: 'Total de Compras:', bold: true, alignment: 'right' },
              {
                text: formatMonto(
                  proveedores.reduce(
                    (total, p) => total.plus(p.total_compras || 0),
                    new Decimal(0),
                  ),
                ),
                bold: true,
                alignment: 'center',
              },
            ],
          ],
        },
      },
    ],
    defaultStyle: {
      fontSize: 8,
    },
  };
};
