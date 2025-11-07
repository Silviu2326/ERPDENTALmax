import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FiltrosEquipos } from '../api/equiposApi';

interface FiltrosBusquedaEquiposProps {
  filtros: FiltrosEquipos;
  onFiltrosChange: (filtros: FiltrosEquipos) => void;
  sedes?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosBusquedaEquipos({
  filtros,
  onFiltrosChange,
  sedes = [],
}: FiltrosBusquedaEquiposProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [busqueda, setBusqueda] = useState(filtros.query || '');

  const estados = ['Operativo', 'En Mantenimiento', 'Fuera de Servicio', 'De Baja'];

  const handleBusquedaChange = (value: string) => {
    setBusqueda(value);
    onFiltrosChange({
      ...filtros,
      query: value,
      page: 1, // Resetear a primera página al buscar
    });
  };

  const handleEstadoChange = (estado: string) => {
    onFiltrosChange({
      ...filtros,
      estado: estado === 'todos' ? undefined : estado,
      page: 1,
    });
  };

  const handleSedeChange = (sedeId: string) => {
    onFiltrosChange({
      ...filtros,
      sedeId: sedeId === 'todos' ? undefined : sedeId,
      page: 1,
    });
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  const tieneFiltrosActivos = filtros.query || filtros.estado || filtros.sedeId;
  const numFiltrosActivos = [filtros.query, filtros.estado, filtros.sedeId].filter(Boolean).length;

  return (
    <div className="bg-white shadow-sm rounded-lg mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, marca, modelo o número de serie..."
                value={busqueda}
                onChange={(e) => handleBusquedaChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>

            {/* Botón de filtros avanzados */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              <Filter size={18} className="opacity-70" />
              <span>Filtros</span>
              {tieneFiltrosActivos && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {numFiltrosActivos}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={18} className="opacity-70" />
              ) : (
                <ChevronDown size={18} className="opacity-70" />
              )}
            </button>

            {/* Botón limpiar filtros */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              >
                <X size={18} className="opacity-70" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.estado || 'todos'}
                  onChange={(e) => handleEstadoChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="todos">Todos los estados</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por sede */}
              {sedes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sede
                  </label>
                  <select
                    value={filtros.sedeId || 'todos'}
                    onChange={(e) => handleSedeChange(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  >
                    <option value="todos">Todas las sedes</option>
                    {sedes.map((sede) => (
                      <option key={sede._id} value={sede._id}>
                        {sede.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {tieneFiltrosActivos && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{numFiltrosActivos} filtro{numFiltrosActivos > 1 ? 's' : ''} aplicado{numFiltrosActivos > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}



