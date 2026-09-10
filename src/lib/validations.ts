export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateProductForm = (data: {
  name: string;
  sku: string;
  price: number | string;
  category_id?: string;
  short_description?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'El nombre del producto debe tener al menos 3 caracteres.';
  }

  if (!data.sku || data.sku.trim().length < 2) {
    errors.sku = 'La referencia / SKU es obligatoria.';
  }

  const numPrice = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
  if (isNaN(numPrice) || numPrice < 0) {
    errors.price = 'El precio debe ser un número mayor o igual a 0.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCategoryForm = (data: { name: string }): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'El nombre de la categoría es obligatorio.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
