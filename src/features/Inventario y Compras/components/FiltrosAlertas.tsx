import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { FiltrosAlertas } from '../api/alertasApi';

interface Sede {
  _id: string;
  nombre: string;
}

interface FiltrosAlertasProps {
  filtros: FiltrosAlertas;
  onFiltrosChange: (filtros: FiltrosAlertas) => void;
  sedes: Sede[];
}

export default function FiltrosAlertasComponent({ filtros, onFiltrosChange, sedes }: FiltrosAlertasProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleSedeChange = (sedeId: string) => {
    onFiltrosChange({
      ...filtros,
      sedeId: sedeId || undefined,
      page: 1, // Resetear a la primera página al cambiar filtros
    });
  };

  const handleEstadoChange = (estado: string) => {
    onFiltrosChange({
      ...filtros,
      estado: (estado || undefined) as FiltrosAlertas['estado'],
      page: 1, // Resetear a la primera página al cambiar filtros
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  const tieneFiltrosActivos = filtros.sedeId || filtros.estado;

  const filtrosActivosCount = (filtros.sedeId ? 1 : 0) + (filtros.estado ? 1 : 0);

  return (
    <div className="bg-white shadow-sm rounded-xl">
      <div className="p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda placeholder - puede implementarse después */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar alertas..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5 text-sm"
                disabled
              />
            </div>
            
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300 hover:ring-slate-400"
            >
              <Filter size={18} />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {filtrosActivosCount}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={18} className="opacity-70" />
              ) : (
                <ChevronDown size={18} className="opacity-70" />
              )}
            </button>

            {/* Botón limpiar */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300 hover:ring-slate-400"
              >
                <X size={18} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="mt-4 rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por Sede */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sede
                </label>
                <select
                  value={filtros.sedeId || ''}
                  onChange={(e) => handleSedeChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                >
                  <option value="">Todas las sedes</option>
                  {sedes.map((sede) => (
                    <option key={sede._id} value={sede._id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleEstadoChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                >
                  <option value="">Todos los estados</option>
                  <option value="nueva">Nueva</option>
                  <option value="revisada">Revisada</option>
                  <option value="en_proceso_compra">En Proceso de Compra</option>
                  <option value="resuelta">Resuelta</option>
                </select>
              </div>
            </div>

            {/* Resumen de resultados */}
            {tieneFiltrosActivos && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{filtrosActivosCount} filtro{filtrosActivosCount !== 1 ? 's' : ''} aplicado{filtrosActivosCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



