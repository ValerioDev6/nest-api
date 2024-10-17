import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { BufferOptions, CustomTableLayout, TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  },
};
const customTableLayouts: Record<string, CustomTableLayout> = {
  customLayout01: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return i === node.table.headerRows ? 2 : 1;
    },
    vLineWidth: function (i) {
      return 0;
    },
    hLineColor: function (i) {
      return i === 1 ? '#333333' : '#e0e0e0'; // Líneas de un color más oscuro
    },
    paddingLeft: function (i) {
      return 10; // Aumenta el padding izquierdo para más espacio
    },
    paddingRight: function (i, node) {
      return 10; // Aumenta el padding derecho para más espacio
    },
    paddingTop: function () {
      return 6; // Agrega un poco de padding superior
    },
    paddingBottom: function () {
      return 6; // Agrega un poco de padding inferior
    },
    fillColor: function (i, node) {
      if (i === 0) {
        return '#1F3F93'; // Color de fondo más corporativo para el encabezado
      }
      return i % 2 === 0 ? '#f8f8f8' : null; // Alternar color de fondo para filas
    },
    defaultBorder: false, // Elimina el borde por defecto para un aspecto más limpio
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  createPdf(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = { tableLayouts: customTableLayouts },
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}
