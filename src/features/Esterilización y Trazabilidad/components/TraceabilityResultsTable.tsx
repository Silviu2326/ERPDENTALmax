import { useState } from 'react';
import { TraceabilityEvent } from '../api/traceabilityApi';
import { Eye, Calendar, Package, User, TestTube, AlertCircle, CheckCircle, Loader2, FileText } from 'lucide-react';

interface TraceabilityResultsTableProps {
  eventos: TraceabilityEvent[];
  loading?: boolean;
  onVerTimeline: (kitId: string) => void;
  pagination?: {
    page: number;
    pages: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export default function TraceabilityResultsTable({
  eventos,
  loading = false,
  onVerTimeline,
  pagination,
}: TraceabilityResultsTableProps) {
  const [eventoExpandido, setEventoExpandido] = useState<string | null>(null);

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sterilization: 'Esterilización',
      use: 'Uso',
      cleaning: 'Limpieza',
      packaging: 'Empaquetado',
    };
    return labels[type] || type;
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'sterilization':
        return <TestTube className="w-4 h-4 text-blue-600" />;
      case 'use':
        return <User className="w-4 h-4 text-green-600" />;
      case 'cleaning':
        return <Package className="w-4 h-4 text-orange-600" />;
      case 'packaging':
        return <Package className="w-4 h-4 text-purple-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
        <p className="text-gray-600 mb-4">Intente ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Kit de Instrumental
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Ciclo de Esterilización
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {eventos.map((evento) => (
              <tr key={evento._id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(evento.eventDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm">
                    {getEventTypeIcon(evento.eventType)}
                    <span className="ml-2 text-gray-900">{getEventTypeLabel(evento.eventType)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="font-medium">{evento.kitCode}</div>
                    {evento.kitDescription && (
                      <div className="text-xs text-gray-500">{evento.kitDescription}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {evento.patientName ? (
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{evento.patientName}</div>
                      {evento.patientDni && (
                        <div className="text-xs text-gray-500">DNI: {evento.patientDni}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {evento.sterilizationCycleNumber ? (
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{evento.sterilizationCycleNumber}</div>
                      {evento.sterilizationDate && (
                        <div className="text-xs text-gray-500">
                          {formatDate(evento.sterilizationDate)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {evento.sterilizationStatus ? (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        evento.sterilizationStatus === 'passed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {evento.sterilizationStatus === 'passed' ? (
                        <>
                          <CheckCircle size={12} className="mr-1" />
                          Aprobado
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} className="mr-1" />
                          Fallido
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onVerTimeline(evento.kitId)}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-2 transition-all"
                  >
                    <Eye size={18} />
                    <span>Ver Timeline</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && pagination.pages > 1 && (
        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-600">
              Mostrando página <span className="font-medium text-gray-900">{pagination.page}</span> de{' '}
              <span className="font-medium text-gray-900">{pagination.pages}</span> ({pagination.total} resultados
              totales)
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Anterior
              </button>
              <button
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



