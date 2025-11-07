import { Calendar, Building2, Filter } from 'lucide-react';

export interface FunnelFiltersProps {
  startDate: string;
  endDate: string;
  clinicId?: string;
  source?: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClinicIdChange: (clinicId: string | undefined) => void;
  onSourceChange: (source: string | undefined) => void;
  onApplyFilters: () => void;
  loading?: boolean;
}

export default function FunnelFilters({
  startDate,
  endDate,
  clinicId,
  source,
  onStartDateChange,
  onEndDateChange,
  onClinicIdChange,
  onSourceChange,
  onApplyFilters,
  loading = false,
}: FunnelFiltersProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-0">
      <div className="px-4 py-3">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Fecha Inicio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>

                {/* Fecha Fin */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>

                {/* Clínica */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Building2 size={16} className="inline mr-1" />
                    Sede (Opcional)
                  </label>
                  <input
                    type="text"
                    value={clinicId || ''}
                    onChange={(e) => onClinicIdChange(e.target.value || undefined)}
                    placeholder="ID de Sede"
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>

                {/* Origen del Lead */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Origen del Lead (Opcional)
                  </label>
                  <input
                    type="text"
                    value={source || ''}
                    onChange={(e) => onSourceChange(e.target.value || undefined)}
                    placeholder="Ej: Facebook Ads, Google"
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={onApplyFilters}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Filter size={20} />
                <span>{loading ? 'Aplicando...' : 'Aplicar Filtros'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



