export class CurrencyFormatter {
  static formatCurrency(value: number | null | undefined): string {
    // Maneja valores nulos o undefined
    if (value == null) return 'S/ 0.00';

    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN', // Cambia PE por PEN
    }).format(value);
  }
}
