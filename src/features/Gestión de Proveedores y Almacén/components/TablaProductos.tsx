import { useState } from 'react';
import { Package, MoreVertical, Edit, Eye, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Producto } from '../api/productosApi';

interface TablaProductosProps {
  productos: Producto[];
  loading: boolean;
  onEditar: (producto: Producto) => void;
  onVerDetalle: (producto: Producto) => void;
  onEliminar: (productoId: string) => void;
}

interface FilaProductoProps {
  producto: Producto;
  onEditar: (producto: Producto) => void;
  onVerDetalle: (producto: Producto) => void;
  onEliminar: (productoId: string) => void;
}

function FilaProducto({
  producto,
  onEditar,
  onVerDetalle,
  onEliminar,
}: FilaProductoProps) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  // Verificar si el stock está bajo el mínimo
  const stockBajo = producto.stockActual <= producto.stockMinimo;

  const getCategoriaBadge = (categoria: string) => {
    const colores: Record<string, { bg: string; text: string }> = {
      Consumible: { bg: 'bg-blue-100', text: 'text-blue-800' },
      Instrumental: { bg: 'bg-purple-100', text: 'text-purple-800' },
      Equipamiento: { bg: 'bg-green-100', text: 'text-green-800' },
      Oficina: { bg: 'bg-orange-100', text: 'text-orange-800' },
    };

    const color = colores[categoria] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text}`}>
        {categoria}
      </span>
    );
  };

  return (
    <tr
      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
        stockBajo ? 'bg-red-50/50 hover:bg-red-50' : ''
      }`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <div className="flex flex-col">
            <button
              onClick={() => onVerDetalle(producto)}
              className="text-left font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {producto.nombre}
            </button>
            <span className="text-xs text-slate-500">SKU: {producto.sku}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {getCategoriaBadge(producto.categoria)}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {producto.proveedor?.nombreComercial || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-slate-700 font-medium">
        ${producto.costoUnitario.toFixed(2)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${stockBajo ? 'text-red-600' : 'text-slate-700'}`}>
            {producto.stockActual}
          </span>
          <span className="text-xs text-slate-500">{producto.unidadMedida}</span>
          {stockBajo && (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {producto.stockMinimo} {producto.unidadMedida}
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Menú de acciones"
          >
            <MoreVertical className="w-4 h-4 text-slate-600" />
          </button>

          {mostrarMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMostrarMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-slate-200 z-20 py-1">
                <button
                  onClick={() => {
                    onVerDetalle(producto);
                    setMostrarMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalle
                </button>
                <button
                  onClick={() => {
                    onEditar(producto);
                    setMostrarMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <div className="border-t border-slate-200 my-1" />
                <button
                  onClick={() => {
                    if (producto._id && window.confirm(`¿Está seguro de que desea eliminar el producto "${producto.nombre}"?`)) {
                      onEliminar(producto._id);
                    }
                    setMostrarMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function TablaProductos({
  productos,
  loading,
  onEditar,
  onVerDetalle,
  onEliminar,
}: TablaProductosProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
        <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Producto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Categoría</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Proveedor</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Costo Unitario</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Stock Actual</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Stock Mínimo</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <FilaProducto
                key={producto._id}
                producto={producto}
                onEditar={onEditar}
                onVerDetalle={onVerDetalle}
                onEliminar={onEliminar}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



