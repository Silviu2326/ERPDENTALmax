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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <div className="text-gray-600">Cargando inventario...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      {onBuscar && (
        <div className="bg-white shadow-sm rounded-xl p-4 space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={busqueda}
                onChange={handleBusquedaChange}
                placeholder="Buscar producto por nombre, SKU o categoría..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
          </div>
          {/* Resumen */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{inventarioFiltrado.length} {inventarioFiltrado.length === 1 ? 'producto encontrado' : 'productos encontrados'}</span>
            {busqueda.trim() && (
              <span>Total en inventario: {inventario.length}</span>
            )}
          </div>
        </div>
      )}

      {/* Lista de productos */}
      {inventarioFiltrado.length === 0 ? (
        <div className="bg-white shadow-sm rounded-xl p-8 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {busqueda.trim() ? 'No se encontraron productos' : 'No hay productos en este almacén'}
          </h3>
          {busqueda.trim() && (
            <p className="text-gray-600 mb-4">
              Intenta con otro término de búsqueda
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {inventarioFiltrado.map((item) => (
                  <tr key={item.producto._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-blue-600" />
                        <span className="font-medium text-gray-900">{item.producto.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {item.producto.sku || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
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

