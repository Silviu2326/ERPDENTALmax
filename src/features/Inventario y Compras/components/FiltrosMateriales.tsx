import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FiltrosMateriales } from '../api/materialesApi';

interface FiltrosMaterialesProps {
  filtros: FiltrosMateriales;
  onFiltrosChange: (filtros: FiltrosMateriales) => void;
  categorias?: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosMaterialesComponent({
  filtros,
  onFiltrosChange,
  categorias = [],
}: FiltrosMaterialesProps) {
  const [busqueda, setBusqueda] = useState(filtros.search || '');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Aplicar debounce a la búsqueda
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onFiltrosChange({
        ...filtros,
        search: busqueda || undefined,
        page: 1, // Resetear a primera página al buscar
      });
    }, 500);

    setDebounceTimer(timer);

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [busqueda]);

  const handleCategoriaChange = (categoriaId: string) => {
    onFiltrosChange({
      ...filtros,
      categoria: categoriaId || undefined,
      page: 1,
    });
  };

  const handleEstadoChange = (estado: 'en_stock' | 'bajo_stock' | 'agotado' | '') => {
    onFiltrosChange({
      ...filtros,
      estado: estado || undefined,
      page: 1,
    });
  };

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    onFiltrosChange({
      page: filtros.page || 1,
      limit: filtros.limit || 20,
    });
  };

  const tieneFiltrosActivos = filtros.search || filtros.categoria || filtros.estado;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
        </div>
        {tieneFiltrosActivos && (
          <button
            onClick={handleLimpiarFiltros}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <X className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda por texto */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtro por categoría */}
        <div>
          <select
            value={filtros.categoria || ''}
            onChange={(e) => handleCategoriaChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por estado de stock */}
        <div>
          <select
            value={filtros.estado || ''}
            onChange={(e) => handleEstadoChange(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="en_stock">En stock</option>
            <option value="bajo_stock">Bajo stock</option>
            <option value="agotado">Agotado</option>
          </select>
        </div>
      </div>
    </div>
  );
}


