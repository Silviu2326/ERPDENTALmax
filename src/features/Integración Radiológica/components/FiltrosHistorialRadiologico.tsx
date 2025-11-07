import { useState } from 'react';
import { Filter, X, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { FiltrosRadiologias, Radiologia } from '../api/radiologiaApi';

interface FiltrosHistorialRadiologicoProps {
  filtros: FiltrosRadiologias;
  onFiltrosChange: (filtros: FiltrosRadiologias) => void;
}

const TIPOS_RADIOGRAFIA: Radiologia['tipoRadiografia'][] = [
  'Periapical',
  'Bitewing',
  'Oclusal',
  'Panorámica',
  'CBCT',
];

export default function FiltrosHistorialRadiologico({
  filtros,
  onFiltrosChange,
}: FiltrosHistorialRadiologicoProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleTipoChange = (tipo: Radiologia['tipoRadiografia'] | '') => {
    onFiltrosChange({
      ...filtros,
      tipo: tipo === '' ? undefined : tipo,
      page: 1, // Resetear a primera página al filtrar
    });
  };

  const handleFechaDesdeChange = (fecha: string) => {
    onFiltrosChange({
      ...filtros,
      fechaDesde: fecha || undefined,
      page: 1,
    });
  };

  const handleFechaHastaChange = (fecha: string) => {
    onFiltrosChange({
      ...filtros,
      fechaHasta: fecha || undefined,
      page: 1,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: filtros.page || 1,
      limit: filtros.limit || 20,
    });
  };

  const tieneFiltrosActivos = Boolean(filtros.tipo || filtros.fechaDesde || filtros.fechaHasta);
  const numeroFiltrosActivos = [filtros.tipo, filtros.fechaDesde, filtros.fechaHasta].filter(Boolean).length;

  return (
    <div className="bg-white shadow-sm rounded-xl p-0">
      <div className="px-4 py-3">
        <div className="rounded-2xl bg-slate-100 p-1">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
            >
              <Filter size={18} className={mostrarFiltros ? 'opacity-100' : 'opacity-70'} />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {numeroFiltrosActivos}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={18} className="opacity-70" />
              ) : (
                <ChevronDown size={18} className="opacity-70" />
              )}
            </button>
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
              >
                <X size={16} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {mostrarFiltros && (
        <div className="px-4 pb-4">
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por tipo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Radiografía
                </label>
                <select
                  value={filtros.tipo || ''}
                  onChange={(e) => handleTipoChange(e.target.value as Radiologia['tipoRadiografia'] | '')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
                >
                  <option value="">Todos los tipos</option>
                  {TIPOS_RADIOGRAFIA.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por fecha desde */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={filtros.fechaDesde || ''}
                  onChange={(e) => handleFechaDesdeChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
                />
              </div>

              {/* Filtro por fecha hasta */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={filtros.fechaHasta || ''}
                  onChange={(e) => handleFechaHastaChange(e.target.value)}
                  min={filtros.fechaDesde}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
                />
              </div>
            </div>

            {/* Resumen de resultados */}
            {tieneFiltrosActivos && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{numeroFiltrosActivos} filtro{numeroFiltrosActivos !== 1 ? 's' : ''} aplicado{numeroFiltrosActivos !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



