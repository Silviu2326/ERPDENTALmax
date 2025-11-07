import { useState, useEffect, useRef } from 'react';
import { Search, User, UserPlus, Loader2 } from 'lucide-react';
import { Paciente, buscarPacientes } from '../api/citasApi';

interface BuscadorPacientesProps {
  onPacienteSeleccionado: (paciente: Paciente | null) => void;
  pacienteSeleccionado: Paciente | null;
  onCrearPaciente: () => void;
}

export default function BuscadorPacientes({
  onPacienteSeleccionado,
  pacienteSeleccionado,
  onCrearPaciente,
}: BuscadorPacientesProps) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<Paciente[]>([]);
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
        // Simular delay de búsqueda
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Datos mock enriquecidos de pacientes
        const pacientesMock: Paciente[] = [
          { _id: '1', nombre: 'Ana', apellidos: 'Martínez', documentoIdentidad: '12345678A', telefono: '612345678', email: 'ana.martinez@email.com' },
          { _id: '2', nombre: 'Pedro', apellidos: 'Sánchez', documentoIdentidad: '23456789B', telefono: '612345679', email: 'pedro.sanchez@email.com' },
          { _id: '3', nombre: 'Laura', apellidos: 'Rodríguez', documentoIdentidad: '34567890C', telefono: '612345680', email: 'laura.rodriguez@email.com' },
          { _id: '4', nombre: 'Miguel', apellidos: 'Torres', documentoIdentidad: '45678901D', telefono: '612345681', email: 'miguel.torres@email.com' },
          { _id: '5', nombre: 'Sofía', apellidos: 'López', documentoIdentidad: '56789012E', telefono: '612345682', email: 'sofia.lopez@email.com' },
          { _id: '6', nombre: 'Diego', apellidos: 'Morales', documentoIdentidad: '67890123F', telefono: '612345683', email: 'diego.morales@email.com' },
          { _id: '7', nombre: 'Elena', apellidos: 'Jiménez', documentoIdentidad: '78901234G', telefono: '612345684', email: 'elena.jimenez@email.com' },
          { _id: '8', nombre: 'Javier', apellidos: 'Hernández', documentoIdentidad: '89012345H', telefono: '612345685', email: 'javier.hernandez@email.com' },
          { _id: '9', nombre: 'Isabel', apellidos: 'Díaz', documentoIdentidad: '90123456I', telefono: '612345686', email: 'isabel.diaz@email.com' },
          { _id: '10', nombre: 'Fernando', apellidos: 'Moreno', documentoIdentidad: '01234567J', telefono: '612345687', email: 'fernando.moreno@email.com' },
          { _id: '11', nombre: 'Lucía', apellidos: 'Álvarez', documentoIdentidad: '12345678K', telefono: '612345688', email: 'lucia.alvarez@email.com' },
          { _id: '12', nombre: 'Pablo', apellidos: 'Romero', documentoIdentidad: '23456789L', telefono: '612345689', email: 'pablo.romero@email.com' },
          { _id: '13', nombre: 'Marta', apellidos: 'Navarro', documentoIdentidad: '34567890M', telefono: '612345690', email: 'marta.navarro@email.com' },
          { _id: '14', nombre: 'Alberto', apellidos: 'Vargas', documentoIdentidad: '45678901N', telefono: '612345691', email: 'alberto.vargas@email.com' },
          { _id: '15', nombre: 'Cristina', apellidos: 'Méndez', documentoIdentidad: '56789012O', telefono: '612345692', email: 'cristina.mendez@email.com' },
          { _id: '16', nombre: 'Raúl', apellidos: 'Castro', documentoIdentidad: '67890123P', telefono: '612345693', email: 'raul.castro@email.com' },
          { _id: '17', nombre: 'Carmen', apellidos: 'Ortega', documentoIdentidad: '78901234Q', telefono: '612345694', email: 'carmen.ortega@email.com' },
          { _id: '18', nombre: 'Jorge', apellidos: 'Delgado', documentoIdentidad: '89012345R', telefono: '612345695', email: 'jorge.delgado@email.com' },
          { _id: '19', nombre: 'Patricia', apellidos: 'Ramírez', documentoIdentidad: '90123456S', telefono: '612345696', email: 'patricia.ramirez@email.com' },
          { _id: '20', nombre: 'Ricardo', apellidos: 'Vega', documentoIdentidad: '01234567T', telefono: '612345697', email: 'ricardo.vega@email.com' },
        ];
        
        // Filtrar pacientes según la búsqueda
        const queryLower = query.toLowerCase().trim();
        const pacientesFiltrados = pacientesMock.filter(paciente => {
          const nombreCompleto = `${paciente.nombre} ${paciente.apellidos}`.toLowerCase();
          const documento = paciente.documentoIdentidad?.toLowerCase() || '';
          const telefono = paciente.telefono?.toLowerCase() || '';
          const email = paciente.email?.toLowerCase() || '';
          
          return nombreCompleto.includes(queryLower) ||
                 documento.includes(queryLower) ||
                 telefono.includes(queryLower) ||
                 email.includes(queryLower);
        });
        
        setResultados(pacientesFiltrados);
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

  const handleSelectPaciente = (paciente: Paciente) => {
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
        Paciente *
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
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-10 py-2.5 transition-all"
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
            <span className="text-xl leading-none">×</span>
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Lista de resultados */}
      {mostrarResultados && resultados.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-sm rounded-xl ring-1 ring-slate-200 max-h-60 overflow-y-auto">
          {resultados.map((paciente) => (
            <button
              key={paciente._id}
              onClick={() => handleSelectPaciente(paciente)}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {paciente.nombre} {paciente.apellidos}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                    {paciente.documentoIdentidad && (
                      <span>DNI: {paciente.documentoIdentidad}</span>
                    )}
                    {paciente.telefono && (
                      <span>Tel: {paciente.telefono}</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {mostrarResultados && !loading && query.length >= 2 && resultados.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-3">
            No se encontraron pacientes con ese criterio.
          </p>
          <button
            onClick={onCrearPaciente}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <UserPlus size={16} />
            <span>Crear nuevo paciente</span>
          </button>
        </div>
      )}

      {/* Botón para crear paciente si no hay búsqueda activa */}
      {!mostrarResultados && query.length < 2 && !pacienteSeleccionado && (
        <button
          onClick={onCrearPaciente}
          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <UserPlus size={16} />
          <span>Crear nuevo paciente</span>
        </button>
      )}
    </div>
  );
}

