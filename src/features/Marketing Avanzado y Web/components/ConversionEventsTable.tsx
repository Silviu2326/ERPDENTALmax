import { useState } from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight, Eye, Package } from 'lucide-react';
import { TrackingConfig, ConversionEvent } from '../api/trackingApi';

interface ConversionEventsTableProps {
  configurations: TrackingConfig[];
  onEdit: (config: TrackingConfig) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
  onViewSnippet?: (configs: TrackingConfig[]) => void;
}

export default function ConversionEventsTable({
  configurations,
  onEdit,
  onDelete,
  onToggle,
  onViewSnippet,
}: ConversionEventsTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const getPlatformLabel = (platform: string) => {
    const labels: { [key: string]: string } = {
      Meta: 'Meta (Facebook/Instagram)',
      GoogleAds: 'Google Ads',
      TikTok: 'TikTok Ads',
    };
    return labels[platform] || platform;
  };

  const getPlatformBadgeColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      Meta: 'bg-blue-100 text-blue-800',
      GoogleAds: 'bg-green-100 text-green-800',
      TikTok: 'bg-black text-white',
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  if (configurations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center ring-1 ring-slate-200">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay configuraciones de píxeles</h3>
        <p className="text-gray-600 mb-4">
          Agrega una nueva configuración para comenzar a rastrear conversiones
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden ring-1 ring-slate-200">
      {onViewSnippet && (
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <button
            onClick={() => onViewSnippet(configurations)}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Eye size={18} />
            <span>Ver Snippet de Código</span>
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Plataforma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Pixel ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Eventos
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {configurations.map((config) => (
              <tr key={config._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformBadgeColor(
                      config.platform
                    )}`}
                  >
                    {getPlatformLabel(config.platform)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-slate-900">{config.pixelId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {config.conversionEvents.length > 0 ? (
                      config.conversionEvents.slice(0, 3).map((event, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700"
                        >
                          {event.eventName}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">Sin eventos</span>
                    )}
                    {config.conversionEvents.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        +{config.conversionEvents.length - 3} más
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onToggle(config._id!, !config.isEnabled)}
                    className="inline-flex items-center transition-colors"
                    aria-label={config.isEnabled ? 'Desactivar' : 'Activar'}
                  >
                    {config.isEnabled ? (
                      <ToggleRight className="w-6 h-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(config)}
                      className="text-blue-600 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                      aria-label="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(config._id!)}
                      className="text-red-600 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                      aria-label="Eliminar"
                    >
                      {confirmDelete === config._id ? (
                        <span className="text-xs text-red-600 font-semibold">¿Eliminar?</span>
                      ) : (
                        <Trash2 size={18} />
                      )}
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



