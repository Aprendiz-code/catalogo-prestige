/**
 * Formatea valores numéricos en Pesos Colombianos (COP)
 * Ejemplo: 159900 -> "$ 159.900 COP" o "$ 159.900"
 */
export const formatCOP = (amount: number, includeCurrencyCode = true): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$ 0';
  }
  
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return includeCurrencyCode ? `${formatted} COP` : formatted;
};

/**
 * Normaliza y trunca texto si excede la longitud deseada
 */
export const truncateText = (text: string | null | undefined, maxLength: number = 80): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

/**
 * Genera un slug seguro a partir de un título
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};
