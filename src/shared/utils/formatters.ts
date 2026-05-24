/**
 * Formatea un número como moneda sin mostrar decimales innecesarios
 * y con separadores de miles
 * Ejemplos:
 * - 15500.00 -> $15,500
 * - 7750.50 -> $7,750.50
 * - 1000000 -> $1,000,000
 * - 100.00 -> $100
 */
export const formatearMoneda = (valor: number): string => {
  // Si el valor tiene decimales significativos, mostrarlos
  if (valor % 1 !== 0) {
    return `$${valor.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
  // Si es un número entero, no mostrar decimales pero sí separadores de miles
  return `$${Math.round(valor).toLocaleString('en-US')}`;
};

/**
 * Formatea un número sin el símbolo de moneda
 */
export const formatearNumero = (valor: number): string => {
  if (valor % 1 !== 0) {
    return valor.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }
  return Math.round(valor).toLocaleString('en-US');
};

/**
 * Formatea un porcentaje
 */
export const formatearPorcentaje = (valor: number): string => {
  return `${valor > 0 ? '+' : ''}${valor.toFixed(1)}%`;
};
