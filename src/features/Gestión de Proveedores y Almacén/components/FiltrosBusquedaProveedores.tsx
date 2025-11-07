import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FiltrosBusquedaProveedores } from '../api/proveedoresApi';

interface FiltrosBusquedaProveedoresProps {
  filtros: FiltrosBusquedaProveedores;
  onFiltrosChange: (filtros: FiltrosBusquedaProveedores) => void;
}

export default function FiltrosBusquedaProveedores({
  filtros,
  onFiltrosChange,
}: FiltrosBusquedaProveedoresProps) {
  const [searchTerm, setSearchTerm] = useState(filtros.search || '');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  // Sincronizar searchTerm con filtros.search cuando cambia desde fuera
  useEffect(() => {
    if (filtros.search !== searchTerm) {
      setSearchTerm(filtros.search || '');
    }
  }, [filtros.search]);

  // Debouncing para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filtros.search) {
        onFiltrosChange({
          ...filtros,
          search: searchTerm || undefined,
          page: 1, // Resetear a página 1 cuando cambia la búsqueda
        });
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleEstadoChange = (estado: string) => {
    onFiltrosChange({
      ...filtros,
      estado: estado ? (estado as 'activo' | 'inactivo') : undefined,
      page: 1,
    });
  };

  const handleCategoriaChange = (categoria: string) => {
    onFiltrosChange({
      ...filtros,
      categoria: categoria || undefined,
      page: 1,
    });
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 20,
    });
  };

  const categoriasComunes = [
    'Material de Ortodoncia',
    'Implantes',
    'Consumibles',
    'Servicios de Laboratorio',
    'Equipamiento',
    'Materiales Estéticos',
    'Anestesia',
    'Otros',
  ];

  const filtrosActivos = [filtros.search, filtros.estado, filtros.categoria].filter(Boolean).length;

  return (
    <div className="mb-6 bg-white shadow-sm rounded-lg p-0">
      <div className="p-4 space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre comercial, razón social o RFC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>

            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {filtrosActivos > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {filtrosActivos}
                </span>
              )}
              {mostrarFiltrosAvanzados ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Botón limpiar filtros */}
            {filtrosActivos > 0 && (
              <button
                onClick={limpiarFiltros}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de Filtros Avanzados */}
        {mostrarFiltrosAvanzados && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleEstadoChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Categoría
                </label>
                <select
                  value={filtros.categoria || ''}
                  onChange={(e) => handleCategoriaChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todas las categorías</option>
                  {categoriasComunes.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {filtrosActivos > 0 && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filtrosActivos} filtros aplicados</span>
          </div>
        )}
      </div>
    </div>
  );
}



