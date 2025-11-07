import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Mail, Loader2, AlertCircle, Settings } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!circuito) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Circuito no encontrado</h3>
            <p className="text-gray-600 mb-4">No se pudo cargar la información del circuito</p>
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <ArrowLeft size={16} />
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (editando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="space-y-6">
            <button
              onClick={() => setEditando(false)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-300 shadow-sm"
            >
              <ArrowLeft size={16} />
              Cancelar edición
            </button>
            <RecallCircuitForm
              circuito={circuito}
              onGuardar={handleGuardar}
              onCancelar={() => setEditando(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onVolver}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex items-center">
                  {/* Icono con contenedor */}
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Settings size={24} className="text-blue-600" />
                  </div>
                  
                  {/* Título y descripción */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      {circuito.name}
                    </h1>
                    {circuito.description && (
                      <p className="text-gray-600">
                        {circuito.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={cargarDatos}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-300 shadow-sm"
                >
                  <RefreshCw size={20} />
                  Actualizar
                </button>
                <button
                  onClick={() => setEditando(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Editar Circuito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Información del Circuito */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Circuito</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Disparador</label>
                <p className="text-sm text-gray-900">
                  {circuito.trigger.type} - {circuito.trigger.daysAfter} días después
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Secuencia de Comunicación
                </label>
                <div className="space-y-2">
                  {circuito.communicationSequence.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 ring-1 ring-slate-200 rounded-xl p-3 flex items-center justify-between"
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
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Ejecución</h2>
            {logs.length === 0 ? (
              <div className="p-8 text-center">
                <Mail size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay logs de ejecución</h3>
                <p className="text-gray-600">Aún no se han registrado ejecuciones de este circuito</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Canal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50 transition-colors">
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
      </div>
    </div>
  );
}



