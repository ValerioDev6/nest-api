import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
export interface RawMonthlyVentas {
  mes: bigint;
  total_ventas: bigint;
  numero_ventas: bigint;
}

export interface MonthlyVentas {
  mes: number;
  total_ventas: number;
  numero_ventas: number;
}
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

  async getVentasDiasSemanaMes() {
    try {
      // Obtener la fecha actual en Lima
      const now = new Date().toLocaleString('en-US', { timeZone: 'America/Lima' });
      const currentDate = new Date(now);

      // Ventas del día
      const ventasHoy = await this.prisma.$queryRaw`
        SELECT 
          COUNT(id_venta) as total_ventas, 
          COALESCE(SUM(precio_total), 0) as monto_total
        FROM tb_ventas
        WHERE DATE(created_at) = CURRENT_DATE
        AND estado_venta = 'COMPLETADA'
      `;

      // Ventas de la semana
      const ventasSemana = await this.prisma.$queryRaw`
        SELECT 
          COALESCE(SUM(precio_total), 0) as monto_total
        FROM tb_ventas
        WHERE 
          YEARWEEK(created_at) = YEARWEEK(CURRENT_DATE)
          AND estado_venta = 'COMPLETADA'
      `;

      // Ventas del mes
      const ventasMes = await this.prisma.$queryRaw`
        SELECT 
          COALESCE(SUM(precio_total), 0) as monto_total
        FROM tb_ventas
        WHERE 
          YEAR(created_at) = YEAR(CURRENT_DATE)
          AND MONTH(created_at) = MONTH(CURRENT_DATE)
          AND estado_venta = 'COMPLETADA'
      `;

      return {
        ventas_hoy: {
          total_ventas: Number(ventasHoy[0]?.total_ventas || 0),
          monto_total: Number(ventasHoy[0]?.monto_total || 0),
        },
        ventas_semana: {
          monto_total: Number(ventasSemana[0]?.monto_total || 0),
        },
        ventas_mes: {
          monto_total: Number(ventasMes[0]?.monto_total || 0),
        },
      };
    } catch (error) {
      console.error('Error en getVentasDiasSemanaMes:', error);
      throw error;
    }
  }

  async obtenerVentasMensuales(): Promise<MonthlyVentas[]> {
    const ventasMensuales = await this.prisma.$queryRaw<RawMonthlyVentas[]>`
      SELECT 
        MONTH(created_at) as mes,
        COALESCE(SUM(precio_total), 0) as total_ventas,
        COUNT(*) as numero_ventas
        FROM 
      tb_ventas
        GROUP BY 
          MONTH(created_at)
        ORDER BY 
          mes
    `;

    const mesesCompletos: MonthlyVentas[] = Array.from({ length: 12 }, (_, i) => {
      const mesExistente = ventasMensuales.find((m) => Number(m.mes) === i + 1);

      return {
        mes: i + 1,
        total_ventas: mesExistente ? Number(mesExistente.total_ventas) : 0,
        numero_ventas: mesExistente ? Number(mesExistente.numero_ventas) : 0,
      };
    });

    return mesesCompletos;
  }

  async obtenerComprasDiezDias() {
    try {
      // Obtener la fecha actual
      const fechaActual = new Date();

      // Arreglo para almacenar los resultados
      const resultados = [];

      // Iterar para obtener los totales de los últimos 10 días
      for (let i = 0; i < 10; i++) {
        // Calcular la fecha para cada día
        const fecha = new Date(fechaActual);
        fecha.setDate(fechaActual.getDate() - i);

        // Establecer el inicio y fin del día
        const inicioDelDia = new Date(fecha);
        inicioDelDia.setHours(0, 0, 0, 0);

        const finDelDia = new Date(fecha);
        finDelDia.setHours(23, 59, 59, 999);

        // Consultar el total de compras para ese día
        const totalComprasDia = await this.prisma.tb_compra.aggregate({
          _sum: {
            compra_total: true,
          },
          where: {
            fecha_compra: {
              gte: inicioDelDia,
              lte: finDelDia,
            },
          },
        });

        // Formatear la fecha para mostrar solo la fecha
        const fechaFormateada = fecha.toISOString().split('T')[0];

        // Agregar al resultado
        resultados.push({
          dia: fechaFormateada,
          total: totalComprasDia._sum.compra_total || 0,
        });
      }

      return resultados;
    } catch (error) {
      console.error('Error al obtener las compras de los últimos 10 días:', error);
      throw new Error('No se pudieron recuperar las compras');
    }
  }
}
