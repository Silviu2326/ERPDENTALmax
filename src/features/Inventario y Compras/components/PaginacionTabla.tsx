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
    <div className="bg-white shadow-sm rounded-xl p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-600">
          <span>
            Mostrando {startItem} a {endItem} de {total} resultados
          </span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`inline-flex items-center justify-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              page === 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm ring-1 ring-slate-200'
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-1">
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
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    page === pageNum
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm ring-1 ring-slate-200'
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
            className={`inline-flex items-center justify-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              page >= totalPages
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm ring-1 ring-slate-200'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}



