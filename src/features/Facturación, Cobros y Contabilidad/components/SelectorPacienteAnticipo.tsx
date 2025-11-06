import { useState, useEffect, useRef } from 'react';
import { Search, User, X } from 'lucide-react';
import { buscarPacientes, PacienteSimplificado } from '../api/facturacionApi';

interface SelectorPacienteAnticipoProps {
  pacienteSeleccionado: PacienteSimplificado | null;
  onPacienteSeleccionado: (paciente: PacienteSimplificado | null) => void;
}

export default function SelectorPacienteAnticipo({
  pacienteSeleccionado,
  onPacienteSeleccionado,
}: SelectorPacienteAnticipoProps) {
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
        const pacientes = await buscarPacientes(searchQuery.trim());
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

  const handleQueryChange = (newQuery: string) => {
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
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => {
            if (resultados.length > 0) {
              setMostrarResultados(true);
            }
          }}
          placeholder="Buscar por nombre, apellidos o DNI..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
        {pacienteSeleccionado && !loading && (
          <button
            onClick={handleLimpiar}
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Lista de resultados */}
      {mostrarResultados && resultados.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {resultados.map((paciente) => (
            <button
              key={paciente._id}
              type="button"
              onClick={() => handleSeleccionarPaciente(paciente)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {paciente.nombreCompleto}
                  </p>
                  {paciente.dni && (
                    <p className="text-sm text-gray-600">DNI: {paciente.dni}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {pacienteSeleccionado && (
        <div className="mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            Paciente seleccionado: {pacienteSeleccionado.nombreCompleto}
          </p>
        </div>
      )}
    </div>
  );
}

