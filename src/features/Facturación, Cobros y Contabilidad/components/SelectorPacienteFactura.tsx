import { useState, useEffect, useRef } from 'react';
import { Search, User, X } from 'lucide-react';
import { buscarPacientes, PacienteSimplificado } from '../api/facturacionApi';

interface SelectorPacienteFacturaProps {
  pacienteSeleccionado: PacienteSimplificado | null;
  onPacienteSeleccionado: (paciente: PacienteSimplificado | null) => void;
}

export default function SelectorPacienteFactura({
  pacienteSeleccionado,
  onPacienteSeleccionado,
}: SelectorPacienteFacturaProps) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<PacienteSimplificado[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cerrar resultados al hacer click fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (pacienteSeleccionado) {
      setQuery(pacienteSeleccionado.nombreCompleto);
    }
  }, [pacienteSeleccionado]);

  const buscarPacientesConDebounce = async (searchQuery: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!searchQuery || searchQuery.trim().length < 2) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const pacientes = await buscarPacientes(searchQuery);
        setResultados(pacientes);
        setMostrarResultados(true);
      } catch (error) {
        console.error('Error al buscar pacientes:', error);
        setResultados([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (!newQuery) {
      onPacienteSeleccionado(null);
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    buscarPacientesConDebounce(newQuery);
  };

  const handleSeleccionarPaciente = (paciente: PacienteSimplificado) => {
    onPacienteSeleccionado(paciente);
    setQuery(paciente.nombreCompleto);
    setMostrarResultados(false);
    setResultados([]);
  };

  const handleLimpiar = () => {
    setQuery('');
    onPacienteSeleccionado(null);
    setResultados([]);
    setMostrarResultados(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Paciente *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => {
            if (resultados.length > 0) {
              setMostrarResultados(true);
            }
          }}
          placeholder="Buscar paciente por nombre, apellidos o DNI..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        {query && (
          <button
            onClick={handleLimpiar}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Lista de resultados */}
      {mostrarResultados && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Buscando...
            </div>
          ) : resultados.length > 0 ? (
            <ul className="py-1">
              {resultados.map((paciente) => (
                <li
                  key={paciente._id}
                  onClick={() => handleSeleccionarPaciente(paciente)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {paciente.nombreCompleto}
                      </p>
                      {paciente.dni && (
                        <p className="text-xs text-gray-500">DNI: {paciente.dni}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No se encontraron pacientes
            </div>
          )}
        </div>
      )}

      {/* Indicador de paciente seleccionado */}
      {pacienteSeleccionado && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {pacienteSeleccionado.nombreCompleto}
              </span>
              {pacienteSeleccionado.dni && (
                <span className="text-xs text-blue-600">({pacienteSeleccionado.dni})</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


