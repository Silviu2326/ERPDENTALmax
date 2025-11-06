import { useState, useEffect } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { buscarTratamientos, TratamientoBusqueda } from '../api/facturacionApi';

interface ModalBusquedaTratamientosProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tratamiento: TratamientoBusqueda) => void;
}

export default function ModalBusquedaTratamientos({
  isOpen,
  onClose,
  onSelect,
}: ModalBusquedaTratamientosProps) {
  const [query, setQuery] = useState('');
  const [tratamientos, setTratamientos] = useState<TratamientoBusqueda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setTratamientos([]);
      setError(null);
      return;
    }

    const buscar = async () => {
      if (query.trim().length < 2) {
        setTratamientos([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const resultados = await buscarTratamientos(query);
        setTratamientos(resultados);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar tratamientos');
        // Datos mock para desarrollo
        setTratamientos([
          {
            _id: '1',
            nombre: 'Limpieza dental',
            codigo: 'LIM-001',
            precio: 50,
            descripcion: 'Limpieza profesional',
          },
          {
            _id: '2',
            nombre: 'Revisión general',
            codigo: 'REV-001',
            precio: 30,
            descripcion: 'Revisión completa',
          },
          {
            _id: '3',
            nombre: 'Ortodoncia',
            codigo: 'ORT-001',
            precio: 1500,
            descripcion: 'Tratamiento de ortodoncia',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(buscar, 300);
    return () => clearTimeout(timeoutId);
  }, [query, isOpen]);

  if (!isOpen) return null;

  const handleSelect = (tratamiento: TratamientoBusqueda) => {
    onSelect(tratamiento);
    setQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Buscar Tratamiento o Producto</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o código..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Buscando...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-2">{error}</p>
              <p className="text-sm text-gray-500">Mostrando resultados de ejemplo</p>
            </div>
          ) : tratamientos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {query.trim().length < 2
                  ? 'Escribe al menos 2 caracteres para buscar'
                  : 'No se encontraron tratamientos'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tratamientos.map((tratamiento) => (
                <button
                  key={tratamiento._id}
                  onClick={() => handleSelect(tratamiento)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{tratamiento.nombre}</p>
                      {tratamiento.codigo && (
                        <p className="text-sm text-gray-500">Código: {tratamiento.codigo}</p>
                      )}
                      {tratamiento.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">{tratamiento.descripcion}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{tratamiento.precio.toFixed(2)} €</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


