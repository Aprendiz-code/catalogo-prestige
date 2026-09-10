import React from 'react';
import { ProductWithDetails, Category, CatalogPageWithProducts } from '../../types/database.types';
import {
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface AdminDashboardProps {
  products: ProductWithDetails[];
  categories: Category[];
  pages: CatalogPageWithProducts[];
  onNavigate: (tab: 'products' | 'pages' | 'categories' | 'settings') => void;
  onCreateProduct: () => void;
  onViewCatalog: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  pages,
  onNavigate,
  onCreateProduct,
  onViewCatalog,
}) => {
  const activeProductsCount = products.filter((p) => p.is_active).length;
  const featuredProductsCount = products.filter((p) => p.is_featured).length;

  const lowStockCount = products.filter((p) =>
    p.variants.some((v) => v.stock > 0 && v.stock <= 3)
  ).length;

  return (
    <div className="space-y-8 text-[#F2EFE9]">
      
      {/* 1. Saludo y Accesos Rápidos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1D1D1D] p-6 rounded-xs border border-[#333333] shadow-xl">
        <div>
          <h1 className="font-editorial-serif font-bold text-2xl md:text-3xl text-[#E6D19A] uppercase">
            PANEL DE CONTROL — PRESTIGE
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1">
            Gestión del catálogo digital de moda urbana de lujo.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onCreateProduct}
            className="inline-flex items-center space-x-2 bg-white hover:bg-[#F0EEE9] text-[#111111] font-bold text-xs tracking-widest px-4 py-2.5 rounded-xs transition-transform transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>NUEVO PRODUCTO</span>
          </button>

          <button
            onClick={onViewCatalog}
            className="inline-flex items-center space-x-2 bg-[#111111] hover:bg-[#2A2A2A] text-[#E6D19A] border border-[#333333] font-bold text-xs tracking-widest px-4 py-2.5 rounded-xs transition-colors"
          >
            <span>VER CATÁLOGO</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Tarjetas de Métricas Principal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#1D1D1D] border border-[#333333] p-5 rounded-xs flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] text-[#8C8C8C] uppercase font-bold tracking-wider">Total Productos</span>
            <div className="text-3xl font-bold font-mono text-[#F2EFE9] mt-1">{products.length}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#111111] text-[#E6D19A] border border-[#E6D19A]/30 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1D1D1D] border border-[#333333] p-5 rounded-xs flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] text-[#8C8C8C] uppercase font-bold tracking-wider">Productos Activos</span>
            <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">{activeProductsCount}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#111111] text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1D1D1D] border border-[#333333] p-5 rounded-xs flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] text-[#8C8C8C] uppercase font-bold tracking-wider">Páginas Catálogo</span>
            <div className="text-3xl font-bold font-mono text-[#E6D19A] mt-1">{pages.length}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#111111] text-[#E6D19A] border border-[#E6D19A]/30 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1D1D1D] border border-[#333333] p-5 rounded-xs flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] text-[#8C8C8C] uppercase font-bold tracking-wider">Bajo Inventario</span>
            <div className="text-3xl font-bold font-mono text-amber-400 mt-1">{lowStockCount}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#111111] text-amber-400 border border-amber-800/40 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. Accesos Rápidos por Módulo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div
          onClick={() => onNavigate('products')}
          className="bg-[#1D1D1D] border border-[#333333] hover:border-[#E6D19A] p-6 rounded-xs cursor-pointer transition-all space-y-3 group shadow-md"
        >
          <div className="w-10 h-10 rounded-xs bg-[#111111] text-[#E6D19A] flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="font-editorial-serif font-bold text-lg text-[#F2EFE9] group-hover:text-[#E6D19A] transition-colors uppercase">
            GESTIÓN DE PRODUCTOS
          </h3>
          <p className="text-xs text-[#8C8C8C] leading-relaxed">
            Crear, editar, subir imágenes, modificar precios y variantes de ropa urbana.
          </p>
        </div>

        <div
          onClick={() => onNavigate('pages')}
          className="bg-[#1D1D1D] border border-[#333333] hover:border-[#E6D19A] p-6 rounded-xs cursor-pointer transition-all space-y-3 group shadow-md"
        >
          <div className="w-10 h-10 rounded-xs bg-[#111111] text-[#E6D19A] flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-editorial-serif font-bold text-lg text-[#F2EFE9] group-hover:text-[#E6D19A] transition-colors uppercase">
            ORGANIZAR PÁGINAS (3 POR PÁG)
          </h3>
          <p className="text-xs text-[#8C8C8C] leading-relaxed">
            Asigna exactamente 3 prendas a cada lienzo del flipbook para la maquetación editorial.
          </p>
        </div>

        <div
          onClick={() => onNavigate('settings')}
          className="bg-[#1D1D1D] border border-[#333333] hover:border-[#E6D19A] p-6 rounded-xs cursor-pointer transition-all space-y-3 group shadow-md"
        >
          <div className="w-10 h-10 rounded-xs bg-[#111111] text-[#E6D19A] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Settings className="w-5 h-5" />
          </div>
          <h3 className="font-editorial-serif font-bold text-lg text-[#F2EFE9] group-hover:text-[#E6D19A] transition-colors uppercase">
            PORTADA & REDES SOCIALES
          </h3>
          <p className="text-xs text-[#8C8C8C] leading-relaxed">
            Personaliza los títulos, slogan, imagen de portada y enlace directo de WhatsApp.
          </p>
        </div>

      </div>

    </div>
  );
};
