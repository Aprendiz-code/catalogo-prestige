import React, { useState } from 'react';
import { CatalogPageWithProducts, ProductWithDetails } from '../../types/database.types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  BookOpen,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface CatalogPageManagerProps {
  pages: CatalogPageWithProducts[];
  allProducts: ProductWithDetails[];
  onSavePage: (page: Partial<CatalogPageWithProducts>) => void;
  onDeletePage: (pageId: string) => void;
}

export const CatalogPageManager: React.FC<CatalogPageManagerProps> = ({
  pages,
  allProducts,
  onSavePage,
  onDeletePage,
}) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Crear nueva página vacía
  const handleCreateNewPage = () => {
    const nextNumber = pages.length + 1;
    onSavePage({
      id: `page-temp-${Date.now()}`,
      page_number: nextNumber,
      title: `SECCIÓN EDITORIAL ${nextNumber}`,
      subtitle: 'Selecciona las 3 prendas exclusivas para esta página.',
      layout_type: 'three-products',
      is_published: true,
      products: [],
    });
  };

  // Asignar producto a una posición (1, 2 o 3) de la página
  const handleAssignProduct = (
    page: CatalogPageWithProducts,
    positionIndex: number,
    productId: string
  ) => {
    const targetProduct = allProducts.find((p) => p.id === productId);
    const updatedProducts = [...page.products];

    if (targetProduct) {
      updatedProducts[positionIndex] = targetProduct;
    } else {
      updatedProducts.splice(positionIndex, 1);
    }

    onSavePage({
      ...page,
      products: updatedProducts.filter(Boolean),
    });
  };

  return (
    <div className="space-y-6 text-[#F2EFE9]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1D1D1D] p-5 rounded-xs border border-[#333333]">
        <div>
          <h2 className="font-editorial-serif font-bold text-xl text-[#E6D19A] uppercase">
            ORGANIZADOR DE PÁGINAS EDITORIALES (FLIPBOOK)
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Garantiza que cada página contenga exactamente 3 productos para la maquetación.
          </p>
        </div>

        <button
          onClick={handleCreateNewPage}
          className="inline-flex items-center space-x-2 bg-[#E6D19A] hover:bg-[#C9A24D] text-[#111111] font-bold text-xs tracking-widest px-5 py-2.5 rounded-xs transition-transform transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>AGREGAR PÁGINA (3 PRODUCTOS)</span>
        </button>
      </div>

      {/* Lista de Páginas */}
      <div className="space-y-6">
        {pages.map((page, pIdx) => {
          const productCount = page.products.length;
          const isExactThree = productCount === 3;

          return (
            <div
              key={page.id}
              className={`bg-[#1D1D1D] border rounded-xs p-5 space-y-4 shadow-xl transition-all ${
                isExactThree ? 'border-[#333333]' : 'border-amber-500/80 bg-amber-950/10'
              }`}
            >
              {/* Header de la Página */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#333333] pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-editorial-serif text-lg font-bold text-[#E6D19A] bg-[#111111] px-3 py-1 border border-[#E6D19A]/40 rounded-xs">
                    PÁGINA {page.page_number}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={page.title || ''}
                      onChange={(e) => onSavePage({ ...page, title: e.target.value })}
                      placeholder="Título de la sección..."
                      className="bg-transparent font-editorial-serif font-bold text-base text-[#F2EFE9] border-b border-transparent focus:border-[#E6D19A] outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  {/* Badge de Advertencia si no son 3 productos */}
                  {!isExactThree && (
                    <div className="inline-flex items-center space-x-1.5 bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1 rounded-xs font-bold text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{productCount} / 3 productos (Faltan {3 - productCount})</span>
                    </div>
                  )}

                  <label className="flex items-center space-x-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={page.is_published}
                      onChange={(e) => onSavePage({ ...page, is_published: e.target.checked })}
                      className="accent-[#E6D19A]"
                    />
                    <span>Publicada</span>
                  </label>

                  <button
                    onClick={() => setDeleteTargetId(page.id)}
                    className="p-1.5 hover:bg-rose-950 text-[#8C8C8C] hover:text-rose-400 rounded-xs"
                    title="Eliminar Página"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtítulo editable */}
              <div>
                <input
                  type="text"
                  value={page.subtitle || ''}
                  onChange={(e) => onSavePage({ ...page, subtitle: e.target.value })}
                  placeholder="Subtítulo de la página editorial..."
                  className="w-full bg-[#111111] border border-[#333333] text-xs text-[#8C8C8C] px-3 py-1.5 rounded-xs outline-none"
                />
              </div>

              {/* Asignación de 3 Ranuras de Producto */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[0, 1, 2].map((slotIdx) => {
                  const currentProduct = page.products[slotIdx];

                  return (
                    <div
                      key={slotIdx}
                      className="bg-[#111111] border border-[#333333] p-3 rounded-xs flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#E6D19A] border-b border-[#2A2A2A] pb-1">
                        <span>POSICIÓN {slotIdx + 1}</span>
                        {currentProduct ? (
                          <span className="text-emerald-400 font-bold">ASIGNADO</span>
                        ) : (
                          <span className="text-rose-400 font-bold">VACÍO</span>
                        )}
                      </div>

                      <select
                        value={currentProduct?.id || ''}
                        onChange={(e) => handleAssignProduct(page, slotIdx, e.target.value)}
                        className="w-full bg-[#1D1D1D] border border-[#333333] focus:border-[#E6D19A] text-xs text-[#F2EFE9] p-2 rounded-xs outline-none"
                      >
                        <option value="">-- Seleccionar Prenda --</option>
                        {allProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.sku}] {p.name} - ${p.price.toLocaleString()} COP
                          </option>
                        ))}
                      </select>

                      {currentProduct && (
                        <div className="flex items-center space-x-2 text-xs pt-1">
                          <img
                            src={
                              currentProduct.images[0]?.image_url ||
                              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80'
                            }
                            alt=""
                            className="w-8 h-10 object-cover rounded-xs"
                          />
                          <div className="truncate">
                            <div className="font-bold truncate text-[#F2EFE9]">{currentProduct.name}</div>
                            <div className="text-[10px] text-[#8C8C8C]">Ref: {currentProduct.sku}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Diálogo de Confirmación */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="¿Eliminar esta página de catálogo?"
        message="La página será removida del orden del flipbook publicable."
        confirmText="Eliminar Página"
        cancelText="Cancelar"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeletePage(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />

    </div>
  );
};
