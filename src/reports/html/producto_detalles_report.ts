import { Decimal } from '@prisma/client/runtime/library';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from '../pdf/sections/header.section';
import { footerSection } from '../pdf/sections/footer.section';
// Definimos una interfaz específica para los datos que necesitamos
interface ProductoReporte {
  nombre_producto: string;
  descripcion: string;
  codigo_producto: string;
  stock: number;
  precio_compra: Decimal;
  precio_venta: Decimal;
  fecha_ingreso: Date;
  estado_produto: string;
  tb_categorias?: {
    nombre_cat: string;
  };
  tb_marcas?: {
    nombre_marca: string;
  };
  tb_sucursales?: {
    nombre_sucursal: string;
  };
  tb_tipo_propietario: {
    descripcion: string;
  };
}

interface ReportOptions {
  title?: string;
  subTitle?: string;
  producto: ProductoReporte;
}
export const getProductoDetalleReport = (options: ReportOptions): TDocumentDefinitions => {
  const { title, subTitle, producto } = options;

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
    pageOrientation: 'portrait',
    header: headerSection({
      title: title ?? 'DETALLE DE PRODUCTO',
      subtitle: subTitle ?? producto.nombre_producto,
    }),
    footer: footerSection,
    pageMargins: [40, 100, 40, 50],
    content: [
      {
        style: 'tableExample',
        table: {
          widths: ['35%', '*'],
          body: [
            [
              {
                text: 'Nombre',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: producto.nombre_producto,
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Código Producto',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: producto.codigo_producto,
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Descripcion',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: producto.descripcion,
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Stock',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: producto.stock.toString(),
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Categoría',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: producto.tb_categorias?.nombre_cat || 'Sin categoría',
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Marca',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: producto.tb_marcas?.nombre_marca || 'Sin marca',
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Precio Compra',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: formatPrecio(producto.precio_compra),
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Precio Venta',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: formatPrecio(producto.precio_venta),
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Fecha Ingreso',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: formatFecha(producto.fecha_ingreso),
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Estado',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: producto.estado_produto,
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Sucursal',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: producto.tb_sucursales?.nombre_sucursal || 'Sin sucursal',
                style: 'valueCell',
              },
            ],
            [
              {
                text: 'Propietario',
                style: 'labelCell',
                fillColor: '#f5f5f5',
              },
              {
                text: producto.tb_tipo_propietario.descripcion,
                style: 'valueCell',
              },
            ],
          ],
        },
        layout: {
          hLineWidth: function () {
            return 0.5;
          },
          vLineWidth: function () {
            return 0.5;
          },
          hLineColor: function () {
            return '#dddddd';
          },
          vLineColor: function () {
            return '#dddddd';
          },
          paddingLeft: function () {
            return 8;
          },
          paddingRight: function () {
            return 8;
          },
          paddingTop: function () {
            return 8;
          },
          paddingBottom: function () {
            return 8;
          },
        },
      },
    ],
    styles: {
      labelCell: {
        fontSize: 11,
        bold: true,
      },
      valueCell: {
        fontSize: 11,
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };
};
