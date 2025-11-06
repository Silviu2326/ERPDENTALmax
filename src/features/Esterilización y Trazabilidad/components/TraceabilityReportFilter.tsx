import { useState } from 'react';
import { Filter, X, Calendar, Search } from 'lucide-react';
import { TraceabilityReportFilters } from '../api/traceabilityApi';

interface TraceabilityReportFilterProps {
  filtros: TraceabilityReportFilters;
  onFiltrosChange: (filtros: TraceabilityReportFilters) => void;
  onBuscar: () => void;
  loading?: boolean;
}

export default function TraceabilityReportFilter({
  filtros,
  onFiltrosChange,
  onBuscar,
  loading = false,
}: TraceabilityReportFilterProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  const handleChange = (key: keyof TraceabilityReportFilters, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
      page: 1, // Resetear a la primera página al cambiar filtros
    });
  };

  const limpiarFiltros = () => {
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);

    onFiltrosChange({
      startDate: fechaInicio.toISOString().split('T')[0],
      endDate: fechaFin.toISOString().split('T')[0],
      page: 1,
      limit: filtros.limit || 20,
    });
  };

  const tieneFiltrosActivos =
    filtros.patientId || filtros.instrumentKitId || filtros.sterilizationCycleId || filtros.startDate || filtros.endDate;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros de Búsqueda</span>
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              Activos
            </span>
          )}
        </button>

        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Filtro por DNI/Nombre de Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DNI / Nombre de Paciente
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={filtros.patientId || ''}
                onChange={(e) => handleChange('patientId', e.target.value)}
                placeholder="Buscar por DNI o nombre"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtro por Código de Kit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Kit de Instrumental
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={filtros.instrumentKitId || ''}
                onChange={(e) => handleChange('instrumentKitId', e.target.value)}
                placeholder="Ej: KIT-001"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtro por ID de Ciclo de Esterilización */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID de Ciclo de Esterilización
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={filtros.sterilizationCycleId || ''}
                onChange={(e) => handleChange('sterilizationCycleId', e.target.value)}
                placeholder="Ej: CYC-2024-001"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtro por Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro por Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Botón de Búsqueda */}
          <div className="flex items-end">
            <button
              onClick={onBuscar}
              disabled={loading}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Buscando...' : 'Buscar'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


