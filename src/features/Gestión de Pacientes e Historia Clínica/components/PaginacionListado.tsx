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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4">
      <div className="text-sm text-gray-600">
        Mostrando {startItem} - {endItem} de {total} pacientes
      </div>

      <div className="flex items-center gap-2">
        {/* Botón primera página */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          aria-label="Primera página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Botón página anterior */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Números de página */}
        <div className="flex gap-1">
          {getPageNumbers().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              );
            }

            const pageNumber = pageNum as number;
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  page === pageNumber
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Botón última página */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          aria-label="Última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


