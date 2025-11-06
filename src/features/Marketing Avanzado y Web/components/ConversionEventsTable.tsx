import { useState } from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg">No hay configuraciones de píxeles</p>
        <p className="text-gray-400 text-sm mt-2">
          Agrega una nueva configuración para comenzar a rastrear conversiones
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {onViewSnippet && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <button
            onClick={() => onViewSnippet(configurations)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Eye className="w-5 h-5" />
            <span>Ver Snippet de Código</span>
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plataforma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pixel ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Eventos
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {configurations.map((config) => (
              <tr key={config._id} className="hover:bg-gray-50">
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
                  <div className="text-sm font-mono text-gray-900">{config.pixelId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {config.conversionEvents.length > 0 ? (
                      config.conversionEvents.slice(0, 3).map((event, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {event.eventName}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">Sin eventos</span>
                    )}
                    {config.conversionEvents.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{config.conversionEvents.length - 3} más
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onToggle(config._id!, !config.isEnabled)}
                    className="inline-flex items-center"
                    aria-label={config.isEnabled ? 'Desactivar' : 'Activar'}
                  >
                    {config.isEnabled ? (
                      <ToggleRight className="w-6 h-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(config)}
                      className="text-blue-600 hover:text-blue-900"
                      aria-label="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(config._id!)}
                      className="text-red-600 hover:text-red-900"
                      aria-label="Eliminar"
                    >
                      {confirmDelete === config._id ? (
                        <span className="text-xs text-red-600 font-semibold">¿Eliminar?</span>
                      ) : (
                        <Trash2 className="w-5 h-5" />
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


