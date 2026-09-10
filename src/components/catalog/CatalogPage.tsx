import React from 'react';
import { CatalogPageWithProducts, ProductWithDetails } from '../../types/database.types';
import { ProductGrid } from './ProductGrid';

interface CatalogPageProps {
  page: CatalogPageWithProducts;
  currentPageNumber: number;
  totalPagesCount: number;
  onSelectProduct: (product: ProductWithDetails) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  page,
  currentPageNumber,
  totalPagesCount,
  onSelectProduct,
}) => {
  return (
    <section className="relative mx-auto flex min-h-[720px] w-full max-w-6xl flex-col justify-between bg-white px-4 py-8 text-[#171717] shadow-[0_16px_44px_rgba(23,23,23,0.07)] sm:px-6 md:px-10 md:py-10">
      
      {/* 1. Header de la Página del Catálogo */}
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-[#E6E3DD] pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#B08D57]">
            Catálogo / Sección {String(page.page_number).padStart(2, '0')}
          </div>
          <h2 className="font-editorial-serif text-3xl font-semibold uppercase leading-none tracking-[0.08em] text-[#171717] sm:text-4xl">
            {page.title || `SELECCIÓN ${page.page_number}`}
          </h2>
          {page.subtitle && (
            <p className="mt-2 text-[11px] text-[#6B6B6B]">
              {page.subtitle}
            </p>
          )}
        </div>

        <div className="hidden sm:block text-right">
          <span className="font-editorial-serif text-xl tracking-[0.18em] text-[#B08D57]">
            PRESTIGE
          </span>
        </div>
      </div>

      {/* 2. Lienzo Principal de 3 Productos */}
      <div className="my-2 flex-1 items-center">
        <ProductGrid products={page.products} onSelectProduct={onSelectProduct} />
      </div>

      {/* 3. Pie de Página del Catálogo */}
      <div className="mt-8 flex items-center justify-between border-t border-[#E6E3DD] pt-4 text-xs text-[#6B6B6B]">
        <span className="text-[10px] uppercase tracking-[0.12em] text-[#8C8A84]">
          www.prestigecol.online
        </span>

        {/* Indicador de Número de Página Editorial */}
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-[#B08D57]" />
          <span className="font-editorial-serif text-sm tracking-widest text-[#8E6E40]">
            {currentPageNumber} / {totalPagesCount}
          </span>
          <span className="h-px w-6 bg-[#B08D57]" />
        </div>

        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C8A84]">
          MODA DE LUJO
        </span>
      </div>

    </section>
  );
};
