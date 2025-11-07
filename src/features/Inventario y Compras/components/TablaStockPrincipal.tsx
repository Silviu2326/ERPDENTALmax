import { useState } from 'react';
import { Eye, Edit, Package, AlertTriangle, Loader2 } from 'lucide-react';
import { ProductoInventario } from '../api/stockApi';

interface TablaStockPrincipalProps {
  productos: ProductoInventario[];
  loading?: boolean;
  onVerDetalle: (productoId: string) => void;
  onAjustarStock: (producto: ProductoInventario) => void;
  onEditar: (producto: ProductoInventario) => void;
}

export default function TablaStockPrincipal({
  productos,
  loading,
  onVerDetalle,
  onAjustarStock,
  onEditar,
}: TablaStockPrincipalProps) {
  const [sortBy, setSortBy] = useState<keyof ProductoInventario | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof ProductoInventario) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    if (!sortBy) return 0;
    
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (typeof aValue === 'object' && aValue !== null) {
      aValue = (aValue as any).nombre || '';
    }
    if (typeof bValue === 'object' && bValue !== null) {
      bValue = (bValue as any).nombre || '';
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const esBajoStock = (producto: ProductoInventario) => {
    return producto.cantidadActual <= producto.puntoReorden;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
        <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                onClick={() => handleSort('nombre')}
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                Nombre
                {sortBy === 'nombre' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                onClick={() => handleSort('sku')}
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                SKU
                {sortBy === 'sku' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Proveedor
              </th>
              <th
                onClick={() => handleSort('cantidadActual')}
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                Stock Actual
                {sortBy === 'cantidadActual' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Punto Reorden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Costo Unitario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productosOrdenados.map((producto) => (
              <tr
                key={producto._id}
                className={`hover:bg-slate-50 transition-colors ${
                  esBajoStock(producto) ? 'bg-red-50/50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {esBajoStock(producto) && (
                      <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                      {producto.descripcion && (
                        <div className="text-sm text-slate-600">{producto.descripcion}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {producto.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {producto.categoria}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {typeof producto.proveedor === 'object' ? producto.proveedor.nombre : producto.proveedor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-semibold ${
                      esBajoStock(producto) ? 'text-red-600' : 'text-gray-900'
                    }`}
                  >
                    {producto.cantidadActual} {producto.unidadMedida}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {producto.puntoReorden} {producto.unidadMedida}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${producto.costoUnitario.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      producto.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {producto.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onVerDetalle(producto._id!)}
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEditar(producto)}
                      className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onAjustarStock(producto)}
                      className="text-orange-600 hover:text-orange-900 p-1.5 rounded-lg hover:bg-orange-50 transition-colors"
                      title="Ajustar stock"
                    >
                      <Package className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



