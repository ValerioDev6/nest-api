/* eslint-disable @typescript-eslint/no-unused-vars */
import { Workbook } from 'exceljs';
import { tb_marcas as Marca } from '@prisma/client';

interface ReportOptions {
  title?: string;
  marcas: Marca[];
}

export const getMarcasExcelReport = async (options: ReportOptions): Promise<Workbook> => {
  const { title = 'Reporte de Marcas', marcas } = options;

  // Crear nuevo workbook y worksheet
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Marcas');

  // Configurar encabezados con colores y anchos personalizados
  worksheet.columns = [
    { header: 'Nombre Marca', key: 'nombre_marca', width: 25 }, // Ancho ajustado
    { header: 'Estado', key: 'estado', width: 15 }, // Ancho ajustado
    { header: 'Fecha Creación', key: 'created_at', width: 20 }, // Ancho ajustado
  ];

  // Agregar las filas con datos
  marcas.forEach((marca) => {
    worksheet.addRow({
      nombre_marca: marca.nombre_marca,
      estado: marca.estado ? 'Activo' : 'Inactivo',
      created_at: new Date(marca.created_at).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    });
  });

  // Formatear encabezado con diferentes colores por columna
  const headerRow = worksheet.getRow(1);
  headerRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0160BC' } }; // Naranja para "Nombre Marca"
  headerRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0160BC' } }; // Verde claro para "Estado"
  headerRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0160BC' } }; // Azul para "Fecha Creación"

  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Texto blanco
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  // Aplicar estilos condicionales para "Estado"
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const estadoCell = row.getCell(2);
      estadoCell.font = {
        color: { argb: estadoCell.value === 'Activo' ? 'FF008000' : 'FFFF0000' },
        bold: true,
      };
    }
  });

  // Agregar fila de totales al final
  const totalRow = worksheet.addRow(['', 'Total Marcas', marcas.length]);
  totalRow.font = { bold: true };
  totalRow.alignment = { horizontal: 'center' };

  // Ajustar el ancho de las columnas según el contenido
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : '';
      maxLength = Math.max(maxLength, cellValue.length);
    });
    column.width = maxLength < 25 ? 25 : maxLength + 2; // Ajustar ancho mínimo de 25
  });

  return workbook;
};
