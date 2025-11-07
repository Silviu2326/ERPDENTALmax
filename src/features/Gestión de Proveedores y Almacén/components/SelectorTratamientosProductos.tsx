import { useState, useEffect } from 'react';
import { Search, X, Plus, Stethoscope, Package } from 'lucide-react';
import { obtenerTratamientos } from '../../Agenda de Citas y Programación/api/citasApi';
import { obtenerProductos, Producto } from '../api/productosApi';

interface Tratamiento {
  _id: string;
  nombre: string;
  codigo?: string;
}

interface SelectorTratamientosProductosProps {
  tratamientosSeleccionados: string[];
  productosSeleccionados: string[];
  onTratamientoSeleccionado: (tratamientoId: string) => void;
  onTratamientoEliminado: (tratamientoId: string) => void;
  onProductoSeleccionado: (productoId: string) => void;
  onProductoEliminado: (productoId: string) => void;
  disabled?: boolean;
}

export default function SelectorTratamientosProductos({
  tratamientosSeleccionados,
  productosSeleccionados,
  onTratamientoSeleccionado,
  onTratamientoEliminado,
  onProductoSeleccionado,
  onProductoEliminado,
  disabled = false,
}: SelectorTratamientosProductosProps) {
  const [tipoBusqueda, setTipoBusqueda] = useState<'tratamientos' | 'productos'>('tratamientos');
  const [busqueda, setBusqueda] = useState('');
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    if (tipoBusqueda === 'tratamientos') {
      cargarTratamientos();
    } else {
      cargarProductos();
    }
  }, [tipoBusqueda]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (busqueda.length > 2 || busqueda.length === 0) {
        if (tipoBusqueda === 'tratamientos') {
          cargarTratamientos();
        } else {
          cargarProductos();
        }
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda, tipoBusqueda]);

  const cargarTratamientos = async () => {
    setLoading(true);
    try {
      const datos = await obtenerTratamientos(busqueda || undefined);
      setTratamientos(datos);
    } catch (error) {
      console.error('Error al cargar tratamientos:', error);
      setTratamientos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const respuesta = await obtenerProductos({ search: busqueda, limit: 50 });
      setProductos(respuesta.productos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const tratamientosFiltrados = tratamientos.filter((t) => {
    const yaSeleccionado = tratamientosSeleccionados.includes(t._id);
    const coincideBusqueda = !busqueda || 
      t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (t.codigo && t.codigo.toLowerCase().includes(busqueda.toLowerCase()));
    return !yaSeleccionado && coincideBusqueda;
  });

  const productosFiltrados = productos.filter((p) => {
    const yaSeleccionado = productosSeleccionados.includes(p._id || '');
    const coincideBusqueda = !busqueda || 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.toLowerCase());
    return !yaSeleccionado && coincideBusqueda;
  });

  const handleSeleccionarTratamiento = (tratamientoId: string) => {
    onTratamientoSeleccionado(tratamientoId);
    setBusqueda('');
    setMostrarLista(false);
  };

  const handleSeleccionarProducto = (productoId: string) => {
    onProductoSeleccionado(productoId);
    setBusqueda('');
    setMostrarLista(false);
  };

  const tratamientosSeleccionadosData = tratamientos.filter((t) =>
    tratamientosSeleccionados.includes(t._id)
  );

  const productosSeleccionadosData = productos.filter((p) =>
    productosSeleccionados.includes(p._id || '')
  );

  return (
    <div className="space-y-4">
      {/* Selector de tipo */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setTipoBusqueda('tratamientos');
            setBusqueda('');
            setMostrarLista(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            tipoBusqueda === 'tratamientos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Tratamientos
        </button>
        <button
          type="button"
          onClick={() => {
            setTipoBusqueda('productos');
            setBusqueda('');
            setMostrarLista(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            tipoBusqueda === 'productos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Productos
        </button>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={`Buscar ${tipoBusqueda === 'tratamientos' ? 'tratamiento' : 'producto'}...`}
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setMostrarLista(true);
          }}
          onFocus={() => setMostrarLista(true)}
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {mostrarLista && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : tipoBusqueda === 'tratamientos' ? (
              tratamientosFiltrados.length > 0 ? (
                tratamientosFiltrados.map((tratamiento) => (
                  <button
                    key={tratamiento._id}
                    onClick={() => handleSeleccionarTratamiento(tratamiento._id)}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{tratamiento.nombre}</div>
                      {tratamiento.codigo && (
                        <div className="text-sm text-gray-500">Código: {tratamiento.codigo}</div>
                      )}
                    </div>
                    <Plus className="w-4 h-4 text-blue-600" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No se encontraron tratamientos</div>
              )
            ) : productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <button
                  key={producto._id}
                  onClick={() => handleSeleccionarProducto(producto._id || '')}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">{producto.nombre}</div>
                    <div className="text-sm text-gray-500">SKU: {producto.sku}</div>
                  </div>
                  <Plus className="w-4 h-4 text-blue-600" />
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No se encontraron productos</div>
            )}
          </div>
        )}
      </div>

      {/* Tratamientos seleccionados */}
      {tratamientosSeleccionadosData.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tratamientos seleccionados ({tratamientosSeleccionadosData.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {tratamientosSeleccionadosData.map((tratamiento) => (
              <span
                key={tratamiento._id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
              >
                <Stethoscope className="w-4 h-4" />
                {tratamiento.nombre}
                {!disabled && (
                  <button
                    onClick={() => onTratamientoEliminado(tratamiento._id)}
                    className="hover:text-red-600 transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Productos seleccionados */}
      {productosSeleccionadosData.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Productos seleccionados ({productosSeleccionadosData.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {productosSeleccionadosData.map((producto) => (
              <span
                key={producto._id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm"
              >
                <Package className="w-4 h-4" />
                {producto.nombre}
                {!disabled && (
                  <button
                    onClick={() => onProductoEliminado(producto._id || '')}
                    className="hover:text-red-600 transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



