export type Role = 'admin' | 'editor';

export type ProductBadge = 'NUEVO' | 'OFERTA' | 'AGOTADO' | 'EDICIÓN LIMITADA' | null;

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface CatalogSettings {
  id: string;
  brand_name: string;
  brand_subtitle: string;
  hero_title: string;
  hero_description: string | null;
  season_label: string | null;
  hero_image_url: string | null;
  logo_url: string | null;
  whatsapp_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  website_url: string | null;
  primary_color: string;
  accent_color: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  badge: ProductBadge;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_name: string | null;
  color_hex: string | null;
  size: string | null;
  stock: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CatalogPage {
  id: string;
  page_number: number;
  title: string | null;
  subtitle: string | null;
  layout_type: 'three-products';
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CatalogPageProduct {
  page_id: string;
  product_id: string;
  position: number; // 1, 2, or 3
}

export interface ProductWithDetails extends Product {
  category?: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CatalogPageWithProducts extends CatalogPage {
  products: ProductWithDetails[];
}

export interface ProductFilterParams {
  search?: string;
  categoryId?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
}
