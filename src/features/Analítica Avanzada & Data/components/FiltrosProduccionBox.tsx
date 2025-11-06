import { Calendar, Filter, RefreshCw, Building2, User, Box } from 'lucide-react';
import { FiltrosProduccionBox } from '../api/analiticaApi';

interface FiltrosProduccionBoxProps {
  filtros: FiltrosProduccionBox;
  onFiltrosChange: (filtros: FiltrosProduccionBox) => void;
  onAplicarFiltros: () => void;
  loading?: boolean;
}

export default function FiltrosProduccionBoxComponent({
  filtros,
  onFiltrosChange,
  onAplicarFiltros,
  loading = false,
}: FiltrosProduccionBoxProps) {
  const handleChange = (campo: keyof FiltrosProduccionBox, valor: string) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filtros de Análisis</span>
        </h2>
        <button
          onClick={onAplicarFiltros}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Fecha Inicio</span>
          </label>
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => handleChange('fechaInicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Fecha Fin</span>
          </label>
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => handleChange('fechaFin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Building2 className="w-4 h-4" />
            <span>Sede (Opcional)</span>
          </label>
          <input
            type="text"
            value={filtros.sedeId || ''}
            onChange={(e) => handleChange('sedeId', e.target.value)}
            placeholder="ID de Sede"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>Profesional (Opcional)</span>
          </label>
          <input
            type="text"
            value={filtros.profesionalId || ''}
            onChange={(e) => handleChange('profesionalId', e.target.value)}
            placeholder="ID de Profesional"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Box className="w-4 h-4" />
            <span>Box (Opcional)</span>
          </label>
          <input
            type="text"
            value={filtros.boxId || ''}
            onChange={(e) => handleChange('boxId', e.target.value)}
            placeholder="ID de Box"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}


