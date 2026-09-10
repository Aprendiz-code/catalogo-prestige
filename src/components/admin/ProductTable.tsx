import React, { useState } from 'react';
import { ProductWithDetails, Category } from '../../types/database.types';
import { formatCOP } from '../../lib/formatters';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react';

interface ProductTableProps {
  products: ProductWithDetails[];
  categories: Category[];
  onCreateProduct: () => void;
  onEditProduct: (product: ProductWithDetails) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleActive: (productId: string, currentStatus: boolean) => void;
  onToggleFeatured: (productId: string, currentStatus: boolean) => void;
  onPreviewProduct: (product: ProductWithDetails) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  categories,
  onCreateProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleActive,
  onToggleFeatured,
  onPreviewProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filtrado de productos
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? prod.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Header de Acción y Búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1D1D1D] p-5 rounded-xs border border-[#333333]">
        <div>
          <h2 className="font-editorial-serif font-bold text-xl text-[#E6D19A] tracking-wide uppercase">
            GESTIÓN DE PRODUCTOS
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Total: {products.length} productos registrados en el catálogo
          </p>
        </div>

        <button
          onClick={onCreateProduct}
          className="inline-flex items-center space-x-2 bg-white hover:bg-[#F0EEE9] text-[#111111] font-bold text-xs tracking-widest px-5 py-2.5 rounded-xs transition-transform transform hover:scale-[1.02] shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>CREAR NUEVO PRODUCTO</span>
        </button>
      </div>

      {/* 2. Filtros de Tabla */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1D1D1D] p-4 rounded-xs border border-[#333333]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8C8C8C]" />
          <input
            type="text"
            placeholder="Filtrar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] text-xs pl-9 pr-3 py-2 rounded-xs outline-none"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] text-xs px-3 py-2 rounded-xs outline-none"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Tabla de Productos */}
      <div className="bg-[#1D1D1D] border border-[#333333] rounded-xs overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs text-[#F2EFE9]">
          <thead className="bg-[#111111] text-[#E6D19A] font-mono border-b border-[#333333] uppercase text-[11px]">
            <tr>
              <th className="py-3 px-4">Prenda</th>
              <th className="py-3 px-4">SKU / Ref</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Precio COP</th>
              <th className="py-3 px-4">Badge</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center">Destacado</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#8C8C8C]">
                  No hay productos que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const primaryImage =
                  product.images.find((img) => img.is_primary)?.image_url ||
                  product.images[0]?.image_url ||
                  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80';

                return (
                  <tr key={product.id} className="hover:bg-[#252525] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className="w-10 h-12 object-cover rounded-xs border border-[#333333]"
                        />
                        <span className="font-editorial-serif font-bold text-sm text-[#F2EFE9] line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[#8C8C8C]">
                      {product.sku}
                    </td>

                    <td className="py-3 px-4 text-[#D9D6D0]">
                      {product.category?.name || 'Sin categoría'}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#E6D19A]">
                      {formatCOP(product.price)}
                    </td>

                    <td className="py-3 px-4">
                      {product.badge ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#111111] text-[#E6D19A] border border-[#E6D19A]/40 rounded-xs uppercase">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-[#555555]">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleActive(product.id, product.is_active)}
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-xs text-[10px] font-bold ${
                          product.is_active
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {product.is_active ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>ACTIVO</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>OCULTO</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleFeatured(product.id, product.is_featured)}
                        className={`p-1.5 rounded-full transition-colors ${
                          product.is_featured ? 'text-[#E6D19A]' : 'text-[#555555] hover:text-[#E6D19A]'
                        }`}
                        title={product.is_featured ? 'Destacado' : 'Marcar como destacado'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onPreviewProduct(product)}
                          className="p-1.5 hover:bg-[#111111] text-[#8C8C8C] hover:text-[#E6D19A] rounded-xs"
                          title="Previsualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-1.5 hover:bg-[#111111] text-[#8C8C8C] hover:text-[#E6D19A] rounded-xs"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(product.id)}
                          className="p-1.5 hover:bg-rose-950 text-[#8C8C8C] hover:text-rose-400 rounded-xs"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="¿Eliminar producto del catálogo?"
        message="Esta acción no se puede deshacer. Se eliminarán permanentemente las imágenes y variantes asociadas."
        confirmText="Eliminar permanentemente"
        cancelText="Cancelar"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteProduct(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />

    </div>
  );
};
