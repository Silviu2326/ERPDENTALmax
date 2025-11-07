import { CheckCircle, Clock, Send, XCircle, Eye, Trash2, Edit, Loader2, Package } from 'lucide-react';
import { EmailCampaign } from '../api/campaignsApi';

interface CampaignsListTableProps {
  campaigns: EmailCampaign[];
  onEdit?: (campaign: EmailCampaign) => void;
  onDelete?: (id: string) => void;
  onViewReport?: (id: string) => void;
  loading?: boolean;
}

export default function CampaignsListTable({
  campaigns,
  onEdit,
  onDelete,
  onViewReport,
  loading = false,
}: CampaignsListTableProps) {
  const getStatusBadge = (status: EmailCampaign['status']) => {
    const statusConfig = {
      draft: { label: 'Borrador', icon: Edit, bgColor: 'bg-gray-100', textColor: 'text-gray-800', iconColor: 'text-gray-600' },
      scheduled: { label: 'Programada', icon: Clock, bgColor: 'bg-blue-100', textColor: 'text-blue-800', iconColor: 'text-blue-600' },
      sending: { label: 'Enviando', icon: Send, bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', iconColor: 'text-yellow-600' },
      sent: { label: 'Enviada', icon: CheckCircle, bgColor: 'bg-green-100', textColor: 'text-green-800', iconColor: 'text-green-600' },
      failed: { label: 'Fallida', icon: XCircle, bgColor: 'bg-red-100', textColor: 'text-red-800', iconColor: 'text-red-600' },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        <Icon size={12} className={config.iconColor} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="p-8 text-center bg-white">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay campañas de email</h3>
        <p className="text-gray-600">Aún no se han creado campañas de email. Crea tu primera campaña para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Asunto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Programada
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Enviada
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Destinatarios
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {campaigns.map((campaign) => (
            <tr key={campaign._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-md truncate" title={campaign.subject}>
                  {campaign.subject}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(campaign.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {formatDate(campaign.scheduledAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {formatDate(campaign.sentAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {campaign.stats?.totalRecipients ? (
                  <span className="font-medium text-gray-900">{campaign.stats.totalRecipients.toLocaleString()}</span>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  {campaign.status === 'sent' && onViewReport && (
                    <button
                      onClick={() => onViewReport(campaign._id!)}
                      className="inline-flex items-center justify-center p-2 rounded-xl text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-all"
                      title="Ver reporte"
                    >
                      <Eye size={18} />
                    </button>
                  )}
                  {campaign.status === 'draft' && onEdit && (
                    <button
                      onClick={() => onEdit(campaign)}
                      className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                  {campaign.status === 'draft' && onDelete && (
                    <button
                      onClick={() => onDelete(campaign._id!)}
                      className="inline-flex items-center justify-center p-2 rounded-xl text-red-600 hover:text-red-900 hover:bg-red-50 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



