import React, { useState } from 'react';
import { CatalogSettings } from '../../types/database.types';
import { uploadImage } from '../../lib/storage';
import { Save, Upload, CheckCircle } from 'lucide-react';

interface SettingsFormProps {
  settings: CatalogSettings;
  onSave: (updated: Partial<CatalogSettings>) => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<CatalogSettings>(settings);
  const [isUploading, setIsUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadImage(file, 'hero');
      setFormData({ ...formData, hero_image_url: uploadedUrl });
    } catch (err: any) {
      alert(err.message || 'Error al subir la imagen de portada');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1D1D1D] border border-[#333333] rounded-xs p-6 space-y-6 text-[#F2EFE9]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#333333] pb-4">
        <div>
          <h2 className="font-editorial-serif font-bold text-xl text-[#E6D19A] uppercase">
            CONFIGURACIÓN DE PORTADA & BRANDING
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Edita los textos, imagen principal y redes sociales de la portada sin escribir código.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs bg-emerald-950 px-3 py-1.5 border border-emerald-800 rounded-xs">
            <CheckCircle className="w-4 h-4" />
            <span>¡CAMBIOS GUARDADOS!</span>
          </div>
        )}
      </div>

      {/* 1. Datos de Marca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px] mb-1">
            Nombre de la Marca
          </label>
          <input
            type="text"
            value={formData.brand_name}
            onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] p-2 rounded-xs outline-none font-bold tracking-widest"
          />
        </div>

        <div>
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px] mb-1">
            Subtítulo Elegante
          </label>
          <input
            type="text"
            value={formData.brand_subtitle}
            onChange={(e) => setFormData({ ...formData, brand_subtitle: e.target.value })}
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#E6D19A] p-2 rounded-xs outline-none font-editorial-script text-base"
          />
        </div>

        <div>
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px] mb-1">
            Título Principal de Portada
          </label>
          <input
            type="text"
            value={formData.hero_title}
            onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] p-2 rounded-xs outline-none"
          />
        </div>

        <div>
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px] mb-1">
            Sello de Temporada
          </label>
          <input
            type="text"
            value={formData.season_label || ''}
            onChange={(e) => setFormData({ ...formData, season_label: e.target.value })}
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] p-2 rounded-xs outline-none"
          />
        </div>
      </div>

      {/* 2. Descripción de Portada */}
      <div className="text-xs">
        <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px] mb-1">
          Texto Descriptivo Secundario
        </label>
        <textarea
          rows={2}
          value={formData.hero_description || ''}
          onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
          className="w-full bg-[#111111] border border-[#333333] focus:border-[#E6D19A] text-[#F2EFE9] p-2 rounded-xs outline-none"
        />
      </div>

      {/* 3. Imagen Editorial Principal */}
      <div className="space-y-3 pt-4 border-t border-[#333333] text-xs">
        <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px]">
          Imagen Principal de Portada (Marco Editorial)
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-28 rounded-t-full overflow-hidden bg-[#111111] border border-[#333333]">
            <img
              src={formData.hero_image_url || 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80'}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 flex-1">
            <input
              type="text"
              value={formData.hero_image_url || ''}
              onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
              placeholder="URL de la imagen de portada..."
              className="w-full bg-[#111111] border border-[#333333] text-[#F2EFE9] p-2 rounded-xs outline-none"
            />

            <label className="inline-flex items-center space-x-2 bg-[#111111] hover:bg-[#2A2A2A] text-[#E6D19A] border border-[#333333] px-3 py-1.5 rounded-xs font-bold cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'SUBIENDO...' : 'REEMPLAZAR IMAGEN'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleHeroImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* 4. Enlaces de Contacto y Redes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#333333]">
        <div>
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px] mb-1">
            Enlace de WhatsApp
          </label>
          <input
            type="text"
            value={formData.whatsapp_url || ''}
            onChange={(e) => setFormData({ ...formData, whatsapp_url: e.target.value })}
            placeholder="https://wa.me/573000000000"
            className="w-full bg-[#111111] border border-[#333333] text-[#F2EFE9] p-2 rounded-xs outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-[#8C8C8C] font-semibold uppercase text-[11px] mb-1">
            Sitio Web Oficial
          </label>
          <input
            type="text"
            value={formData.website_url || ''}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            placeholder="https://www.prestigecol.online"
            className="w-full bg-[#111111] border border-[#333333] text-[#F2EFE9] p-2 rounded-xs outline-none font-mono"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-[#333333] flex justify-end">
        <button
          type="submit"
          className="bg-[#E6D19A] hover:bg-[#C9A24D] text-[#111111] font-bold text-xs tracking-widest px-6 py-3 rounded-xs flex items-center space-x-2 transition-transform transform hover:scale-[1.02]"
        >
          <Save className="w-4 h-4" />
          <span>GUARDAR CONFIGURACIÓN DE PORTADA</span>
        </button>
      </div>

    </form>
  );
};
