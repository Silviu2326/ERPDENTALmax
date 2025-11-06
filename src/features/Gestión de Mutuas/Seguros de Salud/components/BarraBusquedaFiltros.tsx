import { Search, Filter, X } from 'lucide-react';
import { FiltrosMutuas } from '../api/mutuasApi';

interface BarraBusquedaFiltrosProps {
  filtros: FiltrosMutuas;
  onFiltrosChange: (filtros: FiltrosMutuas) => void;
}

export default function BarraBusquedaFiltros({
  filtros,
  onFiltrosChange,
}: BarraBusquedaFiltrosProps) {
  const handleSearchChange = (search: string) => {
    onFiltrosChange({
      ...filtros,
      search: search || undefined,
      page: 1, // Resetear a la primera página al buscar
    });
  };

  const handleEstadoChange = (estado: 'activo' | 'inactivo' | 'todos') => {
    onFiltrosChange({
      ...filtros,
      estado: estado === 'todos' ? undefined : estado,
      page: 1, // Resetear a la primera página al filtrar
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  const tieneFiltros = filtros.search || filtros.estado;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre comercial, razón social o CIF..."
              value={filtros.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={filtros.estado || 'todos'}
            onChange={(e) => handleEstadoChange(e.target.value as 'activo' | 'inactivo' | 'todos')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todas las mutuas</option>
            <option value="activo">Solo activas</option>
            <option value="inactivo">Solo inactivas</option>
          </select>
        </div>

        {/* Botón limpiar filtros */}
        {tieneFiltros && (
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>
    </div>
  );
}


