import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { EstadoPublicacion, PlataformaSocial, FiltrosPublicaciones } from '../api/publicacionesSocialesApi';

interface FiltrosCalendarioEditorialProps {
  filtros: FiltrosPublicaciones;
  onFiltrosChange: (filtros: FiltrosPublicaciones) => void;
}

export default function FiltrosCalendarioEditorial({
  filtros,
  onFiltrosChange,
}: FiltrosCalendarioEditorialProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const estados: EstadoPublicacion[] = ['borrador', 'programado', 'publicado', 'error', 'archivado'];
  const plataformas: PlataformaSocial[] = ['facebook', 'instagram', 'linkedin', 'twitter', 'tiktok'];

  const handleEstadoChange = (estado: EstadoPublicacion | 'todos') => {
    onFiltrosChange({
      ...filtros,
      estado: estado === 'todos' ? undefined : estado,
    });
  };

  const handlePlataformaChange = (plataforma: PlataformaSocial | 'todas') => {
    onFiltrosChange({
      ...filtros,
      plataforma: plataforma === 'todas' ? undefined : plataforma,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });
  };

  const tieneFiltrosActivos = filtros.estado || filtros.plataforma;
  const numFiltrosActivos = [filtros.estado, filtros.plataforma].filter(Boolean).length;

  return (
    <div className="bg-white shadow-sm rounded-lg mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda y filtros */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white ring-1 ring-slate-200"
            >
              <Filter size={18} />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {numFiltrosActivos}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={16} className="ml-1" />
              ) : (
                <ChevronDown size={16} className="ml-1" />
              )}
            </button>

            {/* Botón limpiar filtros */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
              >
                <X size={18} />
                <span>Limpiar filtros</span>
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
                  value={filtros.estado || 'todos'}
                  onChange={(e) => handleEstadoChange(e.target.value as EstadoPublicacion | 'todos')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="todos">Todos los estados</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Plataforma
                </label>
                <select
                  value={filtros.plataforma || 'todas'}
                  onChange={(e) => handlePlataformaChange(e.target.value as PlataformaSocial | 'todas')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="todas">Todas las plataformas</option>
                  {plataformas.map((plataforma) => (
                    <option key={plataforma} value={plataforma}>
                      {plataforma.charAt(0).toUpperCase() + plataforma.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resumen de resultados */}
            {tieneFiltrosActivos && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{numFiltrosActivos} filtro{numFiltrosActivos > 1 ? 's' : ''} aplicado{numFiltrosActivos > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



