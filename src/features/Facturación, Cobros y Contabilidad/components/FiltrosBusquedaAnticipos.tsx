import { Calendar, Filter, X } from 'lucide-react';
import { FiltrosAnticipos } from '../api/anticiposApi';

interface FiltrosBusquedaAnticiposProps {
  filtros: FiltrosAnticipos;
  onFiltrosChange: (filtros: FiltrosAnticipos) => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosBusquedaAnticipos({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
}: FiltrosBusquedaAnticiposProps) {
  const tieneFiltrosActivos =
    filtros.pacienteId || filtros.fechaInicio || filtros.fechaFin || filtros.estado;

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaInicio: e.target.value || undefined,
    });
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaFin: e.target.value || undefined,
    });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      estado: (e.target.value as 'disponible' | 'aplicado' | 'devuelto') || undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="p-4">
        <div className="space-y-4">
          {/* Barra de búsqueda/filtros */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rango de fechas */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Calendar size={16} className="inline mr-1" />
                    <span>Fecha Inicio</span>
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaInicio || ''}
                    onChange={handleFechaInicioChange}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Calendar size={16} className="inline mr-1" />
                    <span>Fecha Fin</span>
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaFin || ''}
                    onChange={handleFechaFinChange}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                  <select
                    value={filtros.estado || ''}
                    onChange={handleEstadoChange}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  >
                    <option value="">Todos</option>
                    <option value="disponible">Disponible</option>
                    <option value="aplicado">Aplicado</option>
                    <option value="devuelto">Devuelto</option>
                  </select>
                </div>
              </div>
              {tieneFiltrosActivos && (
                <button
                  onClick={onLimpiarFiltros}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 shadow-sm ring-1 ring-slate-200"
                >
                  <X size={16} />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



