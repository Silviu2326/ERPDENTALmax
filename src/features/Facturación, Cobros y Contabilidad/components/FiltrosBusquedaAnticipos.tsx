import { Calendar, Filter, X } from 'lucide-react';
import { FiltrosAnticipos } from '../api/anticiposApi';

interface FiltrosBusquedaAnticiposProps {
  filtros: FiltrosAnticipos;
  onFiltrosChange: (filtros: FiltrosAnticipos) => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosBusquedaAnticipos({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
}: FiltrosBusquedaAnticiposProps) {
  const tieneFiltrosActivos =
    filtros.pacienteId || filtros.fechaInicio || filtros.fechaFin || filtros.estado;

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaInicio: e.target.value || undefined,
    });
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaFin: e.target.value || undefined,
    });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      estado: (e.target.value as 'disponible' | 'aplicado' | 'devuelto') || undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
        </div>
        {tieneFiltrosActivos && (
          <button
            onClick={onLimpiarFiltros}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rango de fechas */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Fecha Inicio</span>
          </label>
          <input
            type="date"
            value={filtros.fechaInicio || ''}
            onChange={handleFechaInicioChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Fecha Fin</span>
          </label>
          <input
            type="date"
            value={filtros.fechaFin || ''}
            onChange={handleFechaFinChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            value={filtros.estado || ''}
            onChange={handleEstadoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="aplicado">Aplicado</option>
            <option value="devuelto">Devuelto</option>
          </select>
        </div>
      </div>
    </div>
  );
}


