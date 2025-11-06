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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center text-sm text-gray-700">
        <span>
          Mostrando{' '}
          <span className="font-medium">{(paginaActual - 1) * 10 + 1}</span> a{' '}
          <span className="font-medium">
            {Math.min(paginaActual * 10, totalResultados)}
          </span>{' '}
          de <span className="font-medium">{totalResultados}</span> resultados
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(paginaActual - 1)}
          disabled={paginaActual === 1}
          className={`p-2 rounded-lg border transition-colors ${
            paginaActual === 1
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  paginaActual === numeroPagina
                    ? 'bg-blue-600 border-blue-600 text-white font-medium'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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
          className={`p-2 rounded-lg border transition-colors ${
            paginaActual === totalPaginas
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}


