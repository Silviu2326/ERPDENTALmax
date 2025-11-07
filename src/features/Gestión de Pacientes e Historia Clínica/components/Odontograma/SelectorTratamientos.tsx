import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { obtenerTratamientos } from '../../api/odontogramaApi';

interface Tratamiento {
  codigo: string;
  nombre: string;
  categoria: string;
}

interface SelectorTratamientosProps {
  onSelect: (tratamiento: Tratamiento) => void;
  selected?: Tratamiento | null;
  disabled?: boolean;
}

export default function SelectorTratamientos({
  onSelect,
  selected = null,
  disabled = false,
}: SelectorTratamientosProps) {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [filtered, setFiltered] = useState<Tratamiento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarTratamientos = async () => {
      setLoading(true);
      try {
        const data = await obtenerTratamientos();
        setTratamientos(data);
        setFiltered(data);
      } catch (error) {
        console.error('Error al cargar tratamientos:', error);
        // Tratamientos por defecto en caso de error
        setTratamientos([
          { codigo: 'C01', nombre: 'Caries', categoria: 'Diagnóstico' },
          { codigo: 'R01', nombre: 'Restauración', categoria: 'Tratamiento' },
          { codigo: 'E01', nombre: 'Endodoncia', categoria: 'Tratamiento' },
          { codigo: 'X01', nombre: 'Extracción', categoria: 'Tratamiento' },
          { codigo: 'CR01', nombre: 'Corona', categoria: 'Tratamiento' },
          { codigo: 'PR01', nombre: 'Profilaxis', categoria: 'Prevención' },
        ]);
        setFiltered([
          { codigo: 'C01', nombre: 'Caries', categoria: 'Diagnóstico' },
          { codigo: 'R01', nombre: 'Restauración', categoria: 'Tratamiento' },
          { codigo: 'E01', nombre: 'Endodoncia', categoria: 'Tratamiento' },
          { codigo: 'X01', nombre: 'Extracción', categoria: 'Tratamiento' },
          { codigo: 'CR01', nombre: 'Corona', categoria: 'Tratamiento' },
          { codigo: 'PR01', nombre: 'Profilaxis', categoria: 'Prevención' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarTratamientos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFiltered(tratamientos);
    } else {
      const term = searchTerm.toLowerCase();
      setFiltered(
        tratamientos.filter(
          (t) =>
            t.nombre.toLowerCase().includes(term) ||
            t.codigo.toLowerCase().includes(term) ||
            t.categoria.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, tratamientos]);

  const handleSelect = (tratamiento: Tratamiento) => {
    onSelect(tratamiento);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onSelect(null as any);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tratamiento / Diagnóstico
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full text-left px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {selected ? (
            <div className="flex items-center justify-between">
              <span className="text-gray-900">
                {selected.codigo} - {selected.nombre}
              </span>
              {!disabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <span className="text-gray-500">Seleccionar tratamiento...</span>
          )}
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar tratamiento..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-48">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Cargando tratamientos...</div>
              ) : filtered.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No se encontraron tratamientos</div>
              ) : (
                <ul className="py-1">
                  {filtered.map((tratamiento) => (
                    <li
                      key={tratamiento.codigo}
                      onClick={() => handleSelect(tratamiento)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tratamiento.nombre}</p>
                          <p className="text-xs text-gray-500">
                            {tratamiento.codigo} • {tratamiento.categoria}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



