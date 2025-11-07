import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FiltrosBusquedaProductos, CategoriaProducto } from '../api/productosApi';

interface BarraBusquedaFiltrosProductosProps {
  filtros: FiltrosBusquedaProductos;
  onFiltrosChange: (filtros: FiltrosBusquedaProductos) => void;
}

export default function BarraBusquedaFiltrosProductos({
  filtros,
  onFiltrosChange,
}: BarraBusquedaFiltrosProductosProps) {
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

  const handleCategoriaChange = (categoria: string) => {
    onFiltrosChange({
      ...filtros,
      categoria: categoria ? (categoria as CategoriaProducto) : undefined,
      page: 1,
    });
  };

  const handleProveedorChange = (proveedor: string) => {
    onFiltrosChange({
      ...filtros,
      proveedor: proveedor || undefined,
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

  const categorias: CategoriaProducto[] = ['Consumible', 'Instrumental', 'Equipamiento', 'Oficina'];
  
  const filtrosActivos = (filtros.search ? 1 : 0) + (filtros.categoria ? 1 : 0) + (filtros.proveedor ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por SKU o nombre de producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>

            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70 bg-white/50 ring-1 ring-slate-200"
            >
              <Filter size={18} className={mostrarFiltrosAvanzados || filtrosActivos > 0 ? 'opacity-100' : 'opacity-70'} />
              <span>Filtros</span>
              {filtrosActivos > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                  {filtrosActivos}
                </span>
              )}
              {mostrarFiltrosAvanzados ? (
                <ChevronUp size={18} className="opacity-70" />
              ) : (
                <ChevronDown size={18} className="opacity-70" />
              )}
            </button>

            {/* Botón limpiar filtros */}
            {filtrosActivos > 0 && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70 bg-white/50 ring-1 ring-slate-200"
              >
                <X size={18} className="opacity-70" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltrosAvanzados && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Categoría
                </label>
                <select
                  value={filtros.categoria || ''}
                  onChange={(e) => handleCategoriaChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Search size={16} className="inline mr-1" />
                  Proveedor
                </label>
                <input
                  type="text"
                  placeholder="Buscar por proveedor..."
                  value={filtros.proveedor || ''}
                  onChange={(e) => handleProveedorChange(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {filtrosActivos > 0 && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filtrosActivos} filtro{filtrosActivos > 1 ? 's' : ''} aplicado{filtrosActivos > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}



