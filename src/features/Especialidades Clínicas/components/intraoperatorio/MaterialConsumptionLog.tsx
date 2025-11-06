import { useState, useEffect } from 'react';
import { Package, Search, Plus, Trash2 } from 'lucide-react';
import { MaterialUtilizado, buscarProductos } from '../../api/cirugiaApi';

interface MaterialConsumptionLogProps {
  materialesUtilizados: MaterialUtilizado[];
  onAgregarMaterial: (productoId: string, cantidad: number) => void;
  onEliminarMaterial: (index: number) => void;
}

export default function MaterialConsumptionLog({
  materialesUtilizados,
  onAgregarMaterial,
  onEliminarMaterial,
}: MaterialConsumptionLogProps) {
  const [busqueda, setBusqueda] = useState('');
  const [productosEncontrados, setProductosEncontrados] = useState<Array<{ _id: string; nombre: string; codigo?: string; stock: number }>>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<{ _id: string; nombre: string } | null>(null);
  const [cantidad, setCantidad] = useState('1');
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const buscar = async () => {
      if (busqueda.length < 2) {
        setProductosEncontrados([]);
        setMostrarResultados(false);
        return;
      }

      setBuscando(true);
      try {
        const resultados = await buscarProductos(busqueda);
        setProductosEncontrados(resultados);
        setMostrarResultados(true);
      } catch (error) {
        console.error('Error al buscar productos:', error);
        setProductosEncontrados([]);
      } finally {
        setBuscando(false);
      }
    };

    const timeoutId = setTimeout(buscar, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const handleSeleccionarProducto = (producto: { _id: string; nombre: string }) => {
    setProductoSeleccionado(producto);
    setBusqueda('');
    setMostrarResultados(false);
    setProductosEncontrados([]);
  };

  const handleAgregar = () => {
    if (!productoSeleccionado || !cantidad || parseInt(cantidad) <= 0) {
      alert('Por favor seleccione un producto e ingrese una cantidad válida');
      return;
    }

    onAgregarMaterial(productoSeleccionado._id, parseInt(cantidad));
    setProductoSeleccionado(null);
    setCantidad('1');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-2 rounded-lg">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Consumo de Materiales</h3>
      </div>

      {/* Buscador de productos */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Producto</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o código..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          {buscando && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>

        {/* Resultados de búsqueda */}
        {mostrarResultados && productosEncontrados.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {productosEncontrados.map((producto) => (
              <button
                key={producto._id}
                onClick={() => handleSeleccionarProducto(producto)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-800">{producto.nombre}</div>
                {producto.codigo && (
                  <div className="text-sm text-gray-500">Código: {producto.codigo}</div>
                )}
                <div className="text-sm text-gray-500">Stock: {producto.stock}</div>
              </button>
            ))}
          </div>
        )}

        {mostrarResultados && productosEncontrados.length === 0 && !buscando && (
          <div className="mt-1 text-sm text-gray-500 p-2">No se encontraron productos</div>
        )}
      </div>

      {/* Producto seleccionado y cantidad */}
      {productoSeleccionado && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-gray-800">{productoSeleccionado.nombre}</p>
            </div>
            <button
              onClick={() => setProductoSeleccionado(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Cantidad"
              min="1"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              onClick={handleAgregar}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Lista de materiales utilizados */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Materiales Utilizados</h4>
        {materialesUtilizados.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No se han registrado materiales aún</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {materialesUtilizados.map((material, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{material.producto.nombre}</p>
                  {material.producto.codigo && (
                    <p className="text-xs text-gray-500">Código: {material.producto.codigo}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Cantidad: {material.cantidad}</span>
                  <button
                    onClick={() => onEliminarMaterial(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

