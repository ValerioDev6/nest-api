import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { PrismaService } from 'src/prisma/prisma.service';
import { getCategoriasExcelReport, getMarcasExcelReport } from 'src/reports/excel';
import { getComprasExcelReport } from 'src/reports/excel/compras_excel.report';
import { getProductoExcelReport } from 'src/reports/excel/producto.report';
// import { Response } from 'express';
// import puppeteer from 'puppeteer';

@Injectable()
export class BasicReportsExcelService {
  constructor(private readonly prisma: PrismaService) {}

  // async generateHtmlToExcelReport(res: Response): Promise<void> {
  //   // Obtener datos de la base de datos
  //   const marcas = await this.prisma.tb_marcas.findMany({
  //     select: {
  //       nombre_marca: true,
  //       estado: true,
  //       created_at: true,
  //     },
  //     orderBy: {
  //       nombre_marca: 'asc',
  //     },
  //   });

  //   const totalMarcas = marcas.length;
  //   const totalActivas = marcas.filter((marca) => marca.estado).length;
  //   const totalInactivas = totalMarcas - totalActivas;

  //   // Generar el HTML dinámicamente
  //   const htmlTemplate = `
  //     <html>
  //       <head>
  //         <style>
  //           table { width: 100%; border-collapse: collapse; }
  //           th, td { border: 1px solid black; padding: 5px; text-align: center; }
  //           th { background-color: #0071AB; color: white; }
  //           td { font-family: Arial, sans-serif; }
  //           .total { font-weight: bold; }
  //         </style>
  //       </head>
  //       <body>
  //         <h2>Reporte de Marcas</h2>
  //         <table>
  //           <tr>
  //             <th>Nombre Marca</th>
  //             <th>Estado</th>
  //             <th>Fecha Creación</th>
  //           </tr>
  //           ${marcas
  //             .map(
  //               (marca) => `
  //             <tr>
  //               <td>${marca.nombre_marca}</td>
  //               <td style="color: ${marca.estado ? 'green' : 'red'};">
  //                 ${marca.estado ? 'Activo' : 'Inactivo'}
  //               </td>
  //               <td>${marca.created_at.toLocaleDateString('es-ES')}</td>
  //             </tr>
  //           `,
  //             )
  //             .join('')}
  //           <tr class="total">
  //             <td>Total</td>
  //             <td>${totalMarcas} (${totalActivas} Activas, ${totalInactivas} Inactivas)</td>
  //             <td>${marcas[0]?.created_at.toLocaleDateString('es-ES') || 'N/A'}</td>
  //           </tr>
  //         </table>
  //       </body>
  //     </html>
  //   `;

  //   // Usar Puppeteer para generar el archivo Excel
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.setContent(htmlTemplate);

  //   // Exportar la tabla a Excel usando ExcelJS
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('Reporte de Marcas');

  //   // Generar encabezados en Excel
  //   worksheet.columns = [
  //     { header: 'Nombre Marca', key: 'nombre', width: 25 },
  //     { header: 'Estado', key: 'estado', width: 25 },
  //     { header: 'Fecha Creación', key: 'fecha', width: 20 },
  //   ];

  //   // Estilo para los encabezados
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: '0071AB' },
  //     };
  //     cell.font = { color: { argb: 'FFFFFF' }, bold: true };
  //   });

  //   // Agregar datos desde la base de datos
  //   marcas.forEach((marca) => {
  //     worksheet.addRow({
  //       nombre: marca.nombre_marca,
  //       estado: marca.estado ? 'Activo' : 'Inactivo',
  //       fecha: marca.created_at.toLocaleDateString('es-ES'),
  //     });
  //   });

  //   // Agregar fila de totales
  //   const totalRow = worksheet.addRow({
  //     nombre: 'Total',
  //     estado: `${totalMarcas} (${totalActivas} Activas, ${totalInactivas} Inactivas)`,
  //     fecha: marcas[0]?.created_at.toLocaleDateString('es-ES') || 'N/A',
  //   });
  //   totalRow.eachCell((cell) => {
  //     cell.font = { bold: true };
  //   });

  //   // Guardar y enviar el archivo Excel
  //   res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Marcas.xlsx');
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   );

  //   await workbook.xlsx.write(res);
  //   await browser.close();
  //   res.end();
  // }

  async getMarcasReportExcel(): Promise<Workbook> {
    try {
      const marcas = await this.prisma.tb_marcas.findMany({
        select: {
          id_marca: true,
          nombre_marca: true,
          estado: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          nombre_marca: 'asc',
        },
      });

      return await getMarcasExcelReport({
        marcas,
      });
    } catch (error) {
      console.error('Error generating Excel:', error);
      throw new Error('Failed to generate Excel report');
    }
  }

  async getProductosReportExcel(): Promise<Workbook> {
    try {
      const productos = await this.prisma.tb_productos.findMany({
        select: {
          nombre_producto: true,
          stock: true,
          precio_compra: true,
          precio_venta: true,
          fecha_ingreso: true,
          estado_produto: true,
          tb_categorias: {
            select: {
              nombre_cat: true,
            },
          },
          tb_marcas: {
            select: {
              nombre_marca: true,
            },
          },
          tb_sucursales: {
            select: {
              nombre_sucursal: true,
            },
          },
          tb_tipo_propietario: {
            select: {
              descripcion: true,
            },
          },
        },
        orderBy: {
          nombre_producto: 'asc',
        },
      });

      return await getProductoExcelReport({ productos });
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  async getCategegoriasExcelReportData(): Promise<Workbook> {
    try {
      const categorias = await this.prisma.tb_categorias.findMany({
        select: {
          id_categoria: true,
          nombre_cat: true,
          estado: true,
          created_at: true,
          updated_at: true,
        },
      });
      return await getCategoriasExcelReport({ categorias });
    } catch (error) {
      throw new Error('Failed to generate PDF report');
    }
  }

  async getComprasReportExcel(): Promise<Workbook> {
    try {
      const compras = await this.prisma.tb_compra.findMany({
        include: {
          tb_proveedores: {
            select: {
              nombre_comercial: true,
            },
          },
          tb_metodo_pago: {
            select: {
              nombre_metodo_pago: true,
            },
          },
        },
        orderBy: {
          fecha_compra: 'desc',
        },
      });

      return await getComprasExcelReport({ compras });
    } catch (error) {
      console.error('Error generating Excel:', error);
      throw new Error('Failed to generate Excel report');
    }
  }
}
