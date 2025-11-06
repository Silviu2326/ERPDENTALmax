import { Filter, RefreshCw } from 'lucide-react';
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
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filtros de Análisis</span>
        </h2>
        <button
          onClick={onActualizar}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => onFiltrosChange({ ...filtros, fechaInicio: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Fin
          </label>
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => onFiltrosChange({ ...filtros, fechaFin: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sede (Opcional)
          </label>
          <input
            type="text"
            value={filtros.sedeId || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, sedeId: e.target.value || undefined })}
            placeholder="ID de Sede"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Área Clínica (Opcional)
          </label>
          <select
            value={filtros.areaClinica || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, areaClinica: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  );
}


