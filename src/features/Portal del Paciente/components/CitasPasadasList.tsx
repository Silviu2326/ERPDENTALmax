import { useState, useEffect } from 'react';
import { History, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { obtenerCitasPasadas, CitaPasada } from '../api/citasApi';
import CitaCard from './CitaCard';

export default function CitasPasadasList() {
  const [citas, setCitas] = useState<CitaPasada[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalCitas, setTotalCitas] = useState(0);
  const limite = 10;

  useEffect(() => {
    cargarCitas();
  }, [paginaActual]);

  const cargarCitas = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerCitasPasadas(paginaActual, limite);
      setCitas(datos.citas);
      setTotalPaginas(datos.paginacion.totalPaginas);
      setTotalCitas(datos.paginacion.totalCitas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las citas pasadas');
    } finally {
      setCargando(false);
    }
  };

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Cargando historial de citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={cargarCitas}
          className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (citas.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay citas pasadas</h3>
        <p className="text-gray-600">Tu historial de citas aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        Mostrando {citas.length} de {totalCitas} citas
      </div>
      
      <div className="space-y-4 mb-6">
        {citas.map((cita) => (
          <CitaCard
            key={cita._id}
            cita={cita}
            esProxima={false}
          />
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-700">
            Página {paginaActual} de {totalPaginas}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePaginaAnterior}
              disabled={paginaActual === 1}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg border transition-colors ${
                paginaActual === 1
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={handlePaginaSiguiente}
              disabled={paginaActual === totalPaginas}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg border transition-colors ${
                paginaActual === totalPaginas
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


