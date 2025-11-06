import { useState, useEffect } from 'react';
import { Building2, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { Sede, obtenerSedesActivas } from '../api/transferenciaApi';

interface SelectorSedeDestinoProps {
  onSedeSeleccionada: (sede: Sede | null) => void;
  sedeSeleccionada: Sede | null;
  sedeActualId?: string; // ID de la sede actual del paciente para excluirla
}

export default function SelectorSedeDestino({
  onSedeSeleccionada,
  sedeSeleccionada,
  sedeActualId,
}: SelectorSedeDestinoProps) {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    const cargarSedes = async () => {
      try {
        setLoading(true);
        setError(null);
        const sedesActivas = await obtenerSedesActivas();
        // Filtrar la sede actual si está definida
        const sedesDisponibles = sedeActualId
          ? sedesActivas.filter((sede) => sede._id !== sedeActualId)
          : sedesActivas;
        setSedes(sedesDisponibles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las sedes');
      } finally {
        setLoading(false);
      }
    };

    cargarSedes();
  }, [sedeActualId]);

  const handleSelectSede = (sede: Sede) => {
    onSedeSeleccionada(sede);
    setMostrarLista(false);
  };

  const handleClear = () => {
    onSedeSeleccionada(null);
    setMostrarLista(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sede de Destino *
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMostrarLista(!mostrarLista)}
          disabled={loading}
          className="w-full pl-3 pr-10 py-2 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-between"
        >
          <div className="flex items-center space-x-2 min-w-0">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin flex-shrink-0" />
                <span className="text-gray-500">Cargando sedes...</span>
              </>
            ) : sedeSeleccionada ? (
              <>
                <Building2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="truncate">{sedeSeleccionada.nombre}</span>
              </>
            ) : (
              <span className="text-gray-500">Seleccione una sede de destino</span>
            )}
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
              mostrarLista ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {sedeSeleccionada && !loading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="absolute inset-y-0 right-8 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <span className="text-xl">×</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Lista desplegable */}
      {mostrarLista && !loading && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMostrarLista(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {sedes.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No hay sedes disponibles para transferencia
              </div>
            ) : (
              sedes.map((sede) => (
                <button
                  key={sede._id}
                  type="button"
                  onClick={() => handleSelectSede(sede)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                >
                  <Building2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{sede.nombre}</p>
                    {sede.direccion && (
                      <p className="text-xs text-gray-500 truncate mt-1">{sede.direccion}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}


