import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No se encontraron prendas',
  description = 'Intenta ajustar tus criterios de búsqueda o limpia los filtros activos.',
  onReset,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 bg-white border border-[#E6E3DD] rounded-xs text-center space-y-4 shadow-[0_12px_30px_rgba(23,23,23,0.05)]">
      <div className="w-16 h-16 rounded-full bg-[#F8F7F4] text-[#B08D57] flex items-center justify-center mx-auto border border-[#B08D57]/30">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="font-editorial-serif font-bold text-xl text-[#171717] uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-xs text-[#6B6B6B] max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 bg-[#B08D57] text-white font-bold text-xs tracking-widest px-5 py-2.5 rounded-xs transition-colors hover:bg-[#8E6E40]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>REINICIAR FILTROS</span>
        </button>
      )}
    </div>
  );
};
