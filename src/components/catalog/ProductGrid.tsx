import React from 'react';
import { ProductWithDetails } from '../../types/database.types';
import { ProductCard } from '../products/ProductCard';

interface ProductGridProps {
  products: ProductWithDetails[];
  onSelectProduct: (product: ProductWithDetails) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
}) => {
  const displayProducts = products.slice(0, 3);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
        {displayProducts.map((product) => (
          <div key={product.id} className="flex flex-col h-full">
            <ProductCard product={product} onSelect={onSelectProduct} />
          </div>
        ))}

      </div>
    </div>
  );
};
