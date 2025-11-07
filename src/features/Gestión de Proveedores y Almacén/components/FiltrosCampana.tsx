import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { FiltrosCampana as FiltrosCampanaType } from '../api/campanasApi';

interface FiltrosCampanaProps {
  filtros: FiltrosCampanaType;
  onFiltrosChange: (filtros: FiltrosCampanaType) => void;
  clinicas?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosCampana({ filtros, onFiltrosChange, clinicas = [] }: FiltrosCampanaProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleCambio = (campo: keyof FiltrosCampanaType, valor: string) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
  };

  const tieneFiltros = filtros.status || filtros.clinicaId || filtros.fechaInicio || filtros.fechaFin;

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar campañas..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70"
            >
              <Filter size={18} />
              Filtros
              {tieneFiltros && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {[filtros.status, filtros.clinicaId, filtros.fechaInicio, filtros.fechaFin].filter(Boolean).length}
                </span>
              )}
              {mostrarFiltros ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {tieneFiltros && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70"
              >
                <X size={18} />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Estado
                </label>
                <select
                  value={filtros.status || ''}
                  onChange={(e) => handleCambio('status', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos</option>
                  <option value="Planificada">Planificada</option>
                  <option value="Activa">Activa</option>
                  <option value="Finalizada">Finalizada</option>
                  <option value="Archivada">Archivada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Clínica
                </label>
                <select
                  value={filtros.clinicaId || ''}
                  onChange={(e) => handleCambio('clinicaId', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todas</option>
                  {clinicas.map((clinica) => (
                    <option key={clinica._id} value={clinica._id}>
                      {clinica.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio || ''}
                  onChange={(e) => handleCambio('fechaInicio', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin || ''}
                  onChange={(e) => handleCambio('fechaFin', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {tieneFiltros && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>Resultados encontrados</span>
            <span>{[filtros.status, filtros.clinicaId, filtros.fechaInicio, filtros.fechaFin].filter(Boolean).length} filtros aplicados</span>
          </div>
        )}
      </div>
    </div>
  );
}



