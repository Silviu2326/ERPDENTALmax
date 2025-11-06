import { useState, useEffect, useRef } from 'react';
import { Search, Package, Loader2 } from 'lucide-react';
import { buscarProductosInventario, ProductoInventario } from '../api/tratamientoConsumosApi';

interface SelectorInventarioProps {
  onProductoSeleccionado: (producto: ProductoInventario) => void;
  placeholder?: string;
}

export default function SelectorInventario({
  onProductoSeleccionado,
  placeholder = 'Buscar producto por nombre o SKU...',
}: SelectorInventarioProps) {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Si la búsqueda está vacía, no hacer nada
    if (!busqueda.trim()) {
      setProductos([]);
      setMostrarResultados(false);
      return;
    }

    // Debounce: esperar 300ms antes de buscar
    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const resultados = await buscarProductosInventario(busqueda);
        setProductos(resultados);
        setMostrarResultados(true);
      } catch (error) {
        console.error('Error al buscar productos:', error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [busqueda]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target as Node)) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSeleccionarProducto = (producto: ProductoInventario) => {
    onProductoSeleccionado(producto);
    setBusqueda('');
    setMostrarResultados(false);
    setProductos([]);
  };

  return (
    <div ref={contenedorRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onFocus={() => busqueda.trim() && setMostrarResultados(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
      </div>

      {mostrarResultados && productos.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {productos.map((producto) => (
            <button
              key={producto._id}
              onClick={() => handleSeleccionarProducto(producto)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
            >
              <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{producto.nombre}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 font-mono">{producto.sku}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{producto.unidadMedida}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {mostrarResultados && busqueda.trim() && !loading && productos.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No se encontraron productos
        </div>
      )}
    </div>
  );
}


