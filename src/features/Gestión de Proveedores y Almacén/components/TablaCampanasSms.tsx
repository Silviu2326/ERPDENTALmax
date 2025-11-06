import { SmsCampaign } from '../api/campanasSmsApi';
import { Edit, Trash2, BarChart3, Calendar, MessageSquare, CheckCircle, Clock, XCircle, Send } from 'lucide-react';

interface TablaCampanasSmsProps {
  campañas: SmsCampaign[];
  loading?: boolean;
  onEditar: (campana: SmsCampaign) => void;
  onEliminar: (id: string) => void;
  onVerEstadisticas: (id: string) => void;
}

export default function TablaCampanasSms({
  campañas,
  loading = false,
  onEditar,
  onEliminar,
  onVerEstadisticas,
}: TablaCampanasSmsProps) {
  const getStatusBadge = (status: SmsCampaign['status']) => {
    const statusConfig = {
      draft: {
        label: 'Borrador',
        className: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: MessageSquare,
      },
      scheduled: {
        label: 'Programada',
        className: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Calendar,
      },
      sending: {
        label: 'Enviando',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Send,
      },
      sent: {
        label: 'Enviada',
        className: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
      },
      failed: {
        label: 'Fallida',
        className: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (campañas.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">No hay campañas de SMS</p>
        <p className="text-sm text-gray-500 mt-1">
          Crea tu primera campaña para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Programada para
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enviada el
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estadísticas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campañas.map((campana) => (
              <tr key={campana._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{campana.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {campana.message}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(campana.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(campana.scheduledAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(campana.sentAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {campana.stats ? (
                    <div className="text-sm">
                      <div className="text-gray-900 font-medium">
                        {campana.stats.delivered || 0} / {campana.stats.total || 0}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {campana.stats.total > 0
                          ? Math.round(
                              (campana.stats.delivered / campana.stats.total) * 100
                            )
                          : 0}
                        % entregados
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {campana.status === 'draft' && (
                      <>
                        <button
                          onClick={() => onEditar(campana)}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => campana._id && onEliminar(campana._id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {(campana.status === 'sent' || campana.status === 'sending') && (
                      <button
                        onClick={() => campana._id && onVerEstadisticas(campana._id)}
                        className="text-green-600 hover:text-green-900 p-1.5 rounded hover:bg-green-50 transition-colors"
                        title="Ver estadísticas"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    )}
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


