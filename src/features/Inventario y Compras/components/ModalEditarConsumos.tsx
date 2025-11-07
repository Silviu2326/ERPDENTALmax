import { useState, useEffect } from 'react';
import { X, Save, Plus, Loader2 } from 'lucide-react';
import {
  obtenerConsumosPorTratamiento,
  actualizarConsumosTratamiento,
  ConsumoTratamiento,
  ProductoInventario,
  ConsumoRequest,
  Tratamiento,
} from '../api/tratamientoConsumosApi';
import SelectorInventario from './SelectorInventario';
import TablaItemsConsumo from './TablaItemsConsumo';

interface ModalEditarConsumosProps {
  tratamiento: Tratamiento;
  onClose: () => void;
  onGuardado: () => void;
}

export default function ModalEditarConsumos({
  tratamiento,
  onClose,
  onGuardado,
}: ModalEditarConsumosProps) {
  const [items, setItems] = useState<ConsumoTratamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoInventario | null>(null);
  const [cantidad, setCantidad] = useState<string>('');

  useEffect(() => {
    cargarConsumos();
  }, [tratamiento._id]);

  const cargarConsumos = async () => {
    try {
      setLoading(true);
      setError(null);
      const consumos = await obtenerConsumosPorTratamiento(tratamiento._id);
      setItems(consumos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar consumos');
    } finally {
      setLoading(false);
    }
  };

  const handleProductoSeleccionado = (producto: ProductoInventario) => {
    setProductoSeleccionado(producto);
    setCantidad('');
  };

  const handleAgregarItem = () => {
    if (!productoSeleccionado || !cantidad || parseFloat(cantidad) <= 0) {
      return;
    }

    // Verificar si el producto ya está en la lista
    const existe = items.some(
      (item) => item.producto._id === productoSeleccionado._id
    );

    if (existe) {
      setError('Este producto ya está en la lista');
      return;
    }

    const nuevoItem: ConsumoTratamiento = {
      producto: {
        _id: productoSeleccionado._id,
        nombre: productoSeleccionado.nombre,
        unidadMedida: productoSeleccionado.unidadMedida,
        sku: productoSeleccionado.sku,
      },
      cantidad: parseFloat(cantidad),
    };

    setItems([...items, nuevoItem]);
    setProductoSeleccionado(null);
    setCantidad('');
    setError(null);
  };

  const handleEliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      setError(null);

      const consumosRequest: ConsumoRequest[] = items.map((item) => ({
        productoId: item.producto._id,
        cantidad: item.cantidad,
      }));

      await actualizarConsumosTratamiento(tratamiento._id, consumosRequest);
      onGuardado();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar consumos');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestionar Consumos</h2>
            <p className="text-sm text-gray-600 mt-1">{tratamiento.nombre}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Cargando consumos...</p>
            </div>
          ) : (
            <>
              {/* Formulario para agregar nuevo item */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agregar Producto</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar Producto
                    </label>
                    <SelectorInventario
                      onProductoSeleccionado={handleProductoSeleccionado}
                      placeholder="Buscar producto por nombre o SKU..."
                    />
                  </div>

                  {productoSeleccionado && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900">
                        Producto seleccionado: {productoSeleccionado.nombre}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        SKU: {productoSeleccionado.sku} • Unidad: {productoSeleccionado.unidadMedida}
                      </p>
                    </div>
                  )}

                  {productoSeleccionado && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cantidad ({productoSeleccionado.unidadMedida})
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={cantidad}
                          onChange={(e) => setCantidad(e.target.value)}
                          placeholder="Ingrese la cantidad"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <button
                          onClick={handleAgregarItem}
                          disabled={!cantidad || parseFloat(cantidad) <= 0}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabla de items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Items de Consumo ({items.length})
                </h3>
                <TablaItemsConsumo items={items} onEliminarItem={handleEliminarItem} />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            disabled={guardando}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {guardando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



