import { useState, useEffect } from 'react';
import { TimelineEvent, obtenerTimelineKit } from '../api/traceabilityApi';
import { X, Calendar, User, TestTube, Package, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface TraceabilityTimelineViewProps {
  kitId: string;
  kitCode?: string;
  onCerrar: () => void;
}

export default function TraceabilityTimelineView({
  kitId,
  kitCode,
  onCerrar,
}: TraceabilityTimelineViewProps) {
  const [eventos, setEventos] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarTimeline();
  }, [kitId]);

  const cargarTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerTimelineKit(kitId);
      setEventos(datos);
    } catch (err: any) {
      console.error('Error al cargar timeline:', err);
      setError(err.message || 'Error al cargar el historial del kit');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'sterilization':
        return <TestTube className="w-5 h-5 text-blue-600" />;
      case 'use':
        return <User className="w-5 h-5 text-green-600" />;
      case 'cleaning':
        return <Package className="w-5 h-5 text-orange-600" />;
      case 'packaging':
        return <Package className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sterilization: 'Esterilización',
      use: 'Uso en Tratamiento',
      cleaning: 'Limpieza',
      packaging: 'Empaquetado',
    };
    return labels[type] || type;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'sterilization':
        return 'bg-blue-100 border-blue-300';
      case 'use':
        return 'bg-green-100 border-green-300';
      case 'cleaning':
        return 'bg-orange-100 border-orange-300';
      case 'packaging':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Historial de Trazabilidad</h2>
            {kitCode && (
              <p className="text-sm text-gray-600 mt-1">Kit: {kitCode}</p>
            )}
          </div>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Cargando historial...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                  <button
                    onClick={cargarTimeline}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && eventos.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No hay eventos registrados para este kit</p>
            </div>
          )}

          {!loading && !error && eventos.length > 0 && (
            <div className="relative">
              {/* Línea vertical */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

              {/* Eventos */}
              <div className="space-y-8">
                {eventos.map((evento, index) => (
                  <div key={evento._id} className="relative flex items-start">
                    {/* Ícono del evento */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 ${getEventTypeColor(
                        evento.eventType
                      )}`}
                    >
                      {getEventTypeIcon(evento.eventType)}
                    </div>

                    {/* Contenido del evento */}
                    <div className="ml-6 flex-1">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {getEventTypeLabel(evento.eventType)}
                              </h3>
                              {evento.status === 'passed' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Aprobado
                                </span>
                              )}
                              {evento.status === 'failed' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Fallido
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mb-3">{evento.description}</p>

                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(evento.eventDate)}</span>
                              </div>

                              {evento.operatorName && (
                                <div className="flex items-center space-x-1">
                                  <User className="w-4 h-4" />
                                  <span>Operador: {evento.operatorName}</span>
                                </div>
                              )}

                              {evento.patientName && (
                                <div className="flex items-center space-x-1">
                                  <User className="w-4 h-4" />
                                  <span>Paciente: {evento.patientName}</span>
                                </div>
                              )}

                              {evento.treatmentProcedure && (
                                <div className="flex items-center space-x-1">
                                  <Package className="w-4 h-4" />
                                  <span>Tratamiento: {evento.treatmentProcedure}</span>
                                </div>
                              )}

                              {evento.sterilizationCycleNumber && (
                                <div className="flex items-center space-x-1">
                                  <TestTube className="w-4 h-4" />
                                  <span>Ciclo: {evento.sterilizationCycleNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onCerrar}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

