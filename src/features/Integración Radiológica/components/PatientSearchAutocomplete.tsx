import { useState, useEffect, useRef } from 'react';
import { Search, User, X } from 'lucide-react';
import { buscarPacientes, PacienteSimplificado } from '../api/imagenesApi';

interface PatientSearchAutocompleteProps {
  pacienteSeleccionado: PacienteSimplificado | null;
  onPacienteSeleccionado: (paciente: PacienteSimplificado | null) => void;
  disabled?: boolean;
}

export default function PatientSearchAutocomplete({
  pacienteSeleccionado,
  onPacienteSeleccionado,
  disabled = false,
}: PatientSearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<PacienteSimplificado[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pacienteSeleccionado) {
      setQuery(`${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido} - DNI: ${pacienteSeleccionado.dni}`);
    }
  }, [pacienteSeleccionado]);

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
        const pacientes = await buscarPacientes(query.trim());
        setResultados(pacientes);
        setMostrarResultados(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar pacientes');
        setResultados([]);
        setMostrarResultados(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSeleccionarPaciente = (paciente: PacienteSimplificado) => {
    onPacienteSeleccionado(paciente);
    setQuery(`${paciente.nombre} ${paciente.apellido} - DNI: ${paciente.dni}`);
    setMostrarResultados(false);
  };

  const handleLimpiar = () => {
    setQuery('');
    onPacienteSeleccionado(null);
    setResultados([]);
    setMostrarResultados(false);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (!newQuery) {
      onPacienteSeleccionado(null);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => {
            if (resultados.length > 0 && query.length >= 2) {
              setMostrarResultados(true);
            }
          }}
          placeholder="Buscar paciente por nombre o DNI..."
          disabled={disabled}
          className={`block w-full pl-10 pr-10 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all ${
            error ? 'ring-red-300 focus:ring-red-400' : 'ring-slate-300 focus:ring-blue-400'
          }`}
        />
        {query && (
          <button
            onClick={handleLimpiar}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {mostrarResultados && (
        <div className="absolute z-50 w-full mt-2 bg-white shadow-lg rounded-xl ring-1 ring-slate-200 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-600">Buscando...</p>
            </div>
          ) : resultados.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-600">No se encontraron pacientes</p>
            </div>
          ) : (
            <ul className="py-1">
              {resultados.map((paciente) => (
                <li
                  key={paciente._id}
                  onClick={() => handleSeleccionarPaciente(paciente)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {paciente.nombre} {paciente.apellido}
                      </p>
                      <p className="text-xs text-slate-500">DNI: {paciente.dni}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}



