import { Users, AlertTriangle } from 'lucide-react';
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
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!pacientes || pacientes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Users className="w-12 h-12 mb-4 text-gray-400" />
          <p>No se encontraron pacientes reincidentes</p>
        </div>
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
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
                  <div className="flex items-center space-x-2">
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
      <div className="mt-4 text-sm text-gray-600">
        <p>Total de pacientes reincidentes: {pacientes.length}</p>
      </div>
    </div>
  );
}


