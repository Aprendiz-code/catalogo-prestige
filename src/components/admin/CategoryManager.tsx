import React, { useState } from 'react';
import { Category } from '../../types/database.types';
import { generateSlug } from '../../lib/formatters';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FolderTree, Plus, Trash2, Edit, X } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onSaveCategory: (category: Partial<Category>) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleStartNew = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      sort_order: categories.length + 1,
      is_active: true,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    onSaveCategory({
      ...editingCategory,
      slug: editingCategory.slug || generateSlug(editingCategory.name),
    });

    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 text-[#F2EFE9]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1D1D1D] p-5 rounded-xs border border-[#333333]">
        <div>
          <h2 className="font-editorial-serif font-bold text-xl text-[#E6D19A] uppercase">
            GESTIÓN DE CATEGORÍAS
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Administra las colecciones del catálogo urbano (Camisetas, Hoodies, Chaquetas, etc.)
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="inline-flex items-center space-x-2 bg-[#E6D19A] hover:bg-[#C9A24D] text-[#111111] font-bold text-xs tracking-widest px-5 py-2.5 rounded-xs transition-transform transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVA CATEGORÍA</span>
        </button>
      </div>

      {/* Formulario Inline de Edición / Creación */}
      {editingCategory && (
        <form onSubmit={handleSave} className="bg-[#1D1D1D] border border-[#E6D19A] p-5 rounded-xs space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#333333] pb-2">
            <h3 className="font-editorial-serif font-bold text-sm text-[#E6D19A] uppercase">
              {editingCategory.id ? 'EDITAR CATEGORÍA' : 'CREAR CATEGORÍA'}
            </h3>
            <button type="button" onClick={() => setEditingCategory(null)} className="text-[#8C8C8C] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px] mb-1">Nombre</label>
              <input
                type="text"
                value={editingCategory.name || ''}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }
                placeholder="Ej: Camisetas Oversize"
                className="w-full bg-[#111111] border border-[#333333] text-[#F2EFE9] p-2 rounded-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px] mb-1">Slug URL</label>
              <input
                type="text"
                value={editingCategory.slug || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                className="w-full bg-[#111111] border border-[#333333] text-[#8C8C8C] p-2 rounded-xs outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px] mb-1">Descripción</label>
            <input
              type="text"
              value={editingCategory.description || ''}
              onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
              placeholder="Descripción corta para la categoría..."
              className="w-full bg-[#111111] border border-[#333333] text-xs text-[#F2EFE9] p-2 rounded-xs outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="bg-[#111111] text-[#F2EFE9] px-4 py-2 text-xs font-bold rounded-xs border border-[#333333]"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="bg-[#E6D19A] text-[#111111] px-5 py-2 text-xs font-bold tracking-widest rounded-xs"
            >
              GUARDAR
            </button>
          </div>
        </form>
      )}

      {/* Rejilla de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-[#1D1D1D] border border-[#333333] p-4 rounded-xs flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xs bg-[#111111] border border-[#333333] overflow-hidden flex-shrink-0">
                {cat.image_url ? (
                  <img src={cat.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FolderTree className="w-6 h-6 m-3 text-[#E6D19A]" />
                )}
              </div>
              <div>
                <h4 className="font-editorial-serif font-bold text-sm text-[#F2EFE9]">{cat.name}</h4>
                <span className="text-[10px] font-mono text-[#8C8C8C]">/{cat.slug}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingCategory(cat)}
                className="p-1.5 hover:bg-[#111111] text-[#8C8C8C] hover:text-[#E6D19A] rounded-xs"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTargetId(cat.id)}
                className="p-1.5 hover:bg-rose-950 text-[#8C8C8C] hover:text-rose-400 rounded-xs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="¿Eliminar categoría?"
        message="Las prendas asociadas quedarán clasificadas sin categoría."
        confirmText="Eliminar Categoría"
        cancelText="Cancelar"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteCategory(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />

    </div>
  );
};
