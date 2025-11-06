import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { FiltrosLogs } from '../api/rgpdApi';

interface FiltrosLogsProps {
  onFiltrosChange: (filtros: FiltrosLogs) => void;
}

export default function FiltrosLogs({ onFiltrosChange }: FiltrosLogsProps) {
  const [filtros, setFiltros] = useState<FiltrosLogs>({
    usuarioId: '',
    accion: '',
    entidadId: '',
    fechaInicio: '',
    fechaFin: '',
  });

  const handleChange = (field: keyof FiltrosLogs, value: string) => {
    const nuevosFiltros = { ...filtros, [field]: value };
    setFiltros(nuevosFiltros);
    onFiltrosChange(nuevosFiltros);
  };

  const handleReset = () => {
    const filtrosVacios: FiltrosLogs = {
      usuarioId: '',
      accion: '',
      entidadId: '',
      fechaInicio: '',
      fechaFin: '',
    };
    setFiltros(filtrosVacios);
    onFiltrosChange(filtrosVacios);
  };

  const hasActiveFilters = Object.values(filtros).some((value) => value !== '');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-900">Filtros de Búsqueda</h4>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Usuario ID */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">ID Usuario</label>
          <input
            type="text"
            value={filtros.usuarioId || ''}
            onChange={(e) => handleChange('usuarioId', e.target.value)}
            placeholder="Buscar por usuario..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Acción */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Acción</label>
          <input
            type="text"
            value={filtros.accion || ''}
            onChange={(e) => handleChange('accion', e.target.value)}
            placeholder="Buscar por acción..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Entidad ID */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">ID Entidad</label>
          <input
            type="text"
            value={filtros.entidadId || ''}
            onChange={(e) => handleChange('entidadId', e.target.value)}
            placeholder="Buscar por entidad..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Fecha Inicio */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Inicio</label>
          <input
            type="date"
            value={filtros.fechaInicio || ''}
            onChange={(e) => handleChange('fechaInicio', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Fin</label>
          <input
            type="date"
            value={filtros.fechaFin || ''}
            onChange={(e) => handleChange('fechaFin', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}


