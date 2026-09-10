import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Share2,
  Download,
  Filter,
  BookOpen,
  Home,
} from 'lucide-react';

interface FlipbookControlsProps {
  currentPage: number; // 0 para Portada, 1..N para páginas de catálogo
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onGoHome: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onShare: () => void;
  onPrintDownload: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export const FlipbookControls: React.FC<FlipbookControlsProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onGoHome,
  isFullscreen,
  onToggleFullscreen,
  onShare,
  onPrintDownload,
  showFilters,
  onToggleFilters,
}) => {
  return (
    <div className="sticky bottom-4 z-40 mx-auto w-full max-w-2xl px-2 sm:px-4">
      <div className="glass-panel flex flex-wrap items-center justify-center gap-1 px-2 py-2 text-[#F2EFE9] sm:justify-between sm:gap-2 sm:px-4">
        
        {/* Lado Izquierdo: Botón Portada e Indicadores */}
        <div className="flex shrink-0 items-center space-x-1 sm:space-x-2">
          <button
            onClick={onGoHome}
            title="Volver a la Portada"
            aria-label="Volver a la portada"
            className={`p-2 transition-colors ${
              currentPage === 0
                ? 'bg-[#E6D19A] text-[#111111]'
                : 'text-[#F2EFE9] hover:text-[#E6D19A]'
            }`}
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleFilters}
            title="Filtros y Búsqueda"
            aria-label="Abrir filtros y búsqueda"
            className={`p-2 transition-colors ${
              showFilters
                ? 'bg-[#E6D19A] text-[#111111]'
                : 'text-[#F2EFE9] hover:text-[#E6D19A]'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Centro: Controles Anterior / Siguiente y Paginador */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            onClick={onPrev}
            disabled={currentPage === 0}
            aria-label="Página anterior"
            className="border border-[#383838] p-2 text-[#F2EFE9] transition-colors hover:border-[#E6D19A] hover:text-[#E6D19A] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="select-none px-1 text-center font-mono text-[10px] sm:px-2">
            {currentPage === 0 ? (
                <span className="font-editorial-serif text-sm uppercase tracking-wider text-[#E6D19A]">
                PORTADA
              </span>
            ) : (
                <span className="text-[10px]">
                Pág <strong className="text-[#E6D19A]">{currentPage}</strong> de {totalPages}
              </span>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={currentPage >= totalPages}
            aria-label="Página siguiente"
            className="border border-[#383838] p-2 text-[#F2EFE9] transition-colors hover:border-[#E6D19A] hover:text-[#E6D19A] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Lado Derecho: Acciones Adicionales (Fullscreen, Share, Download) */}
        <div className="flex shrink-0 items-center gap-0 sm:gap-2">
          <button
            onClick={onShare}
            title="Compartir Catálogo"
            aria-label="Compartir catálogo"
            className="p-2 text-[#F2EFE9] transition-colors hover:text-[#E6D19A]"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onPrintDownload}
            title="Descargar o Imprimir"
            aria-label="Descargar o imprimir catálogo"
            className="p-2 text-[#F2EFE9] transition-colors hover:text-[#E6D19A]"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            aria-label="Alternar pantalla completa"
            className="hidden p-2 text-[#F2EFE9] transition-colors hover:text-[#E6D19A] sm:block"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
