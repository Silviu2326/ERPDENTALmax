import { useState } from 'react';
import { Edit, Trash2, Eye, Play, Pause, Users, Loader2, Package } from 'lucide-react';
import { RecallCircuit } from '../api/recallsApi';

interface RecallsTableProps {
  circuitos: RecallCircuit[];
  onEditar: (circuito: RecallCircuit) => void;
  onEliminar: (id: string) => void;
  onVerDetalle: (id: string) => void;
  onToggleActivo: (id: string, isActive: boolean) => void;
  onPreviewPacientes: (id: string) => void;
  loading?: boolean;
}

export default function RecallsTable({
  circuitos,
  onEditar,
  onEliminar,
  onVerDetalle,
  onToggleActivo,
  onPreviewPacientes,
  loading = false,
}: RecallsTableProps) {
  const [circuitoAEliminar, setCircuitoAEliminar] = useState<string | null>(null);

  const handleEliminar = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este circuito de recall?')) {
      onEliminar(id);
    }
  };

  const getChannelLabel = (channel: string) => {
    const labels: Record<string, string> = {
      email: 'Email',
      sms: 'SMS',
      whatsapp: 'WhatsApp',
    };
    return labels[channel] || channel;
  };

  const getTriggerLabel = (trigger: RecallCircuit['trigger']) => {
    if (trigger.type === 'treatment') {
      return `${trigger.details.treatmentId ? 'Tratamiento' : 'Cita'} - ${trigger.daysAfter} días después`;
    }
    return `${trigger.type} - ${trigger.daysAfter} días después`;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando circuitos...</p>
      </div>
    );
  }

  if (circuitos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay circuitos de recall configurados</h3>
        <p className="text-gray-600 mb-4">Crea tu primer circuito para comenzar</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Disparador
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pasos de Comunicación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {circuitos.map((circuito) => (
            <tr key={circuito._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{circuito.name}</div>
                  {circuito.description && (
                    <div className="text-sm text-gray-500 mt-1">{circuito.description}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{getTriggerLabel(circuito.trigger)}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {circuito.communicationSequence.map((step, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      Paso {step.step}: {getChannelLabel(step.channel)} (+{step.delayDays}d)
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    circuito.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {circuito.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onPreviewPacientes(circuito._id!)}
                    className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50 transition-colors"
                    title="Ver pacientes elegibles"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onVerDetalle(circuito._id!)}
                    className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded hover:bg-indigo-50 transition-colors"
                    title="Ver detalle"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditar(circuito)}
                    className="text-yellow-600 hover:text-yellow-900 p-1.5 rounded hover:bg-yellow-50 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleActivo(circuito._id!, !circuito.isActive)}
                    className={`p-1.5 rounded transition-colors ${
                      circuito.isActive
                        ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
                        : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                    }`}
                    title={circuito.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {circuito.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEliminar(circuito._id!)}
                    className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}



