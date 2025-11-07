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
    <div className="bg-white shadow-sm rounded-xl mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre comercial, razón social o CIF..."
                value={filtros.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>

            {/* Filtro por estado */}
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium text-slate-700">
                <Filter size={16} className="inline mr-1" />
              </label>
              <select
                value={filtros.estado || 'todos'}
                onChange={(e) => handleEstadoChange(e.target.value as 'activo' | 'inactivo' | 'todos')}
                className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
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
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
              >
                <X size={18} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



