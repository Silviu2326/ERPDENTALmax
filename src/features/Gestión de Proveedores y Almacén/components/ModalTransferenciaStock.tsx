import { useState, useEffect } from 'react';
import { X, Save, ArrowRightLeft, Plus, Trash2, Search } from 'lucide-react';
import { Almacen, TransferenciaStock } from '../api/almacenesApi';

interface Producto {
  _id: string;
  nombre: string;
  sku?: string;
  categoria?: string;
  stockDisponible?: number;
}

interface ProductoTransferencia {
  productoId: string;
  producto: Producto;
  cantidad: number;
}

interface ModalTransferenciaStockProps {
  almacenOrigen: Almacen;
  almacenes: Almacen[];
  productos: Producto[];
  isOpen: boolean;
  onClose: () => void;
  onTransferir: (transferencia: TransferenciaStock) => Promise<void>;
}

export default function ModalTransferenciaStock({
  almacenOrigen,
  almacenes,
  productos,
  isOpen,
  onClose,
  onTransferir,
}: ModalTransferenciaStockProps) {
  const [almacenDestinoId, setAlmacenDestinoId] = useState<string>('');
  const [productosTransferencia, setProductosTransferencia] = useState<ProductoTransferencia[]>([]);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [mostrarListaProductos, setMostrarListaProductos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setAlmacenDestinoId('');
      setProductosTransferencia([]);
      setBusquedaProducto('');
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (busquedaProducto.trim() === '') {
      setProductosFiltrados([]);
      return;
    }

    const termino = busquedaProducto.toLowerCase();
    const filtrados = productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(termino) ||
        (producto.sku && producto.sku.toLowerCase().includes(termino)) ||
        (producto.categoria && producto.categoria.toLowerCase().includes(termino))
    );
    setProductosFiltrados(filtrados);
  }, [busquedaProducto, productos]);

  const handleAgregarProducto = (producto: Producto) => {
    // Verificar si el producto ya está en la lista
    if (productosTransferencia.some((p) => p.productoId === producto._id)) {
      setErrors({ producto: 'Este producto ya está en la lista' });
      return;
    }

    setProductosTransferencia([
      ...productosTransferencia,
      {
        productoId: producto._id,
        producto,
        cantidad: 1,
      },
    ]);
    setBusquedaProducto('');
    setMostrarListaProductos(false);
    setErrors({});
  };

  const handleEliminarProducto = (productoId: string) => {
    setProductosTransferencia(
      productosTransferencia.filter((p) => p.productoId !== productoId)
    );
  };

  const handleCambiarCantidad = (productoId: string, cantidad: number) => {
    if (cantidad < 1) return;

    setProductosTransferencia(
      productosTransferencia.map((p) =>
        p.productoId === productoId ? { ...p, cantidad } : p
      )
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!almacenDestinoId) {
      newErrors.almacenDestino = 'Debe seleccionar un almacén de destino';
    }

    if (almacenDestinoId === almacenOrigen._id) {
      newErrors.almacenDestino = 'El almacén de destino debe ser diferente al origen';
    }

    if (productosTransferencia.length === 0) {
      newErrors.productos = 'Debe agregar al menos un producto';
    }

    // Validar que las cantidades sean válidas
    productosTransferencia.forEach((prod, index) => {
      if (prod.cantidad <= 0) {
        newErrors[`cantidad_${index}`] = 'La cantidad debe ser mayor a 0';
      }
      if (prod.producto.stockDisponible && prod.cantidad > prod.producto.stockDisponible) {
        newErrors[`cantidad_${index}`] = `No hay suficiente stock (disponible: ${prod.producto.stockDisponible})`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const transferencia: TransferenciaStock = {
        almacenOrigenId: almacenOrigen._id!,
        almacenDestinoId,
        productos: productosTransferencia.map((p) => ({
          productoId: p.productoId,
          cantidad: p.cantidad,
        })),
      };

      await onTransferir(transferencia);
      onClose();
    } catch (error: any) {
      console.error('Error al realizar transferencia:', error);
      setErrors({ submit: error.message || 'Error al realizar la transferencia' });
    } finally {
      setLoading(false);
    }
  };

  const almacenesDisponibles = almacenes.filter(
    (a) => a._id !== almacenOrigen._id && a.activo
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Transferir Stock</h2>
              <p className="text-sm text-blue-100 mt-1">
                Desde: {almacenOrigen.nombre}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Almacén Destino */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Almacén de Destino <span className="text-red-500">*</span>
            </label>
            <select
              value={almacenDestinoId}
              onChange={(e) => {
                setAlmacenDestinoId(e.target.value);
                if (errors.almacenDestino) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.almacenDestino;
                    return newErrors;
                  });
                }
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.almacenDestino ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar almacén de destino</option>
              {almacenesDisponibles.map((almacen) => (
                <option key={almacen._id} value={almacen._id}>
                  {almacen.nombre}
                  {almacen.clinicaAsociada && ` - ${almacen.clinicaAsociada.nombre}`}
                </option>
              ))}
            </select>
            {errors.almacenDestino && (
              <p className="mt-1 text-sm text-red-600">{errors.almacenDestino}</p>
            )}
          </div>

          {/* Buscar y Agregar Productos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agregar Productos
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={busquedaProducto}
                onChange={(e) => {
                  setBusquedaProducto(e.target.value);
                  setMostrarListaProductos(true);
                }}
                onFocus={() => setMostrarListaProductos(true)}
                placeholder="Buscar producto por nombre, SKU o categoría..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {mostrarListaProductos && productosFiltrados.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMostrarListaProductos(false)}
                  />
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {productosFiltrados.map((producto) => (
                      <button
                        key={producto._id}
                        type="button"
                        onClick={() => handleAgregarProducto(producto)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{producto.nombre}</div>
                          {producto.sku && (
                            <div className="text-sm text-gray-500">SKU: {producto.sku}</div>
                          )}
                          {producto.stockDisponible !== undefined && (
                            <div className="text-xs text-gray-400">
                              Stock disponible: {producto.stockDisponible}
                            </div>
                          )}
                        </div>
                        <Plus className="w-4 h-4 text-blue-600" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {errors.producto && (
              <p className="mt-1 text-sm text-red-600">{errors.producto}</p>
            )}
            {errors.productos && (
              <p className="mt-1 text-sm text-red-600">{errors.productos}</p>
            )}
          </div>

          {/* Lista de Productos a Transferir */}
          {productosTransferencia.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Productos a Transferir
              </h3>
              <div className="space-y-3">
                {productosTransferencia.map((prod, index) => (
                  <div
                    key={prod.productoId}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{prod.producto.nombre}</div>
                      {prod.producto.sku && (
                        <div className="text-sm text-gray-500">SKU: {prod.producto.sku}</div>
                      )}
                      {prod.producto.stockDisponible !== undefined && (
                        <div className="text-xs text-gray-400">
                          Stock disponible: {prod.producto.stockDisponible}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-700">Cantidad:</label>
                      <input
                        type="number"
                        min="1"
                        max={prod.producto.stockDisponible || undefined}
                        value={prod.cantidad}
                        onChange={(e) =>
                          handleCambiarCantidad(prod.productoId, parseInt(e.target.value) || 1)
                        }
                        className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`cantidad_${index}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEliminarProducto(prod.productoId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || productosTransferencia.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Transferiendo...' : 'Realizar Transferencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


