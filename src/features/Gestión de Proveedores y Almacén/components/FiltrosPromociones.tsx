import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { FiltrosPromociones } from '../api/promocionesApi';

interface FiltrosPromocionesProps {
  filtros: FiltrosPromociones;
  onFiltrosChange: (filtros: FiltrosPromociones) => void;
  onLimpiar: () => void;
}

export default function FiltrosPromocionesComponent({
  filtros,
  onFiltrosChange,
  onLimpiar,
}: FiltrosPromocionesProps) {
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);
  
  const tieneFiltros = !!(
    filtros.estado ||
    filtros.tipo ||
    filtros.search ||
    filtros.fechaInicio ||
    filtros.fechaFin
  );

  const numFiltrosActivos = [
    filtros.estado,
    filtros.tipo,
    filtros.fechaInicio,
    filtros.fechaFin,
  ].filter(Boolean).length;

  return (
    <div className="bg-white shadow-sm rounded-xl p-0">
      <div className="p-4">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              {/* Input de búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, código..."
                  value={filtros.search || ''}
                  onChange={(e) => onFiltrosChange({ ...filtros, search: e.target.value || undefined })}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>

              {/* Botón de filtros */}
              <button
                onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              >
                <Filter size={18} className="opacity-70" />
                <span>Filtros</span>
                {numFiltrosActivos > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {numFiltrosActivos}
                  </span>
                )}
                {filtrosExpandidos ? (
                  <ChevronUp size={18} className="opacity-70" />
                ) : (
                  <ChevronDown size={18} className="opacity-70" />
                )}
              </button>

              {/* Botón limpiar (si hay filtros activos) */}
              {tieneFiltros && (
                <button
                  onClick={onLimpiar}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
                >
                  <X size={18} />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {filtrosExpandidos && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro por estado */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <select
                    value={filtros.estado || ''}
                    onChange={(e) => onFiltrosChange({ ...filtros, estado: e.target.value as any || undefined })}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  >
                    <option value="">Todos</option>
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                    <option value="expirada">Expirada</option>
                  </select>
                </div>

                {/* Filtro por tipo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Tipo
                  </label>
                  <select
                    value={filtros.tipo || ''}
                    onChange={(e) => onFiltrosChange({ ...filtros, tipo: e.target.value as any || undefined })}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  >
                    <option value="">Todos</option>
                    <option value="porcentaje">Porcentaje</option>
                    <option value="fijo">Monto Fijo</option>
                    <option value="2x1">2x1</option>
                    <option value="paquete">Paquete</option>
                  </select>
                </div>

                {/* Filtro por fecha inicio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaInicio || ''}
                    onChange={(e) => onFiltrosChange({ ...filtros, fechaInicio: e.target.value || undefined })}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>

                {/* Filtro por fecha fin */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaFin || ''}
                    onChange={(e) => onFiltrosChange({ ...filtros, fechaFin: e.target.value || undefined })}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumen de resultados */}
      {tieneFiltros && (
        <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4 px-4 pb-4">
          <span>{numFiltrosActivos} filtro(s) aplicado(s)</span>
        </div>
      )}
    </div>
  );
}



