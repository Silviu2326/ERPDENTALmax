import { Mail, Calendar, CheckCircle, Clock, Send, XCircle, Eye, Trash2, Edit } from 'lucide-react';
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
      draft: { label: 'Borrador', icon: Edit, color: 'bg-gray-100 text-gray-800' },
      scheduled: { label: 'Programada', icon: Clock, color: 'bg-blue-100 text-blue-800' },
      sending: { label: 'Enviando', icon: Send, color: 'bg-yellow-100 text-yellow-800' },
      sent: { label: 'Enviada', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
      failed: { label: 'Fallida', icon: XCircle, color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No hay campañas de email creadas</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asunto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Programada
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Enviada
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destinatarios
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {campaigns.map((campaign) => (
            <tr key={campaign._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{campaign.subject}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(campaign.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(campaign.scheduledAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(campaign.sentAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {campaign.stats?.totalRecipients || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  {campaign.status === 'sent' && onViewReport && (
                    <button
                      onClick={() => onViewReport(campaign._id!)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Ver reporte"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {campaign.status === 'draft' && onEdit && (
                    <button
                      onClick={() => onEdit(campaign)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {campaign.status === 'draft' && onDelete && (
                    <button
                      onClick={() => onDelete(campaign._id!)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
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


