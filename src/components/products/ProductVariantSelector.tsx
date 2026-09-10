import React from 'react';
import { ProductVariant } from '../../types/database.types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedColor: string | null;
  selectedSize: string | null;
  onSelectColor: (colorName: string) => void;
  onSelectSize: (size: string) => void;
  compact?: boolean;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize,
  compact = false,
}) => {
  // Extraer colores únicos disponibles
  const colorMap = new Map<string, string>();
  variants.forEach((v) => {
    if (v.color_name && v.color_hex && !colorMap.has(v.color_name)) {
      colorMap.set(v.color_name, v.color_hex);
    }
  });

  const uniqueColors = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));

  // Extraer tallas únicas ordenadas
  const uniqueSizes = Array.from(
    new Set(variants.map((v) => v.size).filter(Boolean) as string[])
  );

  return (
    <div className="select-none space-y-3">
      
      {/* 1. Muestras de Color */}
      {uniqueColors.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9A9791]">
              Color <span className="font-normal normal-case tracking-normal text-[#F2EFE9]">{selectedColor || 'Seleccionar'}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {uniqueColors.map(({ name, hex }) => {
              const isSelected = selectedColor === name;
              const isWhite = hex.toLowerCase() === '#ffffff' || hex.toLowerCase() === '#fff';

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onSelectColor(name)}
                  title={name}
                  aria-label={`Seleccionar color ${name}`}
                    className={`relative flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                    isSelected ? 'ring-1 ring-[#E6D19A] ring-offset-2 ring-offset-[#111111]' : 'hover:ring-1 hover:ring-[#9A9791] hover:ring-offset-1 hover:ring-offset-[#111111]'
                  }`}
                >
                  <span
                    className={`h-full w-full rounded-full ${isWhite ? 'border border-[#D9D6D0]' : ''}`}
                    style={{ backgroundColor: hex }}
                  />
                  {isSelected && (
                    <span className="absolute h-1 w-1 rounded-full bg-[#111111]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Chips de Talla */}
      {uniqueSizes.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9A9791]">
              Talla <span className="font-normal normal-case tracking-normal text-[#F2EFE9]">{selectedSize || 'Seleccionar'}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {uniqueSizes.map((size) => {
              const isSelected = selectedSize === size;

              // Buscar si hay stock disponible para la combinación de color y talla
              const matchingVariant = variants.find((v) => {
                const colorMatches = !selectedColor || v.color_name === selectedColor;
                return colorMatches && v.size === size;
              });

              const isAvailable = matchingVariant ? matchingVariant.is_available && matchingVariant.stock > 0 : true;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => isAvailable && onSelectSize(size)}
                  aria-label={`Talla ${size}${!isAvailable ? ' - Agotada' : ''}`}
                  className={`min-w-[30px] border px-2 py-1 text-[10px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#E6D19A] text-[#111111] border-[#E6D19A]'
                      : isAvailable
                      ? 'bg-transparent text-[#F2EFE9] border-[#383838] hover:border-[#E6D19A]'
                      : 'bg-[#191919] text-[#555555] border-[#252525] line-through cursor-not-allowed opacity-60'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
