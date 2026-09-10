import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CatalogSettings, CatalogPageWithProducts, ProductWithDetails } from '../../types/database.types';
import { CatalogCover } from './CatalogCover';
import { CatalogPage } from './CatalogPage';
import { FlipbookControls } from './FlipbookControls';

interface FlipbookViewerProps {
  settings: CatalogSettings;
  pages: CatalogPageWithProducts[];
  onSelectProduct: (product: ProductWithDetails) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onPageChange?: (pageIndex: number) => void;
}

export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({
  settings,
  pages,
  onSelectProduct,
  showFilters,
  onToggleFilters,
  onPageChange,
}) => {
  // Page 0 = Cover; Page 1..N = Catalog Pages
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const touchStartXRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = pages.length;

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index > totalPages || isTransitioning) return;
      setIsTransitioning(true);
      setCurrentPageIndex(index);
      onPageChange?.(index);
      setTimeout(() => setIsTransitioning(false), 350);
    },
    [totalPages, isTransitioning]
  );

  const handleNext = useCallback(() => {
    if (currentPageIndex < totalPages) {
      goToPage(currentPageIndex + 1);
    }
  }, [currentPageIndex, totalPages, goToPage]);

  const handlePrev = useCallback(() => {
    if (currentPageIndex > 0) {
      goToPage(currentPageIndex - 1);
    }
  }, [currentPageIndex, goToPage]);

  // Teclado (Flechas Izquierda / Derecha)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Gestos Táctiles (Swipe Left / Right)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;

    // Umbral de 50px para el deslizado
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNext(); // Swipe izquierda -> siguiente
      } else {
        handlePrev(); // Swipe derecha -> anterior
      }
    }
    touchStartXRef.current = null;
  };

  // Precarga de imágenes de páginas adyacentes
  useEffect(() => {
    const pagesToPreload = [currentPageIndex, currentPageIndex + 1];
    pagesToPreload.forEach((pIdx) => {
      if (pIdx > 0 && pIdx <= pages.length) {
        const targetPage = pages[pIdx - 1];
        targetPage?.products.forEach((prod) => {
          prod.images.forEach((img) => {
            const imageObj = new Image();
            imageObj.src = img.image_url;
          });
        });
      }
    });
  }, [currentPageIndex, pages]);

  // Manejo de Pantalla Completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Compartir Enlace
  const handleShare = async () => {
    const shareData = {
      title: `${settings.brand_name} - ${settings.brand_subtitle}`,
      text: 'Explora el catálogo digital de moda urbana de lujo PRESTIGE.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace del catálogo copiado al portapapeles!');
    }
  };

  // Imprimir / Descargar PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-[85vh] flex flex-col justify-between py-4 px-2 sm:px-4 select-none"
    >
      {/* Contenedor principal con efecto de animación de cambio de página */}
      <div
        className={`w-full flex justify-center items-center flipbook-page-transition ${
          isTransitioning ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {currentPageIndex === 0 ? (
          <CatalogCover settings={settings} onExplore={() => goToPage(1)} />
        ) : (
          <CatalogPage
            page={pages[currentPageIndex - 1]}
            currentPageNumber={currentPageIndex}
            totalPagesCount={totalPages}
            onSelectProduct={onSelectProduct}
          />
        )}
      </div>

      {/* Barra de Controles Flotante */}
      <FlipbookControls
        currentPage={currentPageIndex}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
        onGoHome={() => goToPage(0)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onShare={handleShare}
        onPrintDownload={handlePrint}
        showFilters={showFilters}
        onToggleFilters={onToggleFilters}
      />
    </div>
  );
};
