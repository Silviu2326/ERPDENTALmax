import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, Package, Calendar } from 'lucide-react';
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

  const filtrosActivosCount = [
    filtros.productoId,
    filtros.fechaCaducidadAntes,
    filtros.fechaCaducidadDespues,
    filtros.estado,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por número de lote..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                onChange={(e) => {
                  // Aquí podrías agregar búsqueda por número de lote si el backend lo soporta
                }}
              />
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mostrarFiltros || tieneFiltrosActivos
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {tieneFiltrosActivos && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] flex items-center justify-center">
                  {filtrosActivosCount}
                </span>
              )}
              {mostrarFiltros ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors rounded-xl hover:bg-white/70"
                title="Limpiar filtros"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Package className="inline mr-1 w-4 h-4" />
                  Producto
                </label>
                <select
                  value={filtros.productoId || ''}
                  onChange={(e) => handleFiltroChange('productoId', e.target.value || undefined)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter className="inline mr-1 w-4 h-4" />
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) =>
                    handleFiltroChange('estado', (e.target.value || undefined) as any)
                  }
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos los estados</option>
                  <option value="Activo">Activo</option>
                  <option value="PorCaducar">Por Caducar</option>
                  <option value="Caducado">Caducado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="inline mr-1 w-4 h-4" />
                  Caduca antes de
                </label>
                <input
                  type="date"
                  value={filtros.fechaCaducidadAntes || ''}
                  onChange={(e) =>
                    handleFiltroChange('fechaCaducidadAntes', e.target.value || undefined)
                  }
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="inline mr-1 w-4 h-4" />
                  Caduca después de
                </label>
                <input
                  type="date"
                  value={filtros.fechaCaducidadDespues || ''}
                  onChange={(e) =>
                    handleFiltroChange('fechaCaducidadDespues', e.target.value || undefined)
                  }
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>

            {/* Resumen de resultados */}
            {tieneFiltrosActivos && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{filtrosActivosCount} filtro(s) aplicado(s)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



