import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PaginacionInfo } from '../api/pacientesApi';

interface PaginacionListadoProps {
  paginacion: PaginacionInfo;
  onPageChange: (page: number) => void;
}

export default function PaginacionListado({ paginacion, onPageChange }: PaginacionListadoProps) {
  const { page, totalPages, total, limit } = paginacion;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si hay pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="text-sm text-slate-600">
          Mostrando {startItem} - {endItem} de {total} resultados
        </div>

        <div className="flex items-center justify-center gap-2">
          {/* Botón primera página */}
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="p-2 rounded-xl ring-1 ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors text-slate-700"
            aria-label="Primera página"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Botón página anterior */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-xl ring-1 ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors text-slate-700"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Números de página */}
          <div className="flex gap-2">
            {getPageNumbers().map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-500">
                    ...
                  </span>
                );
              }

              const pageNumber = pageNum as number;
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`px-4 py-2 rounded-xl ring-1 transition-colors text-sm ${
                    page === pageNumber
                      ? 'bg-blue-600 text-white ring-blue-600'
                      : 'ring-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Botón página siguiente */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-xl ring-1 ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors text-slate-700"
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Botón última página */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="p-2 rounded-xl ring-1 ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors text-slate-700"
            aria-label="Última página"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}



