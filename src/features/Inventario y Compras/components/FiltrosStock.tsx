import { Search, Filter, X } from 'lucide-react';
import { FiltrosStock } from '../api/stockApi';

interface FiltrosStockProps {
  filtros: FiltrosStock;
  onFiltrosChange: (filtros: FiltrosStock) => void;
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="ml-auto flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={filtros.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Categoría */}
        <select
          value={filtros.categoria || ''}
          onChange={(e) => handleCategoriaChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Proveedor */}
        <select
          value={filtros.proveedorId || ''}
          onChange={(e) => handleProveedorChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los proveedores</option>
          {proveedores.map((prov) => (
            <option key={prov._id} value={prov._id}>
              {prov.nombre}
            </option>
          ))}
        </select>

        {/* Sede */}
        <select
          value={filtros.sedeId || ''}
          onChange={(e) => handleSedeChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas las sedes</option>
          {sedes.map((sede) => (
            <option key={sede._id} value={sede._id}>
              {sede.nombre}
            </option>
          ))}
        </select>

        {/* Bajo Stock */}
        <select
          value={filtros.bajo_stock === undefined ? '' : filtros.bajo_stock ? 'true' : 'false'}
          onChange={(e) => handleBajoStockChange(e.target.value === '' ? undefined : e.target.value === 'true')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los niveles</option>
          <option value="true">Bajo stock</option>
          <option value="false">Stock normal</option>
        </select>
      </div>
    </div>
  );
}


