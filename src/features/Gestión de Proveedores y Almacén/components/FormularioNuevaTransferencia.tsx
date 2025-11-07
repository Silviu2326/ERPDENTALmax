import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Search, Package, AlertCircle } from 'lucide-react';
import { Almacen, ProductoInventario, NuevaTransferencia, obtenerStockProducto } from '../api/transferenciasApi';
import { obtenerProductos, Producto } from '../api/productosApi';
import { obtenerAlmacenes } from '../api/almacenesApi';

interface FormularioNuevaTransferenciaProps {
  onGuardar: (transferencia: NuevaTransferencia) => Promise<void>;
  onCancelar: () => void;
}

interface ProductoSeleccionado {
  productoId: string;
  producto: ProductoInventario;
  cantidad: number;
  lote?: string;
  stockDisponible: number;
}

export default function FormularioNuevaTransferencia({
  onGuardar,
  onCancelar,
}: FormularioNuevaTransferenciaProps) {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [almacenOrigenId, setAlmacenOrigenId] = useState<string>('');
  const [almacenDestinoId, setAlmacenDestinoId] = useState<string>('');
  const [productos, setProductos] = useState<ProductoSeleccionado[]>([]);
  const [busquedaProducto, setBusquedaProducto] = useState<string>('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Producto[]>([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);
  const [notas, setNotas] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargandoStock, setCargandoStock] = useState<Record<string, boolean>>({});

  useEffect(() => {
    cargarAlmacenes();
  }, []);

  useEffect(() => {
    if (busquedaProducto.length >= 2) {
      buscarProductos();
    } else {
      setResultadosBusqueda([]);
      setMostrandoResultados(false);
    }
  }, [busquedaProducto]);

  useEffect(() => {
    if (almacenOrigenId && productos.length > 0) {
      actualizarStockDisponible();
    }
  }, [almacenOrigenId]);

  const cargarAlmacenes = async () => {
    try {
      const almacenesData = await obtenerAlmacenes({ activo: true });
      setAlmacenes(almacenesData);
    } catch (err) {
      setError('Error al cargar los almacenes');
      console.error(err);
    }
  };

  const buscarProductos = async () => {
    try {
      const respuesta = await obtenerProductos({
        search: busquedaProducto,
        limit: 10,
      });
      setResultadosBusqueda(respuesta.productos);
      setMostrandoResultados(true);
    } catch (err) {
      console.error('Error al buscar productos:', err);
    }
  };

  const agregarProducto = async (producto: Producto) => {
    if (productos.find((p) => p.productoId === producto._id)) {
      setError('Este producto ya está en la lista');
      return;
    }

    if (!almacenOrigenId) {
      setError('Selecciona primero el almacén de origen');
      return;
    }

    const nuevoProducto: ProductoSeleccionado = {
      productoId: producto._id || '',
      producto: {
        _id: producto._id || '',
        nombre: producto.nombre,
        sku: producto.sku,
      },
      cantidad: 1,
      stockDisponible: 0,
    };

    setProductos([...productos, nuevoProducto]);
    setBusquedaProducto('');
    setMostrandoResultados(false);

    // Cargar stock disponible
    if (almacenOrigenId) {
      setCargandoStock((prev) => ({ ...prev, [producto._id || '']: true }));
      try {
        const stock = await obtenerStockProducto(almacenOrigenId, producto._id || '');
        setProductos((prev) =>
          prev.map((p) =>
            p.productoId === producto._id ? { ...p, stockDisponible: stock } : p
          )
        );
      } catch (err) {
        console.error('Error al obtener stock:', err);
      } finally {
        setCargandoStock((prev) => ({ ...prev, [producto._id || '']: false }));
      }
    }
  };

  const actualizarStockDisponible = async () => {
    for (const producto of productos) {
      setCargandoStock((prev) => ({ ...prev, [producto.productoId]: true }));
      try {
        const stock = await obtenerStockProducto(almacenOrigenId, producto.productoId);
        setProductos((prev) =>
          prev.map((p) =>
            p.productoId === producto.productoId ? { ...p, stockDisponible: stock } : p
          )
        );
      } catch (err) {
        console.error('Error al obtener stock:', err);
      } finally {
        setCargandoStock((prev) => ({ ...prev, [producto.productoId]: false }));
      }
    }
  };

  const eliminarProducto = (productoId: string) => {
    setProductos(productos.filter((p) => p.productoId !== productoId));
  };

  const actualizarCantidad = (productoId: string, cantidad: number) => {
    if (cantidad < 1) return;
    setProductos(
      productos.map((p) =>
        p.productoId === productoId ? { ...p, cantidad } : p
      )
    );
  };

  const actualizarLote = (productoId: string, lote: string) => {
    setProductos(
      productos.map((p) =>
        p.productoId === productoId ? { ...p, lote } : p
      )
    );
  };

  const validarFormulario = (): boolean => {
    if (!almacenOrigenId) {
      setError('Selecciona el almacén de origen');
      return false;
    }

    if (!almacenDestinoId) {
      setError('Selecciona el almacén de destino');
      return false;
    }

    if (almacenOrigenId === almacenDestinoId) {
      setError('El almacén de origen y destino no pueden ser el mismo');
      return false;
    }

    if (productos.length === 0) {
      setError('Agrega al menos un producto a la transferencia');
      return false;
    }

    for (const producto of productos) {
      if (producto.cantidad > producto.stockDisponible) {
        setError(
          `La cantidad de ${producto.producto.nombre} excede el stock disponible (${producto.stockDisponible})`
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      const nuevaTransferencia: NuevaTransferencia = {
        almacenOrigenId,
        almacenDestinoId,
        productos: productos.map((p) => ({
          productoId: p.productoId,
          cantidad: p.cantidad,
          lote: p.lote || undefined,
        })),
        notas: notas || undefined,
      };

      await onGuardar(nuevaTransferencia);
    } catch (err: any) {
      setError(err.message || 'Error al crear la transferencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 ring-1 ring-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Almacén de Origen <span className="text-red-500">*</span>
          </label>
          <select
            value={almacenOrigenId}
            onChange={(e) => {
              setAlmacenOrigenId(e.target.value);
              setProductos([]);
            }}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            required
          >
            <option value="">Selecciona un almacén</option>
            {almacenes.map((almacen) => (
              <option key={almacen._id} value={almacen._id}>
                {almacen.nombre} {almacen.esPrincipal && '(Principal)'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Almacén de Destino <span className="text-red-500">*</span>
          </label>
          <select
            value={almacenDestinoId}
            onChange={(e) => setAlmacenDestinoId(e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            required
          >
            <option value="">Selecciona un almacén</option>
            {almacenes
              .filter((almacen) => almacen._id !== almacenOrigenId)
              .map((almacen) => (
                <option key={almacen._id} value={almacen._id}>
                  {almacen.nombre} {almacen.esPrincipal && '(Principal)'}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Agregar Productos <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
                placeholder="Buscar producto por nombre o SKU..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
              {mostrandoResultados && resultadosBusqueda.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white ring-1 ring-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {resultadosBusqueda.map((producto) => (
                    <button
                      key={producto._id}
                      type="button"
                      onClick={() => agregarProducto(producto)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-3 transition-colors rounded-lg"
                    >
                      <Package className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">{producto.nombre}</div>
                        {producto.sku && (
                          <div className="text-xs text-slate-500">SKU: {producto.sku}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {productos.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Productos Seleccionados
          </label>
          <div className="space-y-3">
            {productos.map((producto) => (
              <div
                key={producto.productoId}
                className="bg-slate-50 ring-1 ring-slate-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{producto.producto.nombre}</div>
                    {producto.producto.sku && (
                      <div className="text-xs text-slate-500">SKU: {producto.producto.sku}</div>
                    )}
                    {cargandoStock[producto.productoId] ? (
                      <div className="text-xs text-slate-500 mt-1">Cargando stock...</div>
                    ) : (
                      <div className="text-xs text-slate-500 mt-1">
                        Stock disponible: <span className="font-medium">{producto.stockDisponible}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarProducto(producto.productoId)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Cantidad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={producto.stockDisponible}
                      value={producto.cantidad}
                      onChange={(e) =>
                        actualizarCantidad(producto.productoId, parseInt(e.target.value) || 1)
                      }
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2"
                      required
                    />
                    {producto.cantidad > producto.stockDisponible && (
                      <p className="text-xs text-red-600 mt-1">
                        Excede el stock disponible
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Lote (opcional)</label>
                    <input
                      type="text"
                      value={producto.lote || ''}
                      onChange={(e) => actualizarLote(producto.productoId, e.target.value)}
                      placeholder="Número de lote"
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Notas (opcional)</label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          placeholder="Añade notas adicionales sobre esta transferencia..."
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancelar}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-100 ring-1 ring-slate-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : 'Crear Transferencia'}
        </button>
      </div>
    </form>
  );
}



