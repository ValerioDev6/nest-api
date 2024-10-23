import { Workbook } from 'exceljs';

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

export const getProductoExcelReport = async (options: ReportOptions): Promise<Workbook> => {
  const { title = 'Reporte de Productos', productos } = options;

  const workbook = new Workbook();

  const worksheet = workbook.addWorksheet('Productos');

  // Configurar encabezados con colores y anchos personalizados

  worksheet.columns = [
    { header: 'Producto', key: 'nombre_producto', width: 30 },

    { header: 'Categoría', key: 'categoria', width: 20 },

    { header: 'Marca', key: 'marca', width: 20 },

    { header: 'Sucursal', key: 'sucursal', width: 20 },

    { header: 'Tipo Propietario', key: 'tipo_propietario', width: 20 },

    { header: 'Stock', key: 'stock', width: 15 },

    { header: 'Precio Compra', key: 'precio_compra', width: 15 },

    { header: 'Precio Venta', key: 'precio_venta', width: 15 },

    { header: 'Estado', key: 'estado', width: 15 },

    { header: 'Fecha Ingreso', key: 'fecha_ingreso', width: 20 },
  ];

  // Agregar las filas con datos

  productos.forEach((producto) => {
    worksheet.addRow({
      nombre_producto: producto.nombre_producto,

      categoria: producto.tb_categorias?.nombre_cat || 'Sin categoría',

      marca: producto.tb_marcas?.nombre_marca || 'Sin marca',

      sucursal: producto.tb_sucursales?.nombre_sucursal || 'Sin sucursal',

      tipo_propietario: producto.tb_tipo_propietario.descripcion,

      stock: producto.stock,

      precio_compra: Number(producto.precio_compra),

      precio_venta: Number(producto.precio_venta),

      estado: producto.estado_produto,

      fecha_ingreso: new Date(producto.fecha_ingreso).toLocaleDateString('es-PE', {
        day: '2-digit',

        month: 'long',

        year: 'numeric',
      }),
    });
  });

  // Formatear encabezado

  const headerRow = worksheet.getRow(1);

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',

      pattern: 'solid',

      fgColor: { argb: '0160BC' },
    };

    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };

    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // Aplicar estilos condicionales para "Estado" y "Stock"

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // Estado

      const estadoCell = row.getCell('estado');

      estadoCell.font = {
        color: { argb: estadoCell.value === 'Disponible' ? 'FF008000' : 'FFFF0000' },

        bold: true,
      };

      // Stock

      const stockCell = row.getCell('stock');

      if (Number(stockCell.value) <= 10) {
        stockCell.font = { color: { argb: 'FFFF0000' }, bold: true };
      }

      // Formato de precios

      const precioCompraCell = row.getCell('precio_compra');

      const precioVentaCell = row.getCell('precio_venta');

      precioCompraCell.numFmt = '"S/. "#,##0.00';

      precioVentaCell.numFmt = '"S/. "#,##0.00';
    }
  });

  // Agregar una fila vacía antes de los totales

  worksheet.addRow([]);

  // Calcular totales

  const totalProductos = productos.length;

  const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0);

  // Agregar fila de totales con formato mejorado

  const totalRow = worksheet.addRow({
    nombre_producto: 'RESUMEN TOTAL',

    categoria: `Total Productos: ${totalProductos}`,

    marca: `Stock Total: ${stockTotal}`,
  });

  // Aplicar formato a la fila de totales

  totalRow.eachCell((cell) => {
    cell.font = { bold: true, size: 12 };

    cell.alignment = { horizontal: 'left', vertical: 'middle' };
  });

  // Ajustar el ancho de las columnas según el contenido

  worksheet.columns.forEach((column) => {
    let maxLength = 0;

    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : '';

      maxLength = Math.max(maxLength, cellValue.length);
    });

    column.width = Math.min(Math.max(maxLength + 2, 15), 30);
  });
  return workbook;
};
