import { useState, useEffect, useRef } from 'react';
import { Search, User, Loader2, Building2 } from 'lucide-react';
import { PacienteGlobal, buscarPacienteGlobal } from '../api/transferenciaApi';

interface BuscadorPacientesGlobalProps {
  onPacienteSeleccionado: (paciente: PacienteGlobal | null) => void;
  pacienteSeleccionado: PacienteGlobal | null;
}

export default function BuscadorPacientesGlobal({
  onPacienteSeleccionado,
  pacienteSeleccionado,
}: BuscadorPacientesGlobalProps) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<PacienteGlobal[]>([]);
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
    setError(null);
    timeoutRef.current = setTimeout(async () => {
      try {
        const pacientes = await buscarPacienteGlobal(query);
        setResultados(pacientes);
        setMostrarResultados(true);
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

  const handleSelectPaciente = (paciente: PacienteGlobal) => {
    onPacienteSeleccionado(paciente);
    setQuery(`${paciente.nombre} ${paciente.apellidos}`);
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
        Buscar Paciente (Todas las Sedes) *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={pacienteSeleccionado ? `${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellidos}` : query}
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
          placeholder="Buscar por nombre, apellidos, DNI o teléfono..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <span className="text-xl">×</span>
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
                <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {paciente.nombre} {paciente.apellidos}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    {paciente.documentoIdentidad && (
                      <span>DNI: {paciente.documentoIdentidad}</span>
                    )}
                    {paciente.telefono && (
                      <span>Tel: {paciente.telefono}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">
                      Sede actual: {paciente.sede_actual.nombre}
                    </span>
                  </div>
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
            No se encontraron pacientes con ese criterio en ninguna sede.
          </p>
        </div>
      )}
    </div>
  );
}


