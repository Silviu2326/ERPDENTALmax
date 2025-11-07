import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacionEmpleadosProps {
  paginaActual: number;
  totalPaginas: number;
  totalResultados: number;
  onPageChange: (page: number) => void;
}

export default function PaginacionEmpleados({
  paginaActual,
  totalPaginas,
  totalResultados,
  onPageChange,
}: PaginacionEmpleadosProps) {
  const getPaginasVisibles = () => {
    const paginas: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPaginas <= maxVisible) {
      // Mostrar todas las páginas si hay pocas
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (paginaActual <= 3) {
        // Al inicio
        for (let i = 1; i <= 4; i++) {
          paginas.push(i);
        }
        paginas.push('...');
        paginas.push(totalPaginas);
      } else if (paginaActual >= totalPaginas - 2) {
        // Al final
        paginas.push(1);
        paginas.push('...');
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
          paginas.push(i);
        }
      } else {
        // En el medio
        paginas.push(1);
        paginas.push('...');
        for (let i = paginaActual - 1; i <= paginaActual + 1; i++) {
          paginas.push(i);
        }
        paginas.push('...');
        paginas.push(totalPaginas);
      }
    }

    return paginas;
  };

  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <span>
            Mostrando{' '}
            <span className="font-medium text-gray-900">{(paginaActual - 1) * 10 + 1}</span> a{' '}
            <span className="font-medium text-gray-900">
              {Math.min(paginaActual * 10, totalResultados)}
            </span>{' '}
            de <span className="font-medium text-gray-900">{totalResultados}</span> resultados
          </span>
        </div>

        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(paginaActual - 1)}
            disabled={paginaActual === 1}
            className={`inline-flex items-center justify-center p-2 rounded-lg transition-all ${
              paginaActual === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-200'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {getPaginasVisibles().map((pagina, index) => {
              if (pagina === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                    ...
                  </span>
                );
              }

              const numeroPagina = pagina as number;
              return (
                <button
                  key={numeroPagina}
                  onClick={() => onPageChange(numeroPagina)}
                  className={`inline-flex items-center justify-center px-3 py-2 rounded-lg transition-all text-sm ${
                    paginaActual === numeroPagina
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-200'
                  }`}
                >
                  {numeroPagina}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className={`inline-flex items-center justify-center p-2 rounded-lg transition-all ${
              paginaActual === totalPaginas
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-200'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}



