import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { footerSection } from './sections/footer.section';
import { Decimal } from '@prisma/client/runtime/library';
interface ProductoData {
  nombre_producto: string;
  stock: number;
  precio_compra: Decimal;
  precio_venta: Decimal;
  fecha_ingreso: Date;
  estado_produto: string;

  tb_categorias: {
    nombre_cat: string;
  } | null;
  tb_marcas: {
    nombre_marca: string;
  } | null;
  tb_sucursales: {
    nombre_sucursal: string;
  } | null;
  tb_tipo_propietario: {
    descripcion: string;
  };
}

interface ReportOptions {
  title?: string;
  subTitle?: string;
  productos: ProductoData[];
}
export const getProductosReport = (options: ReportOptions): TDocumentDefinitions => {
  const { title, subTitle, productos } = options;

  const formatFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrecio = (precio: Decimal) => {
    return `S/. ${precio.toFixed(2)}`;
  };

  return {
    pageOrientation: 'landscape',
    header: headerSection({
      title: title ?? 'REPORTE DE PRODUCTOS',
      subtitle: subTitle ?? 'Listado de productos',
    }),
    footer: footerSection,
    pageMargins: [40, 100, 40, 50],
    content: [
      {
        layout: 'customLayout01',
        table: {
          headerRows: 1,
          widths: ['15%', 'auto', '15%', '10%', '10%', '10%', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Producto', style: { bold: true }, color: 'white' },
              { text: 'Stock', style: { bold: true }, color: 'white' },
              { text: 'Categoría', style: { bold: true }, color: 'white' },
              { text: 'Marca', style: { bold: true }, color: 'white' },
              { text: 'Precio Compra', style: { bold: true }, color: 'white' },
              { text: 'Precio Venta', style: { bold: true }, color: 'white' },
              { text: 'Fecha Ingreso', style: { bold: true }, color: 'white' },
              { text: 'Estado', style: { bold: true }, color: 'white' },
              { text: 'Sucursal', style: { bold: true }, color: 'white' },
              { text: 'Propietario', style: { bold: true }, color: 'white' },
            ],
            ...productos.map((producto) => [
              { text: producto.nombre_producto },
              { text: producto.stock, alignment: 'center' },
              { text: producto.tb_categorias?.nombre_cat || 'Sin categoría' },
              { text: producto.tb_marcas?.nombre_marca || 'Sin marca' },
              { text: formatPrecio(producto.precio_compra) },
              { text: formatPrecio(producto.precio_venta) },
              { text: formatFecha(producto.fecha_ingreso) },
              { text: producto.estado_produto },
              { text: producto.tb_sucursales?.nombre_sucursal || 'Sin sucursal' },
              { text: producto.tb_tipo_propietario.descripcion },
            ]),
            [
              { text: '', colSpan: 10, border: [false, false, false, false] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: '', colSpan: 8, border: [false, false, false, false] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: 'Total', alignment: 'right', bold: true },
              { text: `${productos.length} productos`, alignment: 'center', bold: true },
            ],
          ],
        },
      },
      {
        text: 'Totales',
        style: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 20],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', 'auto', '*'],
          body: [
            [
              { text: 'Total de Productos', bold: true, alignment: 'right' },
              { text: productos.length.toString(), bold: true, alignment: 'center' },
              {}, // Celda vacía
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
