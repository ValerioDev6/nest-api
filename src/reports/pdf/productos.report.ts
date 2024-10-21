import { tb_productos as Producto } from "@prisma/client";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { headerSection } from "./sections/header.section";
import { footerSection } from "./sections/footer.section";

interface ReportOpions {
    title?:string;
    subTitle?: string;
    productos: Producto[]
}



export const getProductosReport = ( options: ReportOpions): TDocumentDefinitions => {

    const { title, subTitle, productos} = options;

    return {
        pageOrientation: 'landscape',
        header: headerSection({
            title: title ?? 'Reporte Productos',
            subtitle: subTitle ?? 'Listado Poductos'
        }),
        footer: footerSection,
        content: [
            {
                layout: 'customLayout01',
                table: {
                    headerRows: 1,
                    widths: ['auto', 'auto', 'auto', 'auto'],
                    body: [
                        [
                            { text: 'Producto', style: { bold: true}, color: 'white'},
                            { text: 'Marca', style: { bold: true}, color: 'white'},
                            { text: 'Categoria', style: { bold: true}, color: 'white'},
                            { text: 'Sock', style: { bold: true}, color: 'white'}

                        ],

                        ...productos.map((producto)=> [
                            { text: producto.nombre_producto},
                            { text: producto.stock},
                            { text: producto.estado_produto},

                              { text: producto.nombre_producto}

                        ])
                    ]
                }
            }
        ]
    }


}