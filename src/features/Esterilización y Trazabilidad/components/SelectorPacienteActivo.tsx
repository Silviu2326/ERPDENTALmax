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
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          <span>Seleccionar Paciente</span>
        </h3>
        <button
          onClick={cargarPacientes}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          Actualizar
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 ring-1 ring-red-200 rounded-2xl text-sm text-red-800">
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
            <Users size={48} className="mx-auto mb-2 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pacientes activos</h3>
            <p className="text-gray-600">No hay pacientes activos disponibles</p>
          </div>
        ) : (
          pacientesFiltrados.map((paciente) => (
            <button
              key={paciente._id}
              onClick={() => onPacienteSeleccionado(paciente)}
              className={`w-full text-left p-3 rounded-xl ring-2 transition-all ${
                pacienteSeleccionado?._id === paciente._id
                  ? 'ring-blue-600 bg-blue-50 shadow-sm'
                  : 'ring-slate-200 hover:ring-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {paciente.nombre} {paciente.apellidos}
                  </p>
                  {paciente.dni && (
                    <p className="text-sm text-gray-600 mt-1">DNI: {paciente.dni}</p>
                  )}
                  {paciente.telefono && (
                    <p className="text-sm text-gray-600">Tel: {paciente.telefono}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Clock size={16} />
                  <span>En consulta</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Paciente seleccionado destacado */}
      {pacienteSeleccionado && (
        <div className="mt-4 p-3 bg-green-50 ring-2 ring-green-200 rounded-2xl">
          <p className="text-sm font-medium text-green-800">Paciente seleccionado:</p>
          <p className="font-semibold text-green-900">
            {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
          </p>
        </div>
      )}
    </div>
  );
}



