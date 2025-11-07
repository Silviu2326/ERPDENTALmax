import { Users, AlertTriangle, Loader2 } from 'lucide-react';
import { PacienteReincidente } from '../api/analiticaApi';

interface TablaPacientesReincidentesProps {
  pacientes: PacienteReincidente[];
  loading?: boolean;
  onVerPaciente?: (pacienteId: string) => void;
}

export default function TablaPacientesReincidentes({
  pacientes,
  loading = false,
  onVerPaciente,
}: TablaPacientesReincidentesProps) {
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!pacientes || pacientes.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron pacientes reincidentes</h3>
        <p className="text-gray-600">No hay pacientes con ausencias recurrentes en el período seleccionado</p>
      </div>
    );
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle size={20} className="text-orange-600" />
          <span>Pacientes Reincidentes</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número de Ausencias
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Ausencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pacientes.map((paciente) => (
              <tr key={paciente.pacienteId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{paciente.nombreCompleto}</div>
                  <div className="text-xs text-gray-500">ID: {paciente.pacienteId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {paciente.numeroAusencias}
                    </span>
                    <span className="text-sm text-gray-600">ausencias</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatearFecha(paciente.ultimaAusencia)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {onVerPaciente && (
                    <button
                      onClick={() => onVerPaciente(paciente.pacienteId)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Ver Detalle
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
        <p>Total de pacientes reincidentes: {pacientes.length}</p>
      </div>
    </div>
  );
}



