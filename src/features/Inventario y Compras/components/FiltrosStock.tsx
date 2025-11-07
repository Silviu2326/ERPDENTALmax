import { Search, X } from 'lucide-react';
import { FiltrosStock as FiltrosStockType } from '../api/stockApi';

interface FiltrosStockProps {
  filtros: FiltrosStockType;
  onFiltrosChange: (filtros: FiltrosStockType) => void;
  categorias: string[];
  proveedores: Array<{ _id: string; nombre: string }>;
  sedes: Array<{ _id: string; nombre: string }>;
}

export default function FiltrosStockComponent({
  filtros,
  onFiltrosChange,
  categorias,
  proveedores,
  sedes,
}: FiltrosStockProps) {
  const handleSearchChange = (search: string) => {
    onFiltrosChange({ ...filtros, search, page: 1 });
  };

  const handleCategoriaChange = (categoria: string) => {
    onFiltrosChange({ ...filtros, categoria: categoria || undefined, page: 1 });
  };

  const handleProveedorChange = (proveedorId: string) => {
    onFiltrosChange({ ...filtros, proveedorId: proveedorId || undefined, page: 1 });
  };

  const handleSedeChange = (sedeId: string) => {
    onFiltrosChange({ ...filtros, sedeId: sedeId || undefined, page: 1 });
  };

  const handleBajoStockChange = (bajo_stock: boolean | undefined) => {
    onFiltrosChange({ ...filtros, bajo_stock, page: 1 });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      page: 1,
      limit: filtros.limit || 10,
    });
  };

  const tieneFiltrosActivos =
    filtros.search ||
    filtros.categoria ||
    filtros.proveedorId ||
    filtros.sedeId ||
    filtros.bajo_stock !== undefined;

  const cantidadFiltrosActivos = [
    filtros.search,
    filtros.categoria,
    filtros.proveedorId,
    filtros.sedeId,
    filtros.bajo_stock !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="bg-white shadow-sm rounded-xl mb-6">
      <div className="space-y-4 p-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={filtros.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>

            {/* Botón limpiar (si hay filtros activos) */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-all"
              >
                <X size={16} />
                Limpiar filtros
                {cantidadFiltrosActivos > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 text-slate-700">
                    {cantidadFiltrosActivos}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Categoría
              </label>
              <select
                value={filtros.categoria || ''}
                onChange={(e) => handleCategoriaChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Proveedor */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Proveedor
              </label>
              <select
                value={filtros.proveedorId || ''}
                onChange={(e) => handleProveedorChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Todos los proveedores</option>
                {proveedores.map((prov) => (
                  <option key={prov._id} value={prov._id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Sede */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sede
              </label>
              <select
                value={filtros.sedeId || ''}
                onChange={(e) => handleSedeChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Todas las sedes</option>
                {sedes.map((sede) => (
                  <option key={sede._id} value={sede._id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Bajo Stock */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estado de Stock
              </label>
              <select
                value={filtros.bajo_stock === undefined ? '' : filtros.bajo_stock ? 'true' : 'false'}
                onChange={(e) => handleBajoStockChange(e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="">Todos los niveles</option>
                <option value="true">Bajo stock</option>
                <option value="false">Stock normal</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



