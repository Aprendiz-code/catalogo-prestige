import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CatalogSettings } from '../../types/database.types';

interface CatalogCoverProps {
  settings: CatalogSettings;
  onExplore: () => void;
}

export const CatalogCover: React.FC<CatalogCoverProps> = ({ settings, onExplore }) => {
  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden bg-white text-[#111111] shadow-[0_14px_38px_rgba(17,17,17,0.1)]">
      <div className="aspect-[1191/1685] w-full bg-[#E9E9E7]">
        <img
          src="/img/portada.png"
          alt="Portada de la colección PRESTIGE 2026 con propuesta de moda urbana"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="flex flex-col gap-6 border-t border-[#111111] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-7">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#555555]">
            {settings.season_label || 'Nueva temporada'}
          </p>
          <h1 className="mt-2 font-editorial-serif text-3xl font-semibold uppercase leading-none tracking-[0.04em] sm:text-4xl">
            {settings.hero_title || 'Nuevos looks / Nueva actitud'}
          </h1>
          <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-[#555555]">
            {settings.hero_description || 'Descubre las últimas tendencias y renueva tu estilo con prendas creadas para destacar.'}
          </p>
        </div>
        <button
          onClick={onExplore}
          className="inline-flex shrink-0 items-center justify-center gap-3 bg-[#111111] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#3A3A3A]"
        >
          Ver colección
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
