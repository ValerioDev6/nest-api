import { Workbook } from 'exceljs';
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
  compras: CompraData[];
}

export const getComprasExcelReport = async (options: ReportOptions): Promise<Workbook> => {
  const { title = 'Reporte de Compras', compras } = options;

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Compras');

  // Configurar columnas
  worksheet.columns = [
    { header: 'ID Compra', key: 'id_compra', width: 20 },
    { header: 'Proveedor', key: 'proveedor', width: 30 },
    { header: 'RUC', key: 'ruc', width: 20 },
    { header: 'Nº Documento', key: 'numero_documento', width: 20 },
    { header: 'Método Pago', key: 'metodo_pago', width: 20 },
    { header: 'Subtotal', key: 'subtotal', width: 15 },
    { header: 'IGV', key: 'igv', width: 15 },
    { header: 'Total Compra', key: 'total', width: 15 },
    { header: 'Fecha Compra', key: 'fecha_compra', width: 20 },
  ];

  // Agregar filas de datos
  compras.forEach((compra) => {
    worksheet.addRow({
      id_compra: compra.id_compra,
      proveedor: compra.tb_proveedores?.nombre_comercial || 'Sin proveedor',
      ruc: compra.proveedor_ruc || 'Sin RUC',
      numero_documento: compra.numero_documento || 'Sin documento',
      metodo_pago: compra.tb_metodo_pago?.nombre_metodo_pago || 'Sin método',
      subtotal: Number(compra.compra_subtotal),
      igv: Number(compra.compra_igv),
      total: Number(compra.compra_total),
      fecha_compra: compra.fecha_compra
        ? new Date(compra.fecha_compra).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : 'Sin fecha',
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

  // Formatear columnas numéricas
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const subtotalCell = row.getCell('subtotal');
      const igvCell = row.getCell('igv');
      const totalCell = row.getCell('total');

      subtotalCell.numFmt = '"S/. "#,##0.00';
      igvCell.numFmt = '"S/. "#,##0.00';
      totalCell.numFmt = '"S/. "#,##0.00';
    }
  });

  // Agregar fila vacía
  worksheet.addRow([]);

  // Calcular totales
  const totalCompras = compras.length;
  const totalMontoCompras = compras.reduce(
    (sum, compra) => sum + (compra.compra_total?.toNumber() || 0),
    0,
  );

  // Agregar fila de totales
  const totalRow = worksheet.addRow({
    id_compra: 'RESUMEN TOTAL',
    proveedor: `Total Compras: ${totalCompras}`,
    total: totalMontoCompras,
  });

  // Formatear fila de totales
  totalRow.eachCell((cell) => {
    cell.font = { bold: true, size: 12 };
    cell.alignment = { horizontal: 'left', vertical: 'middle' };
  });

  // Ajustar ancho de columnas
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
