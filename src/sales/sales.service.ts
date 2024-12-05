import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}
  async getTotales() {
    const [
      totalProductos,
      totalCategorias,
      totalMarcas,
      totalProveedores,
      totalVentas,
      totalCompras,
      totalUsuarios,
      totalClientes,
      totalSucursales,
    ] = await Promise.all([
      this.prisma.tb_productos.count(),
      this.prisma.tb_categorias.count(),
      this.prisma.tb_marcas.count(),
      this.prisma.tb_proveedores.count(),
      this.prisma.tb_ventas.count(),
      this.prisma.tb_compra.count(),
      this.prisma.tb_personal.count(),
      this.prisma.tb_cliente.count(),
      this.prisma.tb_sucursales.count(),
    ]);

    return {
      totalProductos,
      totalCategorias,
      totalMarcas,
      totalProveedores,
      totalVentas,
      totalCompras,
      totalUsuarios,
      totalClientes,
      totalSucursales,
    };
  }
}
