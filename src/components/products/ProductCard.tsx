import React, { useState } from 'react';
import { ProductWithDetails } from '../../types/database.types';
import { formatCOP, truncateText } from '../../lib/formatters';
import { ProductVariantSelector } from './ProductVariantSelector';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithDetails;
  onSelect: (product: ProductWithDetails) => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  compact = false,
}) => {
  const primaryImage = product.images.find((img) => img.is_primary)?.image_url ||
    product.images[0]?.image_url ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';

  const secondaryImage = product.images[1]?.image_url;

  const [currentImage, setCurrentImage] = useState(primaryImage);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants[0]?.color_name || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants[0]?.size || null
  );

  const isAccessory = product.category?.slug.includes('accesorios') || product.category?.name.toLowerCase().includes('gorras');
  const aspectRatioClass = isAccessory ? 'aspect-square' : 'aspect-[4/5]';

  return (
    <article className="group relative flex h-full flex-col border-t border-[#E6E3DD] pt-3">
      
      <div
        className={`relative w-full ${aspectRatioClass} overflow-hidden bg-[#F0EEE9] cursor-pointer`}
        onClick={() => onSelect(product)}
        onMouseEnter={() => secondaryImage && setCurrentImage(secondaryImage)}
        onMouseLeave={() => setCurrentImage(primaryImage)}
      >
        <img
          src={currentImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />

        {product.badge && (
          <div className="absolute left-3 top-3 z-10 bg-[#F2EFE9] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#111111]">
            {product.badge}
          </div>
        )}

      </div>

      <div className="flex flex-1 flex-col justify-between pt-4">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9A9791]">
            <span>{product.category?.name || 'PRESTIGE'}</span>
            <span className="font-mono font-normal tracking-normal">{product.sku}</span>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="cursor-pointer font-editorial-serif text-xl font-semibold uppercase leading-tight tracking-[0.04em] text-[#171717] transition-colors group-hover:text-[#8E6E40]"
          >
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-2 max-w-[28ch] text-[11px] leading-relaxed text-[#9A9791]">
            {truncateText(product.short_description || product.description, 75)}
          </p>
        </div>

        {product.variants && product.variants.length > 0 && (
          <div className="mt-5 border-t border-[#E6E3DD] pt-3">
            <ProductVariantSelector
              variants={product.variants}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onSelectColor={setSelectedColor}
              onSelectSize={setSelectedSize}
              compact={compact}
            />
          </div>
        )}

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#E6E3DD] pt-3">
          <div>
            <div className="font-mono text-sm font-semibold text-[#8E6E40]">
              {formatCOP(product.price)}
            </div>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <div className="font-mono text-[10px] text-[#9A9791] line-through">
                {formatCOP(product.compare_at_price)}
              </div>
            )}
          </div>

          <button
            onClick={() => onSelect(product)}
            className="inline-flex items-center gap-1 border-b border-[#B08D57] pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#171717] transition-colors hover:text-[#8E6E40]"
          >
            Ver pieza
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>

      </div>

    </article>
  );
};
