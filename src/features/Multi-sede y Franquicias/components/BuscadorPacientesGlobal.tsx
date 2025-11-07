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
      <label className="block text-sm font-medium text-slate-700 mb-2">
        <Search size={16} className="inline mr-1" />
        Buscar Paciente (Todas las Sedes) *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
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
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-10 py-2.5"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 size={18} className="text-slate-400 animate-spin" />
          </div>
        )}
        {pacienteSeleccionado && !loading && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg ring-1 ring-slate-200 max-h-60 overflow-y-auto">
          {resultados.map((paciente) => (
            <button
              key={paciente._id}
              onClick={() => handleSelectPaciente(paciente)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <User size={18} className="text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {paciente.nombre} {paciente.apellidos}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                    {paciente.documentoIdentidad && (
                      <span>DNI: {paciente.documentoIdentidad}</span>
                    )}
                    {paciente.telefono && (
                      <span>Tel: {paciente.telefono}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Building2 size={16} className="text-blue-600" />
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg ring-1 ring-slate-200 p-4">
          <p className="text-sm text-slate-600">
            No se encontraron pacientes con ese criterio en ninguna sede.
          </p>
        </div>
      )}
    </div>
  );
}



