// import { TDocumentDefinitions } from 'pdfmake/interfaces';
// import { headerSection } from './sections/header.section';
// import { tb_marcas as Marca } from '@prisma/client';
// import { footerSection } from './sections/footer.section';

// interface ReportOptions {
//   title?: string;
//   subTitle?: string;
//   marcas: Marca[];
// }

// export const getMarcasReport = (options: ReportOptions): TDocumentDefinitions => {
//   const { title, subTitle, marcas } = options;

//   // Función para formatear el estado
//   const formatEstado = (estado: boolean) => ({
//     text: estado ? 'Activo' : 'Inactivo',
//     style: {
//       color: estado ? 'green' : 'red',
//       bold: true,
//     },
//   });

//   // Función para formatear la fecha
//   const formatFecha = (fecha: Date) => {
//     return new Date(fecha).toLocaleDateString('es-PE', {
//       day: '2-digit',
//       month: 'long',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return {
//     pageOrientation: 'landscape',
//     header: headerSection({
//       title: title ?? 'Reporte de Marcas',
//       subtitle: subTitle ?? 'Listado de marcas',
//     }),
//     footer: footerSection,
//     pageMargins: [40, 100, 40, 50],
//     content: [
//       {
//         layout: 'customLayout01', // Cambia el diseño para mayor claridad
//         table: {
//           headerRows: 1,
//           widths: ['auto', 'auto', 'auto'], // Usar "auto" para que se ajuste al contenido automáticamente
//           body: [
//             [
//               { text: 'Nombre Marca', style: { bold: true }, color: 'white' },
//               { text: 'Estado Marca', style: { bold: true }, color: 'white' },
//               { text: 'Fecha Creación', style: { bold: true }, color: 'white' },
//             ],
//             ...marcas.map((marca) => [
//               { text: marca.nombre_marca },
//               formatEstado(marca.estado),
//               { text: formatFecha(marca.created_at) },
//             ]),
//             // Fila vacía para separar
//             [{ text: '', colSpan: 3, border: [false, false, false, false] }, {}, {}],
//             // Fila para mostrar el total
//             [
//               { text: '', border: [false, false, false, false] }, // Celda vacía sin borde
//               { text: 'Total', alignment: 'right', bold: true }, // Texto "Total" alineado a la derecha
//               { text: `${marcas.length} marcas`, alignment: 'center', bold: true }, // Total de marcas
//             ],
//           ],
//         },
//       },
//       // Título de totales
//       {
//         text: 'Totales',
//         style: {
//           fontSize: 18,
//           bold: true,
//           margin: [0, 20, 0, 20],
//         },
//       },
//       // Tabla de totales
//       {
//         layout: 'noBorders',
//         table: {
//           widths: ['auto', 'auto', 'auto'], // Usar "auto" para que las columnas se ajusten automáticamente
//           body: [
//             [
//               { text: 'Total de Marcas', bold: true, alignment: 'right' },
//               { text: marcas.length.toString(), bold: true, alignment: 'center' },
//               {}, // Celda vacía
//             ],
//           ],
//         },
//       },
//     ],

//     defaultStyle: {
//       fontSize: 10,
//     },
//   };
// };
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { tb_marcas as Marca } from '@prisma/client';
import { footerSection } from './sections/footer.section';

interface ReportOptions {
  title?: string;
  subTitle?: string;
  marcas: Marca[];
}

export const getMarcasReport = (options: ReportOptions): TDocumentDefinitions => {
  const { title, subTitle, marcas } = options;

  // Función para formatear el estado
  const formatEstado = (estado: boolean) => ({
    text: estado ? 'Activo' : 'Inactivo',
    style: {
      color: estado ? 'green' : 'red',
      bold: true,
    },
  });

  // Función para formatear la fecha
  const formatFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const rowsPerPage = 10; // Número de registros por página
  const pages = Math.ceil(marcas.length / rowsPerPage); // Calcular cuántas páginas serán necesarias
  const content = [];

  for (let pageIndex = 0; pageIndex < pages; pageIndex++) {
    const start = pageIndex * rowsPerPage;
    const end = start + rowsPerPage;
    const marcasPage = marcas.slice(start, end); // Obtener las marcas para la página actual

    // Agregar tabla al contenido de la página actual
    content.push({
      layout: 'customLayout01',
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto'],
        body: [
          [
            { text: 'Nombre Marca', style: { bold: true }, color: 'white' },
            { text: 'Estado Marca', style: { bold: true }, color: 'white' },
            { text: 'Fecha Creación', style: { bold: true }, color: 'white' },
          ],
          ...marcasPage.map((marca) => [
            { text: marca.nombre_marca },
            formatEstado(marca.estado),
            { text: formatFecha(marca.created_at) },
          ]),
          [{ text: '', colSpan: 3, border: [false, false, false, false] }, {}, {}],
          [
            { text: '', border: [false, false, false, false] },
            { text: 'Total', alignment: 'right', bold: true },
            { text: `${marcas.length} marcas`, alignment: 'center', bold: true },
          ],
        ],
      },
    });

    // Si no es la última página, añadir un salto de página
    if (pageIndex < pages - 1) {
      content.push({ text: '', pageBreak: 'after' });
    }
  }

  return {
    pageOrientation: 'landscape',
    header: headerSection({
      title: title ?? 'ICASE`S STORE REPORTE DE MARCAS',
      subtitle: subTitle ?? 'Listado de marcas',
    }),
    footer: footerSection,
    pageMargins: [40, 100, 40, 50],
    content: content,
    defaultStyle: {
      fontSize: 10,
    },
  };
};
