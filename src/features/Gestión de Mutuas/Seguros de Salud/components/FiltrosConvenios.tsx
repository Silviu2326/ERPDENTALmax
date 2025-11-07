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

  const tieneFiltrosActivos = !!(filtros.search || filtros.mutuaId || filtros.estado);
  const numeroFiltrosActivos = [filtros.search, filtros.mutuaId, filtros.estado].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-200">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4 flex-wrap">
            {/* Input de búsqueda */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={filtros.search || ''}
                  onChange={handleSearchChange}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
            </div>

            {/* Filtro por mutua */}
            <div className="min-w-[200px]">
              <select
                value={filtros.mutuaId || ''}
                onChange={handleMutuaChange}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="borrador">Borrador</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all border border-slate-300 text-slate-700 hover:bg-white/70"
              >
                <Filter className="w-4 h-4" />
                Limpiar
                {numeroFiltrosActivos > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-slate-200 text-slate-700 rounded-full">
                    {numeroFiltrosActivos}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Resumen de resultados */}
        {tieneFiltrosActivos && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{numeroFiltrosActivos} filtro{numeroFiltrosActivos !== 1 ? 's' : ''} aplicado{numeroFiltrosActivos !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}



