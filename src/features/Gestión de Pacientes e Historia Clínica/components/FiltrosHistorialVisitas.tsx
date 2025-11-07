import { useState } from 'react';
import { Filter, X, Calendar, ChevronDown, ChevronUp, User } from 'lucide-react';
import { FiltrosVisitas } from '../api/historialVisitasApi';

interface FiltrosHistorialVisitasProps {
  filtros: FiltrosVisitas;
  onFiltrosChange: (filtros: FiltrosVisitas) => void;
  profesionales?: Array<{ _id: string; nombre: string; apellidos: string }>;
}

export default function FiltrosHistorialVisitas({
  filtros,
  onFiltrosChange,
  profesionales = [],
}: FiltrosHistorialVisitasProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleFechaDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaDesde: e.target.value || undefined,
    });
  };

  const handleFechaHastaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaHasta: e.target.value || undefined,
    });
  };

  const handleProfesionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      profesionalId: e.target.value || undefined,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
  };

  const tieneFiltrosActivos = !!(filtros.fechaDesde || filtros.fechaHasta || filtros.profesionalId);
  const numFiltrosActivos = [
    filtros.fechaDesde && '1',
    filtros.fechaHasta && '1',
    filtros.profesionalId && '1',
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
            >
              <Filter size={18} className={tieneFiltrosActivos ? "opacity-100" : "opacity-70"} />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                  {numFiltrosActivos}
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
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
              >
                <X size={18} className="opacity-70" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fecha Desde */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={filtros.fechaDesde || ''}
                  onChange={handleFechaDesdeChange}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Fecha Hasta */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={filtros.fechaHasta || ''}
                  onChange={handleFechaHastaChange}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              {/* Profesional */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Profesional
                </label>
                <select
                  value={filtros.profesionalId || ''}
                  onChange={handleProfesionalChange}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los profesionales</option>
                  {profesionales.map((prof) => (
                    <option key={prof._id} value={prof._id}>
                      {prof.nombre} {prof.apellidos}
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



