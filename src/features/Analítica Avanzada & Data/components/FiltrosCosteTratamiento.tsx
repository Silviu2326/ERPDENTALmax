import { Filter, RefreshCw, Calendar, Building2, Stethoscope } from 'lucide-react';
import { FiltrosCosteTratamiento } from '../api/analiticaApi';

interface FiltrosCosteTratamientoProps {
  filtros: FiltrosCosteTratamiento;
  onFiltrosChange: (filtros: FiltrosCosteTratamiento) => void;
  onActualizar: () => void;
  loading?: boolean;
}

export default function FiltrosCosteTratamiento({
  filtros,
  onFiltrosChange,
  onActualizar,
  loading = false,
}: FiltrosCosteTratamientoProps) {
  const filtrosActivos = [
    filtros.sedeId,
    filtros.areaClinica,
  ].filter(Boolean).length;

  return (
    <div className="bg-white shadow-sm rounded-xl mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda y acciones */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Filtros de Análisis</span>
                {filtrosActivos > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    {filtrosActivos}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onActualizar}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => onFiltrosChange({ ...filtros, fechaInicio: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => onFiltrosChange({ ...filtros, fechaFin: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Building2 size={16} className="inline mr-1" />
                Sede (Opcional)
              </label>
              <input
                type="text"
                value={filtros.sedeId || ''}
                onChange={(e) => onFiltrosChange({ ...filtros, sedeId: e.target.value || undefined })}
                placeholder="ID de Sede"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Stethoscope size={16} className="inline mr-1" />
                Área Clínica (Opcional)
              </label>
              <select
                value={filtros.areaClinica || ''}
                onChange={(e) => onFiltrosChange({ ...filtros, areaClinica: e.target.value || undefined })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              >
                <option value="">Todas las áreas</option>
                <option value="Higiene">Higiene</option>
                <option value="Implantología">Implantología</option>
                <option value="Ortodoncia">Ortodoncia</option>
                <option value="Endodoncia">Endodoncia</option>
                <option value="General">General</option>
                <option value="Periodoncia">Periodoncia</option>
                <option value="Estética">Estética</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



