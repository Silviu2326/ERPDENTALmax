import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacionTablaProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function PaginacionTabla({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginacionTablaProps) {
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 rounded-b-lg">
      <div className="flex items-center text-sm text-gray-700">
        <span>
          Mostrando {startItem} a {endItem} de {total} resultados
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            page === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            page >= totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


