import { useState } from 'react';
import { Package, Search } from 'lucide-react';
import { AlmacenDetalle } from '../api/almacenesApi';

interface InventarioPorAlmacenListProps {
  almacen: AlmacenDetalle;
  loading?: boolean;
  onBuscar?: (termino: string) => void;
}

export default function InventarioPorAlmacenList({
  almacen,
  loading = false,
  onBuscar,
}: InventarioPorAlmacenListProps) {
  const [busqueda, setBusqueda] = useState('');

  const inventario = almacen.inventario || [];

  const inventarioFiltrado = busqueda.trim()
    ? inventario.filter(
        (item) =>
          item.producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          (item.producto.sku && item.producto.sku.toLowerCase().includes(busqueda.toLowerCase())) ||
          (item.producto.categoria &&
            item.producto.categoria.toLowerCase().includes(busqueda.toLowerCase()))
      )
    : inventario;

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const termino = e.target.value;
    setBusqueda(termino);
    if (onBuscar) {
      onBuscar(termino);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando inventario...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      {onBuscar && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={busqueda}
            onChange={handleBusquedaChange}
            placeholder="Buscar producto por nombre, SKU o categoría..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Resumen */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total de productos en inventario</p>
            <p className="text-2xl font-bold text-gray-900">{inventario.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Productos encontrados</p>
            <p className="text-2xl font-bold text-blue-600">{inventarioFiltrado.length}</p>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      {inventarioFiltrado.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            {busqueda.trim() ? 'No se encontraron productos' : 'No hay productos en este almacén'}
          </p>
          {busqueda.trim() && (
            <p className="text-gray-400 text-sm mt-2">
              Intenta con otro término de búsqueda
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventarioFiltrado.map((item) => (
                  <tr key={item.producto._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{item.producto.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.producto.sku || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.producto.categoria || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {item.cantidad}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

