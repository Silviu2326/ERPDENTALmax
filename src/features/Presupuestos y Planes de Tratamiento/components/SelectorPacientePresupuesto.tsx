import { useState, useEffect, useRef } from 'react';
import { Search, User, Loader2, X } from 'lucide-react';
import { PacienteSimplificado, buscarPacientesPresupuesto } from '../api/presupuestosApi';

interface SelectorPacientePresupuestoProps {
  pacienteSeleccionado: PacienteSimplificado | null;
  onPacienteSeleccionado: (paciente: PacienteSimplificado | null) => void;
}

export default function SelectorPacientePresupuesto({
  pacienteSeleccionado,
  onPacienteSeleccionado,
}: SelectorPacientePresupuestoProps) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<PacienteSimplificado[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Debounce para la búsqueda
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!query || query.trim().length < 2) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const pacientes = await buscarPacientesPresupuesto(query);
        setResultados(pacientes);
        setMostrarResultados(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar pacientes');
        setResultados([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms de debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

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

  const handleSelectPaciente = (paciente: PacienteSimplificado) => {
    onPacienteSeleccionado(paciente);
    setQuery(paciente.nombreCompleto);
    setMostrarResultados(false);
  };

  const handleClear = () => {
    setQuery('');
    onPacienteSeleccionado(null);
    setResultados([]);
    setMostrarResultados(false);
  };

  return (
    <div className="relative" ref={contenedorRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Paciente *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={pacienteSeleccionado ? pacienteSeleccionado.nombreCompleto : query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (pacienteSeleccionado) {
              onPacienteSeleccionado(null);
            }
          }}
          onFocus={() => {
            if (resultados.length > 0) {
              setMostrarResultados(true);
            }
          }}
          placeholder="Buscar por nombre, apellidos o DNI..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={!!pacienteSeleccionado}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
        {pacienteSeleccionado && !loading && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Lista de resultados */}
      {mostrarResultados && resultados.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {resultados.map((paciente) => (
            <button
              key={paciente._id}
              onClick={() => handleSelectPaciente(paciente)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {paciente.nombreCompleto}
                  </p>
                  {paciente.dni && (
                    <p className="text-sm text-gray-500 mt-1">
                      DNI: {paciente.dni}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {mostrarResultados && !loading && query.length >= 2 && resultados.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-600">
            No se encontraron pacientes con ese criterio.
          </p>
        </div>
      )}
    </div>
  );
}


