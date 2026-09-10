import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_PAGES,
} from './lib/mockData';
import {
  CatalogSettings,
  Category,
  ProductWithDetails,
  CatalogPageWithProducts,
} from './types/database.types';

import { CatalogViewPage } from './pages/CatalogViewPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProductTable } from './components/admin/ProductTable';
import { ProductForm } from './components/admin/ProductForm';
import { CatalogPageManager } from './components/admin/CatalogPageManager';
import { CategoryManager } from './components/admin/CategoryManager';
import { SettingsForm } from './components/admin/SettingsForm';
import { LoadingState } from './components/common/LoadingState';

const MainApp: React.FC = () => {
  const { user } = useAuth();

  // Estados globales de datos
  const [settings, setSettings] = useState<CatalogSettings>(INITIAL_SETTINGS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<ProductWithDetails[]>(INITIAL_PRODUCTS);
  const [pages, setPages] = useState<CatalogPageWithProducts[]>(INITIAL_PAGES);

  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'catalog' | 'login' | 'admin'>('catalog');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'pages' | 'categories' | 'settings'>('dashboard');

  // Estado para edición de producto en admin
  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null | undefined>(undefined);

  // Cargar datos de Supabase si está configurado
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchDatabaseContent = async () => {
      setIsLoading(true);
      try {
        // 1. Settings
        const { data: settingsData } = await supabase
          .from('catalog_settings')
          .select('*')
          .single();
        if (settingsData) setSettings(settingsData as CatalogSettings);

        // 2. Categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });
        if (categoriesData) setCategories(categoriesData as Category[]);

        // 3. Products
        const { data: productsData } = await supabase
          .from('products')
          .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
          .order('sort_order', { ascending: true });
        if (productsData) setProducts(productsData as ProductWithDetails[]);

        // 4. Pages
        const { data: pagesData } = await supabase
          .from('catalog_pages')
          .select('*, products:catalog_page_products(product:products(*, category:categories(*), images:product_images(*), variants:product_variants(*)))')
          .order('page_number', { ascending: true });
        
        if (pagesData && pagesData.length > 0) {
          const formattedPages: CatalogPageWithProducts[] = pagesData.map((p: any) => ({
            ...p,
            products: p.products ? p.products.map((item: any) => item.product).filter(Boolean) : [],
          }));
          setPages(formattedPages);
        }
      } catch (err) {
        console.error('Error cargando datos de Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabaseContent();
  }, []);

  // Handlers CRUD de Productos
  const handleSaveProduct = (productData: Partial<ProductWithDetails>) => {
    if (productData.id) {
      // Actualizar producto existente
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? ({ ...p, ...productData } as ProductWithDetails) : p))
      );
    } else {
      // Crear nuevo producto
      const newProduct: ProductWithDetails = {
        id: `prod-${Date.now()}`,
        category_id: productData.category_id || categories[0]?.id || null,
        category: categories.find((c) => c.id === productData.category_id),
        name: productData.name || 'Nueva prenda',
        slug: productData.slug || `producto-${Date.now()}`,
        sku: productData.sku || `PR-${Math.floor(Math.random() * 1000)}`,
        short_description: productData.short_description || '',
        description: productData.description || '',
        price: productData.price || 0,
        compare_at_price: productData.compare_at_price || null,
        currency: 'COP',
        badge: productData.badge || null,
        is_active: productData.is_active ?? true,
        is_featured: productData.is_featured ?? false,
        sort_order: products.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: productData.images || [],
        variants: productData.variants || [],
      };
      setProducts((prev) => [newProduct, ...prev]);

      // Si la última página del catálogo tiene menos de 3 productos, asignarlo allí; si no, crear nueva página
      setPages((prevPages) => {
        const copy = [...prevPages];
        if (copy.length === 0) {
          copy.push({
            id: `page-1`,
            page_number: 1,
            title: 'SELECCIÓN DE TEMPORADA',
            subtitle: 'Prendas disponibles en el catálogo',
            layout_type: 'three-products',
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            products: [newProduct],
          });
        } else {
          const lastPage = { ...copy[copy.length - 1] };
          if (lastPage.products.length < 3) {
            lastPage.products = [...lastPage.products, newProduct];
            copy[copy.length - 1] = lastPage;
          } else {
            copy.push({
              id: `page-${copy.length + 1}`,
              page_number: copy.length + 1,
              title: `SELECCIÓN ${copy.length + 1}`,
              subtitle: 'Prendas disponibles en el catálogo',
              layout_type: 'three-products',
              is_published: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              products: [newProduct],
            });
          }
        }
        return copy;
      });
    }

    setEditingProduct(undefined);
    setAdminTab('products');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setPages((prev) =>
      prev.map((pg) => ({
        ...pg,
        products: pg.products.filter((p) => p.id !== productId),
      }))
    );
  };

  const handleToggleActiveProduct = (productId: string, currentStatus: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_active: !currentStatus } : p))
    );
  };

  const handleToggleFeaturedProduct = (productId: string, currentStatus: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_featured: !currentStatus } : p))
    );
  };

  // Handlers CRUD de Páginas
  const handleSavePage = (pageData: Partial<CatalogPageWithProducts>) => {
    if (pageData.id && pages.some((p) => p.id === pageData.id)) {
      setPages((prev) =>
        prev.map((p) => (p.id === pageData.id ? ({ ...p, ...pageData } as CatalogPageWithProducts) : p))
      );
    } else {
      const newPage: CatalogPageWithProducts = {
        id: pageData.id || `page-${Date.now()}`,
        page_number: pageData.page_number || pages.length + 1,
        title: pageData.title || `PÁGINA ${pages.length + 1}`,
        subtitle: pageData.subtitle || '',
        layout_type: 'three-products',
        is_published: pageData.is_published ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        products: pageData.products || [],
      };
      setPages((prev) => [...prev, newPage]);
    }
  };

  const handleDeletePage = (pageId: string) => {
    setPages((prev) => prev.filter((p) => p.id !== pageId));
  };

  // Handlers CRUD Categorías
  const handleSaveCategory = (catData: Partial<Category>) => {
    if (catData.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === catData.id ? ({ ...c, ...catData } as Category) : c))
      );
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catData.name || 'Nueva Categoría',
        slug: catData.slug || `cat-${Date.now()}`,
        description: catData.description || null,
        image_url: catData.image_url || null,
        sort_order: categories.length + 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCat]);
    }
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  // Handler Settings
  const handleSaveSettings = (updated: Partial<CatalogSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6">
        <LoadingState />
      </div>
    );
  }

  // Renderizado según la vista actual
  if (currentView === 'login') {
    return (
      <LoginPage
        onSuccess={() => setCurrentView('admin')}
        onGoBackToCatalog={() => setCurrentView('catalog')}
      />
    );
  }

  if (currentView === 'admin') {
    if (!user && isSupabaseConfigured) {
      return (
        <LoginPage
          onSuccess={() => setCurrentView('admin')}
          onGoBackToCatalog={() => setCurrentView('catalog')}
        />
      );
    }

    return (
      <AdminLayout
        activeTab={adminTab}
        onTabChange={(tab) => {
          setAdminTab(tab);
          if (tab !== 'products') setEditingProduct(undefined);
        }}
        onViewCatalog={() => setCurrentView('catalog')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            products={products}
            categories={categories}
            pages={pages}
            onNavigate={setAdminTab}
            onCreateProduct={() => {
              setEditingProduct(null);
              setAdminTab('products');
            }}
            onViewCatalog={() => setCurrentView('catalog')}
          />
        )}

        {adminTab === 'products' && (
          editingProduct !== undefined ? (
            <ProductForm
              initialData={editingProduct}
              categories={categories}
              onSave={handleSaveProduct}
              onCancel={() => setEditingProduct(undefined)}
            />
          ) : (
            <ProductTable
              products={products}
              categories={categories}
              onCreateProduct={() => setEditingProduct(null)}
              onEditProduct={(prod) => setEditingProduct(prod)}
              onDeleteProduct={handleDeleteProduct}
              onToggleActive={handleToggleActiveProduct}
              onToggleFeatured={handleToggleFeaturedProduct}
              onPreviewProduct={() => setCurrentView('catalog')}
            />
          )
        )}

        {adminTab === 'pages' && (
          <CatalogPageManager
            pages={pages}
            allProducts={products}
            onSavePage={handleSavePage}
            onDeletePage={handleDeletePage}
          />
        )}

        {adminTab === 'categories' && (
          <CategoryManager
            categories={categories}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {adminTab === 'settings' && (
          <SettingsForm settings={settings} onSave={handleSaveSettings} />
        )}
      </AdminLayout>
    );
  }

  // Vista Pública del Catálogo (Default)
  return (
    <CatalogViewPage
      settings={settings}
      pages={pages}
      products={products}
      categories={categories}
      onOpenAdmin={() => setCurrentView(user ? 'admin' : 'login')}
    />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
