import React from 'react';
import { Category, ProductFilterParams } from '../../types/database.types';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  categories: Category[];
  filters: ProductFilterParams;
  onFilterChange: (newFilters: ProductFilterParams) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mb-6 glass-panel p-5 rounded-xs border border-[#E6E3DD] text-[#171717] space-y-4 shadow-xl">
      
      {/* Header Filtros */}
      <div className="flex items-center justify-between border-b border-[#E6E3DD] pb-3">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-[#B08D57]" />
          <h3 className="font-editorial-serif font-bold text-lg text-[#8E6E40] uppercase tracking-wider">
            FILTROS Y BÚSQUEDA DEL CATÁLOGO
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-1 text-xs text-[#8C8C8C] hover:text-[#E6D19A] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
          <button
            onClick={onClose}
            className="text-[#8C8C8C] hover:text-white"
            aria-label="Cerrar panel de filtros"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Rejilla de Inputs de Filtro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        
        {/* 1. Buscador por Nombre o SKU */}
        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase tracking-wider text-[11px]">
            Buscador
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8C8C8C]" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full bg-[#F8F7F4] border border-[#E6E3DD] focus:border-[#B08D57] text-[#171717] pl-9 pr-3 py-2 rounded-xs outline-none"
            />
          </div>
        </div>

        {/* 2. Filtro por Categoría */}
        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase tracking-wider text-[11px]">
            Categoría
          </label>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => onFilterChange({ ...filters, categoryId: e.target.value || undefined })}
            className="w-full bg-[#F8F7F4] border border-[#E6E3DD] focus:border-[#B08D57] text-[#171717] px-3 py-2 rounded-xs outline-none"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Filtro por Talla */}
        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase tracking-wider text-[11px]">
            Talla
          </label>
          <select
            value={filters.size || ''}
            onChange={(e) => onFilterChange({ ...filters, size: e.target.value || undefined })}
            className="w-full bg-[#F8F7F4] border border-[#E6E3DD] focus:border-[#B08D57] text-[#171717] px-3 py-2 rounded-xs outline-none"
          >
            <option value="">Todas las tallas</option>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', 'Única'].map((sz) => (
              <option key={sz} value={sz}>
                Talla {sz}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Ordenar Por */}
        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase tracking-wider text-[11px]">
            Ordenar por
          </label>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as ProductFilterParams['sortBy'],
              })
            }
            className="w-full bg-[#F8F7F4] border border-[#E6E3DD] focus:border-[#B08D57] text-[#171717] px-3 py-2 rounded-xs outline-none font-medium"
          >
            <option value="newest">Novedades y Relevancia</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
            <option value="name_asc">Nombre A-Z</option>
          </select>
        </div>

      </div>

    </div>
  );
};
