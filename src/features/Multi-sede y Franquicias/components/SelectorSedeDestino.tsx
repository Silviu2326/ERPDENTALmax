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
      <label className="block text-sm font-medium text-slate-700 mb-2">
        <Building2 size={16} className="inline mr-1" />
        Sede de Destino *
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMostrarLista(!mostrarLista)}
          disabled={loading}
          className="w-full pl-3 pr-10 py-2.5 text-left rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100 disabled:cursor-not-allowed flex items-center justify-between transition-all"
        >
          <div className="flex items-center space-x-2 min-w-0">
            {loading ? (
              <>
                <Loader2 size={18} className="text-slate-400 animate-spin flex-shrink-0" />
                <span className="text-slate-500">Cargando sedes...</span>
              </>
            ) : sedeSeleccionada ? (
              <>
                <Building2 size={18} className="text-blue-600 flex-shrink-0" />
                <span className="truncate">{sedeSeleccionada.nombre}</span>
              </>
            ) : (
              <span className="text-slate-500">Seleccione una sede de destino</span>
            )}
          </div>
          <ChevronDown
            size={18}
            className={`text-slate-400 flex-shrink-0 transition-transform ${
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
            className="absolute inset-y-0 right-8 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
          <AlertCircle size={16} />
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
          <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg ring-1 ring-slate-200 max-h-60 overflow-y-auto">
            {sedes.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-600">
                No hay sedes disponibles para transferencia
              </div>
            ) : (
              sedes.map((sede) => (
                <button
                  key={sede._id}
                  type="button"
                  onClick={() => handleSelectSede(sede)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center space-x-3"
                >
                  <Building2 size={18} className="text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{sede.nombre}</p>
                    {sede.direccion && (
                      <p className="text-xs text-slate-600 truncate mt-1">{sede.direccion}</p>
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



