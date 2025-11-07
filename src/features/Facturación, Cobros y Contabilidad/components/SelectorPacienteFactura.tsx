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
      <label className="block text-sm font-medium text-slate-700 mb-2">
        <User size={16} className="inline mr-1" />
        Paciente *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
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
          className="block w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-10 py-2.5 text-sm"
        />
        {query && (
          <button
            onClick={handleLimpiar}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-700 transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        )}
      </div>

      {/* Lista de resultados */}
      {mostrarResultados && (
        <div className="absolute z-50 w-full mt-1 bg-white ring-1 ring-slate-300 rounded-xl shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">
              Buscando...
            </div>
          ) : resultados.length > 0 ? (
            <ul className="py-1">
              {resultados.map((paciente) => (
                <li
                  key={paciente._id}
                  onClick={() => handleSeleccionarPaciente(paciente)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {paciente.nombreCompleto}
                      </p>
                      {paciente.dni && (
                        <p className="text-xs text-slate-500">DNI: {paciente.dni}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              No se encontraron pacientes
            </div>
          )}
        </div>
      )}

      {/* Indicador de paciente seleccionado */}
      {pacienteSeleccionado && (
        <div className="mt-2 p-3 bg-blue-50 ring-1 ring-blue-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User size={16} className="text-blue-600" />
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



