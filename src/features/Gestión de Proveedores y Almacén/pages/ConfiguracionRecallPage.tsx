import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import {
  obtenerCircuitoRecallPorId,
  obtenerLogsRecall,
  actualizarCircuitoRecall,
  RecallCircuit,
  RecallLog,
} from '../api/recallsApi';
import RecallCircuitForm from '../components/RecallCircuitForm';

interface ConfiguracionRecallPageProps {
  circuitId: string;
  onVolver: () => void;
}

export default function ConfiguracionRecallPage({ circuitId, onVolver }: ConfiguracionRecallPageProps) {
  const [circuito, setCircuito] = useState<RecallCircuit | null>(null);
  const [logs, setLogs] = useState<RecallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [circuitId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [circuitoData, logsData] = await Promise.all([
        obtenerCircuitoRecallPorId(circuitId),
        obtenerLogsRecall(circuitId),
      ]);
      setCircuito(circuitoData);
      setLogs(logsData.logs);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos del circuito');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (
    circuitoActualizado: Omit<RecallCircuit, '_id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await actualizarCircuitoRecall(circuitId, circuitoActualizado);
      setEditando(false);
      cargarDatos();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar el circuito');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!circuito) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Circuito no encontrado</p>
        <button
          onClick={onVolver}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Volver
        </button>
      </div>
    );
  }

  if (editando) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setEditando(false)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancelar edición
        </button>
        <RecallCircuitForm
          circuito={circuito}
          onGuardar={handleGuardar}
          onCancelar={() => setEditando(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onVolver}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{circuito.name}</h1>
            {circuito.description && (
              <p className="text-gray-600 mt-1">{circuito.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={cargarDatos}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
          <button
            onClick={() => setEditando(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Editar Circuito
          </button>
        </div>
      </div>

      {/* Información del Circuito */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Circuito</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                circuito.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {circuito.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disparador</label>
            <p className="text-sm text-gray-900">
              {circuito.trigger.type} - {circuito.trigger.daysAfter} días después
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secuencia de Comunicación
            </label>
            <div className="space-y-2">
              {circuito.communicationSequence.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium text-sm text-gray-900">
                      Paso {step.step}: {step.channel.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      (Retraso: {step.delayDays} días)
                    </span>
                  </div>
                  {step.templateId && (
                    <span className="text-xs text-gray-500">Plantilla: {step.templateId}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logs de Ejecución */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Ejecución</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay logs de ejecución aún</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Paso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Canal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Paso {log.communicationStep}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.channel.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.status === 'sent'
                            ? 'bg-green-100 text-green-800'
                            : log.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {log.status === 'sent' ? 'Enviado' : log.status === 'failed' ? 'Fallido' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


