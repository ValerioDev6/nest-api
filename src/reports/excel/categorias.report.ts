import { Workbook } from 'exceljs';
import { tb_categorias as Categoria } from '@prisma/client';

export const getCategoriasExcelReport = async (options: {
  categorias: Categoria[];
}): Promise<Workbook> => {
  const { categorias } = options;

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Marcas');

  worksheet.columns = [
    { header: 'Nombre Categoria', key: 'nombre_cat', width: 25 },
    { header: 'Estado', key: 'estado', width: 15 },
    { header: 'Fecha Creación', key: 'created_at', width: 20 },
  ];

  categorias.forEach((marca) => {
    worksheet.addRow({
      nombre_cat: marca.nombre_cat,
      estado: marca.estado ? 'Activo' : 'Inactivo',
      created_at: new Date(marca.created_at).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    });
  });

  const headerRow = worksheet.getRow(1);
  headerRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0160BC' } };
  headerRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0160BC' } };
  headerRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0160BC' } };

  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const estadoCell = row.getCell(2);
      estadoCell.font = {
        color: { argb: estadoCell.value === 'Activo' ? 'FF008000' : 'FFFF0000' },
        bold: true,
      };
    }
  });

  const totalRow = worksheet.addRow(['', 'Total Marcas', categorias.length]);
  totalRow.font = { bold: true };
  totalRow.alignment = { horizontal: 'center' };

  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : '';
      maxLength = Math.max(maxLength, cellValue.length);
    });
    column.width = maxLength < 25 ? 25 : maxLength + 2;
  });

  return workbook;
};
