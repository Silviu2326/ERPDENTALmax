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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filtros de Análisis</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fecha Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Fecha Inicio</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Fecha Fin</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Clínica */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Sede (Opcional)</span>
          </label>
          <input
            type="text"
            value={clinicId || ''}
            onChange={(e) => onClinicIdChange(e.target.value || undefined)}
            placeholder="ID de Sede"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Origen del Lead */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span>Origen del Lead (Opcional)</span>
          </label>
          <input
            type="text"
            value={source || ''}
            onChange={(e) => onSourceChange(e.target.value || undefined)}
            placeholder="Ej: Facebook Ads, Google"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onApplyFilters}
          disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>{loading ? 'Aplicando...' : 'Aplicar Filtros'}</span>
        </button>
      </div>
    </div>
  );
}


