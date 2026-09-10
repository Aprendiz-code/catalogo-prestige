-- =========================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE PARA PRESTIGE - MODA DE LUJO
-- =========================================================

-- 1. EXTENSIONES
create extension if not exists "uuid-ossp";

-- 2. TABLA PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. TABLA CATALOG_SETTINGS
create table if not exists public.catalog_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null default 'PRESTIGE',
  brand_subtitle text not null default 'MODA DE LUJO',
  hero_title text not null default 'NUEVOS LOOKS / NUEVA ACTITUD',
  hero_description text default 'Descubre las últimas tendencias y renueva tu estilo con prendas creadas para destacar.',
  season_label text default 'NUEVA TEMPORADA',
  hero_image_url text default 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80',
  logo_url text,
  whatsapp_url text default 'https://wa.me/573000000000',
  instagram_url text default 'https://instagram.com/prestigecol.online',
  tiktok_url text default 'https://tiktok.com/@prestigecol.online',
  website_url text default 'https://www.prestigecol.online',
  primary_color text default '#111111',
  accent_color text default '#E6D19A',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. TABLA CATEGORIES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. TABLA PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  sku text unique not null,
  short_description text,
  description text,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= 0),
  currency text not null default 'COP',
  badge text check (badge in ('NUEVO', 'OFERTA', 'AGOTADO', 'EDICIÓN LIMITADA') or badge is null),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. TABLA PRODUCT_IMAGES
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

-- 7. TABLA PRODUCT_VARIANTS
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  color_name text,
  color_hex text,
  size text,
  stock integer not null default 0 check (stock >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. TABLA CATALOG_PAGES
create table if not exists public.catalog_pages (
  id uuid primary key default gen_random_uuid(),
  page_number integer not null unique,
  title text,
  subtitle text,
  layout_type text not null default 'three-products',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint three_products_layout check (layout_type = 'three-products')
);

-- 9. TABLA CATALOG_PAGE_PRODUCTS
create table if not exists public.catalog_page_products (
  page_id uuid not null references public.catalog_pages(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  position integer not null check (position between 1 and 3),
  primary key (page_id, product_id),
  unique (page_id, position)
);

-- =========================================================
-- FUNCIONES AUXILIARES Y TRIGGERS
-- =========================================================

-- Trigger para auto-actualizar updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_profiles_updated_at before update on public.profiles for each row execute function public.handle_updated_at();
create or replace trigger set_catalog_settings_updated_at before update on public.catalog_settings for each row execute function public.handle_updated_at();
create or replace trigger set_categories_updated_at before update on public.categories for each row execute function public.handle_updated_at();
create or replace trigger set_products_updated_at before update on public.products for each row execute function public.handle_updated_at();
create or replace trigger set_product_variants_updated_at before update on public.product_variants for each row execute function public.handle_updated_at();
create or replace trigger set_catalog_pages_updated_at before update on public.catalog_pages for each row execute function public.handle_updated_at();

-- Función de ayuda is_admin()
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Función de ayuda is_editor()
create or replace function public.is_editor()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
end;
$$ language plpgsql security definer;

-- Auto-creación de perfil al registrar usuario en Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Administrador PRESTIGE'), 'admin');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- SEGURIDAD CON ROW LEVEL SECURITY (RLS)
-- =========================================================

alter table public.profiles enable row level security;
alter table public.catalog_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.catalog_pages enable row level security;
alter table public.catalog_page_products enable row level security;

-- Políticas Profiles
create policy "Usuarios autenticados pueden ver perfiles" on public.profiles for select using (auth.role() = 'authenticated');
create policy "Administradores pueden actualizar perfiles" on public.profiles for update using (public.is_admin());

-- Políticas Catalog Settings (Público lee si está publicado, Admin/Editor gestiona)
create policy "Público lee configuración publicada" on public.catalog_settings for select using (is_published = true or public.is_editor());
create policy "Editores y admins modifican configuración" on public.catalog_settings for all using (public.is_editor());

-- Políticas Categories (Público lee activas, Admin/Editor gestiona)
create policy "Público lee categorías activas" on public.categories for select using (is_active = true or public.is_editor());
create policy "Editores y admins modifican categorías" on public.categories for all using (public.is_editor());

-- Políticas Products (Público lee activos, Admin/Editor gestiona)
create policy "Público lee productos activos" on public.products for select using (is_active = true or public.is_editor());
create policy "Editores y admins modifican productos" on public.products for all using (public.is_editor());

-- Políticas Product Images (Público lee imágenes de productos activos, Admin/Editor gestiona)
create policy "Público lee imágenes de productos activos" on public.product_images for select using (
  exists (select 1 from public.products p where p.id = product_id and (p.is_active = true or public.is_editor()))
);
create policy "Editores y admins modifican imágenes" on public.product_images for all using (public.is_editor());

-- Políticas Product Variants (Público lee variantes disponibles de productos activos, Admin/Editor gestiona)
create policy "Público lee variantes de productos activos" on public.product_variants for select using (
  exists (select 1 from public.products p where p.id = product_id and (p.is_active = true or public.is_editor()))
);
create policy "Editores y admins modifican variantes" on public.product_variants for all using (public.is_editor());

-- Políticas Catalog Pages (Público lee páginas publicadas, Admin/Editor gestiona)
create policy "Público lee páginas de catálogo publicadas" on public.catalog_pages for select using (is_published = true or public.is_editor());
create policy "Editores y admins modifican páginas de catálogo" on public.catalog_pages for all using (public.is_editor());

-- Políticas Catalog Page Products
create policy "Público lee asignaciones de página" on public.catalog_page_products for select using (true);
create policy "Editores y admins modifican asignaciones de página" on public.catalog_page_products for all using (public.is_editor());

-- =========================================================
-- CONFIGURACIÓN DE SUPABASE STORAGE BUCKET
-- =========================================================

insert into storage.buckets (id, name, public)
values ('catalog-images', 'catalog-images', true)
on conflict (id) do nothing;

create policy "Acceso público de lectura a catalog-images" on storage.objects
  for select using (bucket_id = 'catalog-images');

create policy "Editores suben archivos a catalog-images" on storage.objects
  for insert with check (bucket_id = 'catalog-images' and auth.role() = 'authenticated');

create policy "Editores modifican archivos en catalog-images" on storage.objects
  for update using (bucket_id = 'catalog-images' and auth.role() = 'authenticated');

create policy "Editores eliminan archivos en catalog-images" on storage.objects
  for delete using (bucket_id = 'catalog-images' and auth.role() = 'authenticated');
