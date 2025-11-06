import { useState, useEffect } from 'react';
import { Search, Users, Clock } from 'lucide-react';
import { PacienteActivo, obtenerPacientesActivos } from '../api/trazabilidadApi';

interface SelectorPacienteActivoProps {
  pacienteSeleccionado: PacienteActivo | null;
  onPacienteSeleccionado: (paciente: PacienteActivo) => void;
}

export default function SelectorPacienteActivo({
  pacienteSeleccionado,
  onPacienteSeleccionado,
}: SelectorPacienteActivoProps) {
  const [pacientes, setPacientes] = useState<PacienteActivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerPacientesActivos();
      setPacientes(datos);
    } catch (err: any) {
      console.error('Error al cargar pacientes activos:', err);
      setError(err.message || 'Error al cargar pacientes activos');
    } finally {
      setLoading(false);
    }
  };

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const textoBusqueda = busqueda.toLowerCase();
    const nombreCompleto = `${paciente.nombre} ${paciente.apellidos}`.toLowerCase();
    const dni = paciente.dni?.toLowerCase() || '';
    return nombreCompleto.includes(textoBusqueda) || dni.includes(textoBusqueda);
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Seleccionar Paciente</span>
        </h3>
        <button
          onClick={cargarPacientes}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          Actualizar
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Lista de pacientes */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No hay pacientes activos disponibles</p>
          </div>
        ) : (
          pacientesFiltrados.map((paciente) => (
            <button
              key={paciente._id}
              onClick={() => onPacienteSeleccionado(paciente)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                pacienteSeleccionado?._id === paciente._id
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {paciente.nombre} {paciente.apellidos}
                  </p>
                  {paciente.dni && (
                    <p className="text-sm text-gray-500 mt-1">DNI: {paciente.dni}</p>
                  )}
                  {paciente.telefono && (
                    <p className="text-sm text-gray-500">Tel: {paciente.telefono}</p>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>En consulta</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Paciente seleccionado destacado */}
      {pacienteSeleccionado && (
        <div className="mt-4 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">Paciente seleccionado:</p>
          <p className="font-semibold text-green-900">
            {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
          </p>
        </div>
      )}
    </div>
  );
}


