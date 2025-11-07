import { X, Package, AlertTriangle, DollarSign, Box, Calendar, FileText, Tag, Edit } from 'lucide-react';
import { Producto } from '../api/productosApi';

interface ModalDetalleProductoProps {
  producto: Producto;
  onCerrar: () => void;
  onEditar: () => void;
}

export default function ModalDetalleProducto({
  producto,
  onCerrar,
  onEditar,
}: ModalDetalleProductoProps) {
  const formatearFecha = (fecha?: string) => {
    if (!fecha) return '-';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '-';
    }
  };

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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text}`}>
        {categoria}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{producto.nombre}</h2>
              <p className="text-sm text-slate-500">SKU: {producto.sku}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEditar}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium text-sm"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={onCerrar}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Alerta de stock bajo */}
          {stockBajo && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Stock bajo el mínimo</p>
                <p className="text-sm text-red-600">
                  El stock actual ({producto.stockActual} {producto.unidadMedida}) está por debajo del mínimo requerido ({producto.stockMinimo} {producto.unidadMedida})
                </p>
              </div>
            </div>
          )}

          {/* Información Básica */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Producto
                </label>
                <p className="text-slate-900">{producto.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  SKU
                </label>
                <p className="text-slate-900 font-mono">{producto.sku}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoría
                </label>
                <div>{getCategoriaBadge(producto.categoria)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Proveedor
                </label>
                <p className="text-slate-900">{producto.proveedor?.nombreComercial || '-'}</p>
              </div>
              {producto.descripcion && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción
                  </label>
                  <p className="text-slate-900">{producto.descripcion}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de Stock y Costos */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Box className="w-5 h-5 text-blue-600" />
              Stock y Costos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Costo Unitario
                </label>
                <p className="text-slate-900 font-semibold text-lg">${producto.costoUnitario.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Unidad de Medida
                </label>
                <p className="text-slate-900">{producto.unidadMedida}</p>
              </div>
              <div className={stockBajo ? 'bg-red-50 p-3 rounded-xl border-l-4 border-red-500' : ''}>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                  <Box className="w-4 h-4" />
                  Stock Actual
                </label>
                <p className={`text-lg font-semibold ${stockBajo ? 'text-red-600' : 'text-slate-900'}`}>
                  {producto.stockActual} {producto.unidadMedida}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Stock Mínimo
                </label>
                <p className="text-slate-900">{producto.stockMinimo} {producto.unidadMedida}</p>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          {(producto.lote || producto.fechaCaducidad) && (
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Información Adicional
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {producto.lote && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lote
                    </label>
                    <p className="text-slate-900 font-mono">{producto.lote}</p>
                  </div>
                )}
                {producto.fechaCaducidad && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Fecha de Caducidad
                    </label>
                    <p className="text-slate-900">{formatearFecha(producto.fechaCaducidad)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fechas de creación y actualización */}
          {(producto.createdAt || producto.updatedAt) && (
            <div className="text-xs text-slate-500 border-t border-slate-200 pt-4">
              {producto.createdAt && (
                <p>Creado: {formatearFecha(producto.createdAt)}</p>
              )}
              {producto.updatedAt && (
                <p>Última actualización: {formatearFecha(producto.updatedAt)}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



