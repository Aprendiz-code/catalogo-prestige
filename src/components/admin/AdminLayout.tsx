import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../brand/BrandLogo';
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  FolderTree,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
} from 'lucide-react';

interface AdminLayoutProps {
  activeTab: 'dashboard' | 'products' | 'pages' | 'categories' | 'settings';
  onTabChange: (tab: 'dashboard' | 'products' | 'pages' | 'categories' | 'settings') => void;
  onViewCatalog: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onTabChange,
  onViewCatalog,
  children,
}) => {
  const { user, profile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: ShoppingBag },
    { id: 'pages', label: 'Páginas (3 por pág)', icon: BookOpen },
    { id: 'categories', label: 'Categorías', icon: FolderTree },
    { id: 'settings', label: 'Portada & Branding', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#171717] flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#E6E3DD] sticky top-0 z-40">
        <BrandLogo size="sm" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#8E6E40] hover:bg-[#F0EEE9] rounded-xs"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-[#E6E3DD] flex-shrink-0 flex flex-col justify-between p-6 z-30`}
      >
        <div className="space-y-8">
          {/* Logo Brand Panel */}
          <div className="hidden md:block text-center pb-4 border-b border-[#E6E3DD]">
            <BrandLogo size="md" />
            <div className="mt-2 text-[10px] tracking-widest text-[#6B6B6B] uppercase">
              PANEL DE ADMINISTRACIÓN
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-semibold rounded-xs transition-all ${
                    isActive
                      ? 'bg-[#B08D57] text-white shadow-md font-bold'
                      : 'text-[#6B6B6B] hover:bg-[#F8F7F4] hover:text-[#171717]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#B08D57]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#E6E3DD]">
            <button
              onClick={onViewCatalog}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F8F7F4] hover:bg-[#F0EEE9] text-[#8E6E40] text-xs font-semibold rounded-xs border border-[#E6E3DD] transition-colors"
            >
              <span>Ver Catálogo Público</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer del Sidebar: Perfil de usuario y Logout */}
        <div className="pt-6 border-t border-[#E6E3DD] space-y-3">
          <div className="flex items-center space-x-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#F8F7F4] text-[#8E6E40] border border-[#B08D57]/40 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 truncate">
                <div className="font-semibold text-[#171717] truncate">
                {profile?.full_name || 'Admin'}
              </div>
                <div className="text-[10px] text-[#6B6B6B] capitalize">
                Rol: {profile?.role || 'admin'}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 px-3 py-2 rounded-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Área Principal de Contenido Admin */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

    </div>
  );
};
