import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Búsqueda por texto */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, marca, modelo o número de serie..."
            value={busqueda}
            onChange={(e) => handleBusquedaChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Botón de filtros avanzados */}
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
            mostrarFiltros || tieneFiltrosActivos
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {[filtros.query, filtros.estado, filtros.sedeId].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Botón limpiar filtros */}
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Filtros avanzados */}
      {mostrarFiltros && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado || 'todos'}
              onChange={(e) => handleEstadoChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sede
              </label>
              <select
                value={filtros.sedeId || 'todos'}
                onChange={(e) => handleSedeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      )}
    </div>
  );
}


