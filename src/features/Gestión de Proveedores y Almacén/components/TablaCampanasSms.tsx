import { SmsCampaign } from '../api/campanasSmsApi';
import { Edit, Trash2, BarChart3, Calendar, MessageSquare, CheckCircle, Clock, XCircle, Send, Loader2, AlertCircle } from 'lucide-react';

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
        className: 'bg-gray-100 text-gray-800',
        icon: MessageSquare,
      },
      scheduled: {
        label: 'Programada',
        className: 'bg-blue-100 text-blue-800',
        icon: Calendar,
      },
      sending: {
        label: 'Enviando',
        className: 'bg-yellow-100 text-yellow-800',
        icon: Send,
      },
      sent: {
        label: 'Enviada',
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      },
      failed: {
        label: 'Fallida',
        className: 'bg-red-100 text-red-800',
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        <Icon size={12} />
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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (campañas.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay campañas de SMS</h3>
        <p className="text-gray-600 mb-4">
          Crea tu primera campaña para comenzar
        </p>
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
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{campana.name}</div>
                    <div className="text-sm text-gray-600 truncate max-w-xs">
                      {campana.message}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(campana.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(campana.scheduledAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(campana.sentAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {campana.stats ? (
                    <div className="text-sm">
                      <div className="text-gray-900 font-medium">
                        {campana.stats.delivered || 0} / {campana.stats.total || 0}
                      </div>
                      <div className="text-gray-600 text-xs">
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
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-xl hover:bg-blue-50 transition-all"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => campana._id && onEliminar(campana._id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-xl hover:bg-red-50 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    {(campana.status === 'sent' || campana.status === 'sending') && (
                      <button
                        onClick={() => campana._id && onVerEstadisticas(campana._id)}
                        className="text-green-600 hover:text-green-900 p-1.5 rounded-xl hover:bg-green-50 transition-all"
                        title="Ver estadísticas"
                      >
                        <BarChart3 size={16} />
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



