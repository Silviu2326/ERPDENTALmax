import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FiltrosLotes } from '../api/lotesApi';

interface FiltrosCaducidadProps {
  filtros: FiltrosLotes;
  onFiltrosChange: (filtros: FiltrosLotes) => void;
  productos?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosCaducidad({
  filtros,
  onFiltrosChange,
  productos = [],
}: FiltrosCaducidadProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleFiltroChange = (campo: keyof FiltrosLotes, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor,
      page: 1, // Resetear a la primera página al cambiar filtros
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  const tieneFiltrosActivos = Boolean(
    filtros.productoId ||
    filtros.fechaCaducidadAntes ||
    filtros.fechaCaducidadDespues ||
    filtros.estado
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número de lote..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                // Aquí podrías agregar búsqueda por número de lote si el backend lo soporta
              }}
            />
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              mostrarFiltros || tieneFiltrosActivos
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {tieneFiltrosActivos && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </button>
          {tieneFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Limpiar filtros"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto
            </label>
            <select
              value={filtros.productoId || ''}
              onChange={(e) => handleFiltroChange('productoId', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los productos</option>
              {productos.map((producto) => (
                <option key={producto._id} value={producto._id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) =>
                handleFiltroChange('estado', (e.target.value || undefined) as any)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="PorCaducar">Por Caducar</option>
              <option value="Caducado">Caducado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caduca antes de
            </label>
            <input
              type="date"
              value={filtros.fechaCaducidadAntes || ''}
              onChange={(e) =>
                handleFiltroChange('fechaCaducidadAntes', e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caduca después de
            </label>
            <input
              type="date"
              value={filtros.fechaCaducidadDespues || ''}
              onChange={(e) =>
                handleFiltroChange('fechaCaducidadDespues', e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}


