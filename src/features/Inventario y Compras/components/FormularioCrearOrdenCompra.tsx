import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { Proveedor, Producto, ItemOrdenCompra, NuevaOrdenCompra } from '../api/ordenesCompraApi';
import ModalSeleccionarProveedor from './ModalSeleccionarProveedor';
import ModalSeleccionarProducto from './ModalSeleccionarProducto';

interface FormularioCrearOrdenCompraProps {
  onSubmit: (data: NuevaOrdenCompra) => Promise<void>;
  onCancel: () => void;
  ordenInicial?: {
    proveedorId?: string;
    sucursalId?: string;
    items?: ItemOrdenCompra[];
    notas?: string;
  };
}

export default function FormularioCrearOrdenCompra({
  onSubmit,
  onCancel,
  ordenInicial,
}: FormularioCrearOrdenCompraProps) {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [sucursalId, setSucursalId] = useState<string>(ordenInicial?.sucursalId || '');
  const [items, setItems] = useState<Array<ItemOrdenCompra & { productoData?: Producto }>>(
    ordenInicial?.items || []
  );
  const [fechaEntregaEstimada, setFechaEntregaEstimada] = useState<string>('');
  const [notas, setNotas] = useState<string>(ordenInicial?.notas || '');
  const [mostrarModalProveedor, setMostrarModalProveedor] = useState(false);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos mock de sucursales (en producción vendrían de una API)
  const sucursales = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  useEffect(() => {
    if (ordenInicial?.proveedorId) {
      // Cargar proveedor si se proporciona ID inicial
      // En producción, hacer una llamada a la API
    }
  }, [ordenInicial]);

  const calcularSubtotalItem = (cantidad: number, precioUnitario: number) => {
    return cantidad * precioUnitario;
  };

  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const impuestos = subtotal * 0.21; // IVA 21%
    const total = subtotal + impuestos;
    return { subtotal, impuestos, total };
  };

  const handleAgregarProducto = (producto: Producto) => {
    const nuevoItem: ItemOrdenCompra & { productoData?: Producto } = {
      producto: producto._id,
      productoData: producto,
      descripcion: producto.nombre,
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0,
    };
    setItems([...items, nuevoItem]);
  };

  const handleEliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleActualizarItem = (
    index: number,
    campo: 'cantidad' | 'precioUnitario' | 'descripcion',
    valor: number | string
  ) => {
    const nuevosItems = [...items];
    const item = nuevosItems[index];
    if (campo === 'cantidad' || campo === 'precioUnitario') {
      item[campo] = valor as number;
      item.subtotal = calcularSubtotalItem(item.cantidad, item.precioUnitario);
    } else {
      item[campo] = valor as string;
    }
    setItems(nuevosItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!proveedorSeleccionado) {
      setError('Debe seleccionar un proveedor');
      return;
    }

    if (!sucursalId) {
      setError('Debe seleccionar una sucursal');
      return;
    }

    if (items.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

    // Validar que todos los items tengan cantidad y precio
    const itemsInvalidos = items.some(
      (item) => item.cantidad <= 0 || item.precioUnitario <= 0
    );
    if (itemsInvalidos) {
      setError('Todos los items deben tener cantidad y precio mayor a cero');
      return;
    }

    setLoading(true);
    try {
      const data: NuevaOrdenCompra = {
        proveedorId: proveedorSeleccionado._id,
        sucursalId,
        fechaEntregaEstimada: fechaEntregaEstimada || undefined,
        items: items.map((item) => ({
          productoId: typeof item.producto === 'string' ? item.producto : item.producto._id,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
        notas: notas || undefined,
      };
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al crear la orden de compra');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, impuestos, total } = calcularTotales();
  const productosIds = items.map((item) =>
    typeof item.producto === 'string' ? item.producto : item.producto._id
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Nueva Orden de Compra</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Proveedor y Sucursal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor *</label>
            {proveedorSeleccionado ? (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{proveedorSeleccionado.nombreComercial}</p>
                  <p className="text-sm text-gray-500">{proveedorSeleccionado.razonSocial}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMostrarModalProveedor(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMostrarModalProveedor(true)}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                Seleccionar Proveedor
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sucursal *</label>
            <select
              value={sucursalId}
              onChange={(e) => setSucursalId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccione una sucursal</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal._id} value={sucursal._id}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fecha entrega estimada */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Entrega Estimada
          </label>
          <input
            type="date"
            value={fechaEntregaEstimada}
            onChange={(e) => setFechaEntregaEstimada(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Productos *</label>
            <button
              type="button"
              onClick={() => setMostrarModalProducto(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Producto
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
              No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Descripción
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cantidad
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Precio Unit.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Subtotal
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.productoData?.nombre || 'Producto'}
                          </div>
                          {item.productoData?.sku && (
                            <div className="text-xs text-gray-500">{item.productoData.sku}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.descripcion}
                            onChange={(e) => handleActualizarItem(index, 'descripcion', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) =>
                              handleActualizarItem(index, 'cantidad', parseFloat(e.target.value) || 0)
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.precioUnitario}
                            onChange={(e) =>
                              handleActualizarItem(
                                index,
                                'precioUnitario',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                            }).format(item.subtotal)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => handleEliminarItem(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div className="mt-4 flex justify-end">
                <div className="w-full max-w-md space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA (21%):</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(impuestos)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>
                      {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Notas adicionales sobre la orden de compra..."
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Orden
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modales */}
      <ModalSeleccionarProveedor
        isOpen={mostrarModalProveedor}
        onClose={() => setMostrarModalProveedor(false)}
        onSeleccionar={setProveedorSeleccionado}
        proveedorSeleccionadoId={proveedorSeleccionado?._id}
      />

      <ModalSeleccionarProducto
        isOpen={mostrarModalProducto}
        onClose={() => setMostrarModalProducto(false)}
        onAgregar={handleAgregarProducto}
        productosYaAgregados={productosIds}
      />
    </div>
  );
}


