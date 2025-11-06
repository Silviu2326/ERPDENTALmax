import { Search, Filter, X } from 'lucide-react';
import { FiltrosPromociones } from '../api/promocionesApi';

interface FiltrosPromocionesProps {
  filtros: FiltrosPromociones;
  onFiltrosChange: (filtros: FiltrosPromociones) => void;
  onLimpiar: () => void;
}

export default function FiltrosPromocionesComponent({
  filtros,
  onFiltrosChange,
  onLimpiar,
}: FiltrosPromocionesProps) {
  const tieneFiltros = !!(
    filtros.estado ||
    filtros.tipo ||
    filtros.search ||
    filtros.fechaInicio ||
    filtros.fechaFin
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filtros</h3>
        {tieneFiltros && (
          <button
            onClick={onLimpiar}
            className="ml-auto flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda por texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Nombre, código..."
              value={filtros.search || ''}
              onChange={(e) => onFiltrosChange({ ...filtros, search: e.target.value || undefined })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={filtros.estado || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, estado: e.target.value as any || undefined })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
            <option value="expirada">Expirada</option>
          </select>
        </div>

        {/* Filtro por tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={filtros.tipo || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, tipo: e.target.value as any || undefined })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="porcentaje">Porcentaje</option>
            <option value="fijo">Monto Fijo</option>
            <option value="2x1">2x1</option>
            <option value="paquete">Paquete</option>
          </select>
        </div>

        {/* Filtro por fecha inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filtros.fechaInicio || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, fechaInicio: e.target.value || undefined })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtro por fecha fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Fin
          </label>
          <input
            type="date"
            value={filtros.fechaFin || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, fechaFin: e.target.value || undefined })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}


