import React, { useState } from 'react';
import { ProductWithDetails } from '../../types/database.types';
import { formatCOP } from '../../lib/formatters';
import { ProductVariantSelector } from './ProductVariantSelector';
import { X, MessageCircle, Ruler, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductWithDetails | null;
  onClose: () => void;
  whatsappNumber?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  whatsappNumber = '573000000000',
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(
    product.images[0]?.image_url ||
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants[0]?.color_name || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants[0]?.size || null
  );

  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Determinar stock de la variante seleccionada
  const activeVariant = product.variants.find((v) => {
    const colorMatch = !selectedColor || v.color_name === selectedColor;
    const sizeMatch = !selectedSize || v.size === selectedSize;
    return colorMatch && sizeMatch;
  });

  const inStock = activeVariant ? activeVariant.is_available && activeVariant.stock > 0 : true;

  // Generar URL de WhatsApp personalizada
  const message = `Hola PRESTIGE, me interesa consultar/comprar el producto: *${product.name}* (Ref: ${product.sku})${
    selectedColor ? ` en color *${selectedColor}*` : ''
  }${selectedSize ? ` y talla *${selectedSize}*` : ''}. ¿Tienen disponibilidad?`;

  const cleanWhatsappNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/70 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white text-[#171717] rounded-sm border border-[#E6E3DD] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#171717]/80 hover:bg-[#B08D57] text-white hover:text-[#171717] transition-colors"
          aria-label="Cerrar ventana de detalle"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Columna Izquierda: Galería de Imágenes */}
        <div className="md:w-1/2 p-4 bg-[#F8F7F4] flex flex-col justify-between">
            <div className="relative w-full aspect-[4/5] rounded-xs overflow-hidden bg-[#ECEAE5] mb-3">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest px-2.5 py-1 bg-[#E6D19A] text-[#111111] uppercase rounded-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Miniaturas de Galería */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-14 h-16 rounded-xs overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img.image_url ? 'border-[#E6D19A]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Información Detallada del Producto */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-6 overflow-y-auto">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#8C8C8C]">
              <span>Ref: {product.sku}</span>
              {product.category && (
                <span className="text-[#E6D19A] uppercase tracking-wider font-semibold">
                  {product.category.name}
                </span>
              )}
            </div>

            <h2 className="font-editorial-serif font-bold text-2xl md:text-3xl uppercase tracking-[0.04em] text-[#171717] leading-snug">
              {product.name}
            </h2>

            {/* Precio */}
            <div className="flex items-baseline space-x-3 pt-1">
              <span className="text-2xl font-bold font-mono text-[#8E6E40]">
                {formatCOP(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm font-mono text-[#8C8C8C] line-through">
                  {formatCOP(product.compare_at_price)}
                </span>
              )}
            </div>

            <p className="text-xs text-[#6B6B6B] leading-relaxed pt-2 border-t border-[#E6E3DD]">
              {product.description || product.short_description}
            </p>
          </div>

          {/* Variantes (Color y Talla) */}
          <div className="space-y-4 pt-4 border-t border-[#E6E3DD]">
            <ProductVariantSelector
              variants={product.variants}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onSelectColor={setSelectedColor}
              onSelectSize={setSelectedSize}
            />

            {/* Guía de Tallas Modal Toggle */}
            <button
              onClick={() => setShowSizeGuide(!showSizeGuide)}
              className="inline-flex items-center space-x-1.5 text-xs text-[#E6D19A] hover:underline pt-1"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Ver guía de tallas</span>
            </button>
          </div>

          {/* Indicador de Disponibilidad de Inventario */}
          <div className="flex items-center space-x-2 text-xs">
            {inStock ? (
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Disponible para envío inmediato</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-rose-400">
                <AlertCircle className="w-4 h-4" />
                <span>Variante temporalmente agotada</span>
              </div>
            )}
          </div>

          {/* Acciones: Botón Pedir por WhatsApp */}
          <div className="pt-4 border-t border-[#E6E3DD] space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#B08D57] hover:bg-[#8E6E40] text-white font-bold text-xs tracking-widest px-6 py-3.5 rounded-xs flex items-center justify-center space-x-2 transition-transform transform hover:scale-[1.01] shadow-lg"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>CONSULTAR O COMPRAR POR WHATSAPP</span>
            </a>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-[#8C8C8C]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E6D19A]" />
              <span>Garantía de satisfacción y atención personalizada</span>
            </div>
          </div>

        </div>

      </div>

      {/* Modal Guía de Tallas */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#1D1D1D] p-6 rounded-xs max-w-md w-full border border-[#333333] text-[#F2EFE9] space-y-4 relative">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-3 right-3 text-[#8C8C8C] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-editorial-serif font-bold text-lg text-[#E6D19A]">
              GUÍA DE TALLAS PRESTIGE
            </h3>
            <p className="text-xs text-[#8C8C8C]">
              Nuestras prendas de corte Oversize ofrecen un ajuste holgado contemporáneo. Se sugiere tu talla habitual para el fit de la marca.
            </p>
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-[#333333] text-[#E6D19A]">
                  <th className="py-2">Talla</th>
                  <th className="py-2">Pecho (cm)</th>
                  <th className="py-2">Largo (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                <tr><td className="py-2 font-bold">S</td><td>108 - 114</td><td>72</td></tr>
                <tr><td className="py-2 font-bold">M</td><td>114 - 120</td><td>74</td></tr>
                <tr><td className="py-2 font-bold">L</td><td>120 - 126</td><td>76</td></tr>
                <tr><td className="py-2 font-bold">XL</td><td>126 - 132</td><td>78</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
