import React, { useState, useMemo } from 'react';
import {
  CatalogSettings,
  CatalogPageWithProducts,
  ProductWithDetails,
  Category,
  ProductFilterParams,
} from '../types/database.types';
import { BrandLogo } from '../components/brand/BrandLogo';
import { FlipbookViewer } from '../components/catalog/FlipbookViewer';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { EmptyState } from '../components/common/EmptyState';
import { SlidersHorizontal, Lock } from 'lucide-react';

interface CatalogViewPageProps {
  settings: CatalogSettings;
  pages: CatalogPageWithProducts[];
  products: ProductWithDetails[];
  categories: Category[];
  onOpenAdmin: () => void;
}

export const CatalogViewPage: React.FC<CatalogViewPageProps> = ({
  settings,
  pages,
  products,
  categories,
  onOpenAdmin,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithDetails | null>(null);
  const [filters, setFilters] = useState<ProductFilterParams>({
    sortBy: 'newest',
  });

  // Filtrar todos los productos según parámetros de búsqueda
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // 1. Buscador por nombre o SKU
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesSku = prod.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesSku) return false;
      }

      // 2. Filtro por Categoría
      if (filters.categoryId && prod.category_id !== filters.categoryId) {
        return false;
      }

      // 3. Filtro por Talla
      if (filters.size) {
        const hasSize = prod.variants.some((v) => v.size === filters.size && v.is_available);
        if (!hasSize) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [products, filters]);

  // Si hay filtros activos, reagrupar dinámicamente en páginas de exactamente 3 productos
  const displayPages = useMemo(() => {
    const hasActiveFilters = Boolean(filters.search || filters.categoryId || filters.size);
    if (!hasActiveFilters) {
      return pages;
    }

    // Dividir productos filtrados en bloques de 3
    const chunks: CatalogPageWithProducts[] = [];
    for (let i = 0; i < filteredProducts.length; i += 3) {
      const pageProducts = filteredProducts.slice(i, i + 3);
      const pageNum = Math.floor(i / 3) + 1;
      chunks.push({
        id: `filter-page-${pageNum}`,
        page_number: pageNum,
        title: `RESULTADOS DE BÚSQUEDA (${pageNum})`,
        subtitle: `Mostrando prendas filtradas del catálogo PRESTIGE`,
        layout_type: 'three-products',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        products: pageProducts,
      });
    }
    return chunks;
  }, [pages, filteredProducts, filters]);

  const handleResetFilters = () => {
    setFilters({ sortBy: 'newest' });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#171717] flex flex-col justify-between selection:bg-[#B08D57] selection:text-white">
      
      {/* 1. Header de Navegación Público */}
      <header className="sticky top-0 z-30 border-b border-[#E6E3DD] bg-[#F8F7F4]/95 px-4 py-5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <BrandLogo size="sm" />

          {/* Categorías Rápidas en Escritorio */}
          <nav className="hidden items-center gap-6 text-[10px] font-semibold uppercase tracking-[0.16em] md:flex">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFilters({ ...filters, categoryId: cat.id });
                  setShowFilters(true);
                }}
                className={`border-b pb-1 transition-colors hover:text-[#8E6E40] ${
                  filters.categoryId === cat.id ? 'border-[#B08D57] text-[#8E6E40] font-bold' : 'border-transparent text-[#6B6B6B]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>

          {/* Acciones de la Cabecera */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border-b border-[#B08D57] p-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E6E40] transition-colors hover:text-[#171717]"
              aria-label="Buscar y filtrar"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">FILTRAR</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#6B6B6B] transition-colors hover:text-[#8E6E40]"
              title="Acceso Administración"
              aria-label="Acceso administrador"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Panel Flotante de Filtros */}
      <ProductFilters
        categories={categories}
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* 3. Flipbook Viewer Principal */}
      <main className="flex-1 max-w-6xl mx-auto w-full py-4">
        {displayPages.length === 0 ? (
          <EmptyState onReset={handleResetFilters} />
        ) : (
          <FlipbookViewer
            settings={settings}
            pages={displayPages}
            onSelectProduct={setSelectedProduct}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        )}
      </main>

      {/* 4. Modal de Detalle de Producto */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        whatsappNumber={settings.whatsapp_url || '573000000000'}
      />

      {/* 5. Pie de Página */}
      <footer className="bg-[#171717] border-t border-[#2A2A2A] py-10 px-4 text-center text-xs text-[#BDB8AF] space-y-4">
        <div className="flex items-center justify-center space-x-6 text-[#D6B77A]">
          {settings.instagram_url && (
            <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:underline">
              Instagram
            </a>
          )}
          {settings.tiktok_url && (
            <a href={settings.tiktok_url} target="_blank" rel="noreferrer" className="hover:underline">
              TikTok
            </a>
          )}
          {settings.website_url && (
            <a href={settings.website_url} target="_blank" rel="noreferrer" className="hover:underline">
              Sitio Web
            </a>
          )}
        </div>
        <p className="text-[10px] uppercase tracking-[0.16em]">
          © {new Date().getFullYear()} PRESTIGE — Moda de Lujo. Todos los derechos reservados.
        </p>
      </footer>

    </div>
  );
};
