import { useState, useEffect } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { buscarProductos, Producto } from '../api/ordenesCompraApi';

interface ModalSeleccionarProductoProps {
  isOpen: boolean;
  onClose: () => void;
  onAgregar: (producto: Producto) => void;
  productosYaAgregados?: string[]; // IDs de productos ya en la orden
}

export default function ModalSeleccionarProducto({
  isOpen,
  onClose,
  onAgregar,
  productosYaAgregados = [],
}: ModalSeleccionarProductoProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (isOpen && busqueda.length >= 2) {
      const timeoutId = setTimeout(() => {
        buscarProductosEnAPI();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (isOpen && busqueda.length === 0) {
      setProductos([]);
    }
  }, [busqueda, isOpen]);

  const buscarProductosEnAPI = async () => {
    setLoading(true);
    try {
      const datos = await buscarProductos(busqueda);
      setProductos(datos);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      // Datos mock para desarrollo
      setProductos([
        {
          _id: '1',
          nombre: 'Composite Resina A2',
          sku: 'COMP-A2-001',
          descripcion: 'Composite de resina para restauraciones',
          categoria: 'Materiales de Restauración',
          stockActual: 50,
        },
        {
          _id: '2',
          nombre: 'Anestesia Lidocaína 2%',
          sku: 'ANEST-LID-002',
          descripcion: 'Anestesia local',
          categoria: 'Farmacia',
          stockActual: 30,
        },
        {
          _id: '3',
          nombre: 'Guantes Nitrilo Talla M',
          sku: 'GUANT-NIT-M-003',
          descripcion: 'Guantes desechables de nitrilo',
          categoria: 'EPI',
          stockActual: 200,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const productosDisponibles = productos.filter(
    (p) => !productosYaAgregados.includes(p._id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Buscar y Agregar Producto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o descripción (mínimo 2 caracteres)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {busqueda.length > 0 && busqueda.length < 2 && (
            <p className="text-xs text-gray-500 mt-2">Escribe al menos 2 caracteres para buscar</p>
          )}
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Buscando productos...</div>
          ) : busqueda.length < 2 ? (
            <div className="text-center py-8 text-gray-500">
              Escribe en el buscador para encontrar productos
            </div>
          ) : productosDisponibles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron productos disponibles
            </div>
          ) : (
            <div className="space-y-2">
              {productosDisponibles.map((producto) => (
                <button
                  key={producto._id}
                  onClick={() => {
                    onAgregar(producto);
                    setBusqueda('');
                    setProductos([]);
                  }}
                  className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{producto.nombre}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {producto.sku}
                        </span>
                      </div>
                      {producto.descripcion && (
                        <p className="text-sm text-gray-600 mb-1">{producto.descripcion}</p>
                      )}
                      {producto.categoria && (
                        <p className="text-xs text-gray-500 mb-1">Categoría: {producto.categoria}</p>
                      )}
                      {producto.stockActual !== undefined && (
                        <p className="text-xs text-gray-500">
                          Stock actual: {producto.stockActual} unidades
                        </p>
                      )}
                    </div>
                    <Plus className="w-5 h-5 text-blue-500 ml-2 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


