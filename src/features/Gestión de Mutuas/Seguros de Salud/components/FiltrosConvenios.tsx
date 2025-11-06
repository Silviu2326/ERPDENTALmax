import { Search, Filter } from 'lucide-react';
import { FiltrosConvenios } from '../api/conveniosApi';

interface FiltrosConveniosProps {
  filtros: FiltrosConvenios;
  onFiltrosChange: (filtros: FiltrosConvenios) => void;
  mutuas?: Array<{ _id: string; nombreComercial: string }>;
}

export default function FiltrosConveniosComponent({
  filtros,
  onFiltrosChange,
  mutuas = [],
}: FiltrosConveniosProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      search: e.target.value || undefined,
      page: 1, // Reset a la primera página al buscar
    });
  };

  const handleMutuaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      mutuaId: e.target.value || undefined,
      page: 1,
    });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      estado: e.target.value as 'activo' | 'inactivo' | 'borrador' | undefined || undefined,
      page: 1,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Búsqueda por texto */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={filtros.search || ''}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro por mutua */}
        <div className="min-w-[200px]">
          <select
            value={filtros.mutuaId || ''}
            onChange={handleMutuaChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las mutuas</option>
            {mutuas.map((mutua) => (
              <option key={mutua._id} value={mutua._id}>
                {mutua.nombreComercial}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por estado */}
        <div className="min-w-[150px]">
          <select
            value={filtros.estado || ''}
            onChange={handleEstadoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="borrador">Borrador</option>
          </select>
        </div>

        {/* Botón limpiar filtros */}
        {(filtros.search || filtros.mutuaId || filtros.estado) && (
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}


