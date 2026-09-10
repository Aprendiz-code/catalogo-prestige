import React, { useState } from 'react';
import { ProductWithDetails, Category, ProductBadge } from '../../types/database.types';
import { uploadImage } from '../../lib/storage';
import { validateProductForm } from '../../lib/validations';
import {
  Upload,
  Trash2,
  Plus,
  Star,
  X,
  AlertCircle,
  Save,
} from 'lucide-react';

interface ProductFormProps {
  initialData?: ProductWithDetails | null;
  categories: Category[];
  onSave: (productData: Partial<ProductWithDetails>) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || categories[0]?.id || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState<number | string>(initialData?.price || '');
  const [compareAtPrice, setCompareAtPrice] = useState<number | string>(initialData?.compare_at_price || '');
  const [badge, setBadge] = useState<ProductBadge>(initialData?.badge || null);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);

  // Gestión de Imágenes
  const [images, setImages] = useState(
    initialData?.images || [
      {
        id: `temp-img-1`,
        product_id: initialData?.id || '',
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Prenda Principal',
        sort_order: 1,
        is_primary: true,
        created_at: new Date().toISOString(),
      },
    ]
  );

  // Gestión de Variantes
  const [variants, setVariants] = useState(
    initialData?.variants || [
      {
        id: `temp-v-1`,
        product_id: initialData?.id || '',
        color_name: 'Negro Core',
        color_hex: '#111111',
        size: 'M',
        stock: 10,
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  );

  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Subir nueva imagen
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadImage(file, 'products');

      const newImage = {
        id: `temp-img-${Date.now()}`,
        product_id: initialData?.id || '',
        image_url: uploadedUrl,
        alt_text: file.name,
        sort_order: images.length + 1,
        is_primary: images.length === 0,
        created_at: new Date().toISOString(),
      };

      setImages([...images, newImage]);
    } catch (err: any) {
      alert(err.message || 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  // Establecer imagen principal
  const setPrimaryImage = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  };

  // Eliminar imagen
  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
      updated[0].is_primary = true;
    }
    setImages(updated);
  };

  // Agregar variante
  const addVariant = () => {
    const newVariant = {
      id: `temp-v-${Date.now()}`,
      product_id: initialData?.id || '',
      color_name: 'Negro',
      color_hex: '#111111',
      size: 'L',
      stock: 5,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setVariants([...variants, newVariant]);
  };

  // Eliminar variante
  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Submit Form Validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateProductForm({
      name,
      sku,
      price,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    onSave({
      id: initialData?.id,
      name,
      sku,
      category_id: categoryId || null,
      short_description: shortDescription,
      description,
      price: parseFloat(price.toString()),
      compare_at_price: compareAtPrice ? parseFloat(compareAtPrice.toString()) : null,
      currency: 'COP',
      badge,
      is_active: isActive,
      is_featured: isFeatured,
      images,
      variants,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1D1D1D] border border-[#333333] rounded-xs p-6 space-y-6 text-[#F2EFE9]">
      
      {/* Header del Formulario */}
      <div className="flex items-center justify-between border-b border-[#333333] pb-4">
        <div>
          <h2 className="font-editorial-serif font-bold text-xl text-[#E6D19A] uppercase">
            {initialData ? 'EDITAR PRENDA / PRODUCTO' : 'CREAR NUEVA PRENDA DE LUJO'}
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Completa los detalles editoriales y variantes del catálogo.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-[#8C8C8C] hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* 1. Datos Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
            Nombre del Producto *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: HOODIE ESSENTIAL GRAPHITE"
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] px-3 py-2 rounded-xs outline-none"
          />
          {formErrors.name && <span className="text-rose-400 text-[10px]">{formErrors.name}</span>}
        </div>

        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
            Referencia / SKU *
          </label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Ej: PR-H001"
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] px-3 py-2 rounded-xs outline-none font-mono"
          />
          {formErrors.sku && <span className="text-rose-400 text-[10px]">{formErrors.sku}</span>}
        </div>

        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
            Categoría
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] px-3 py-2 rounded-xs outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
            Badge / Estado Especial
          </label>
          <select
            value={badge || ''}
            onChange={(e) => setBadge((e.target.value as ProductBadge) || null)}
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] px-3 py-2 rounded-xs outline-none"
          >
            <option value="">Sin Badge</option>
            <option value="NUEVO">NUEVO</option>
            <option value="OFERTA">OFERTA</option>
            <option value="AGOTADO">AGOTADO</option>
            <option value="EDICIÓN LIMITADA">EDICIÓN LIMITADA</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
            Precio en COP ($) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="159900"
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] px-3 py-2 rounded-xs outline-none font-mono"
          />
          {formErrors.price && <span className="text-rose-400 text-[10px]">{formErrors.price}</span>}
        </div>

        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
            Precio Anterior COP (Para Descuento)
          </label>
          <input
            type="number"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            placeholder="189900"
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] px-3 py-2 rounded-xs outline-none font-mono"
          />
        </div>
      </div>

      {/* 2. Descripciones */}
      <div className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
            Descripción Corta (1 o 2 líneas)
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Hoodie premium de corte relajado, algodón pesado 400g."
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] px-3 py-2 rounded-xs outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
            Descripción Completa
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles sobre tela, lavado, confección y corte..."
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] px-3 py-2 rounded-xs outline-none"
          />
        </div>
      </div>

      {/* 3. Galería de Imágenes */}
      <div className="space-y-3 pt-4 border-t border-[#333333]">
        <div className="flex items-center justify-between">
          <h4 className="font-editorial-serif font-bold text-sm text-[#E6D19A] uppercase">
            GALERÍA DE FOTOGRAFÍAS
          </h4>
          <label className="cursor-pointer bg-[#111111] hover:bg-[#2A2A2A] text-[#E6D19A] border border-[#333333] px-3 py-1.5 rounded-xs font-bold text-xs flex items-center space-x-2">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'SUBIENDO...' : 'SUBIR IMAGEN'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              className={`relative group bg-[#111111] border-2 rounded-xs overflow-hidden h-32 ${
                img.is_primary ? 'border-[#E6D19A]' : 'border-[#333333]'
              }`}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => setPrimaryImage(idx)}
                  className={`p-1.5 rounded-full ${
                    img.is_primary ? 'bg-[#E6D19A] text-[#111111]' : 'bg-[#2A2A2A] text-white hover:text-[#E6D19A]'
                  }`}
                  title="Establecer como foto principal"
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="p-1.5 bg-rose-950 text-rose-300 hover:bg-rose-900 rounded-full"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {img.is_primary && (
                <span className="absolute top-1 left-1 bg-[#E6D19A] text-[#111111] text-[9px] font-bold px-1.5 py-0.5 rounded-xs">
                  PRINCIPAL
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Variantes (Color, HEX, Talla, Stock) */}
      <div className="space-y-3 pt-4 border-t border-[#333333]">
        <div className="flex items-center justify-between">
          <h4 className="font-editorial-serif font-bold text-sm text-[#E6D19A] uppercase">
            VARIANTES (COLORES Y TALLAS)
          </h4>
          <button
            type="button"
            onClick={addVariant}
            className="bg-[#111111] hover:bg-[#2A2A2A] text-[#E6D19A] border border-[#333333] px-3 py-1.5 rounded-xs font-bold text-xs flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>AGREGAR VARIANTE</span>
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {variants.map((v, idx) => (
            <div key={v.id || idx} className="flex items-center gap-2 bg-[#111111] p-2 rounded-xs border border-[#333333]">
              <input
                type="text"
                placeholder="Nombre color"
                value={v.color_name || ''}
                onChange={(e) => {
                  const copy = [...variants];
                  copy[idx].color_name = e.target.value;
                  setVariants(copy);
                }}
                className="w-1/4 bg-[#1D1D1D] border border-[#333333] text-xs px-2 py-1 rounded-xs text-[#F2EFE9]"
              />

              <input
                type="color"
                value={v.color_hex || '#111111'}
                onChange={(e) => {
                  const copy = [...variants];
                  copy[idx].color_hex = e.target.value;
                  setVariants(copy);
                }}
                className="w-8 h-7 bg-transparent border-0 cursor-pointer"
              />

              <input
                type="text"
                placeholder="Talla (S, M, L)"
                value={v.size || ''}
                onChange={(e) => {
                  const copy = [...variants];
                  copy[idx].size = e.target.value;
                  setVariants(copy);
                }}
                className="w-1/5 bg-[#1D1D1D] border border-[#333333] text-xs px-2 py-1 rounded-xs text-[#F2EFE9]"
              />

              <input
                type="number"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) => {
                  const copy = [...variants];
                  copy[idx].stock = parseInt(e.target.value) || 0;
                  copy[idx].is_available = copy[idx].stock > 0;
                  setVariants(copy);
                }}
                className="w-1/6 bg-[#1D1D1D] border border-[#333333] text-xs px-2 py-1 rounded-xs font-mono text-[#F2EFE9]"
              />

              <label className="flex items-center space-x-1 text-[11px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={v.is_available}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[idx].is_available = e.target.checked;
                    setVariants(copy);
                  }}
                  className="accent-[#E6D19A]"
                />
                <span>Disponible</span>
              </label>

              <button
                type="button"
                onClick={() => removeVariant(idx)}
                className="text-rose-400 hover:text-rose-300 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Flags de Estado y Botón de Guardado */}
      <div className="pt-4 border-t border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-[#E6D19A] w-4 h-4"
            />
            <span>Publicado / Activo en el Catálogo</span>
          </label>

          <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-[#E6D19A] w-4 h-4"
            />
            <span>Producto Destacado</span>
          </label>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 sm:w-auto bg-[#111111] hover:bg-[#2A2A2A] text-[#F2EFE9] px-5 py-2.5 rounded-xs text-xs font-bold border border-[#333333]"
          >
            CANCELAR
          </button>

          <button
            type="submit"
            className="w-1/2 sm:w-auto bg-[#E6D19A] hover:bg-[#C9A24D] text-[#111111] px-6 py-2.5 rounded-xs text-xs font-bold tracking-widest flex items-center justify-center space-x-2 transition-transform transform hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>GUARDAR PRODUCTO</span>
          </button>
        </div>
      </div>

    </form>
  );
};
