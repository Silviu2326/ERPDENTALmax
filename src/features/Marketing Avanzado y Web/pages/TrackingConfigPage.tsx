import { useState, useEffect } from 'react';
import { Plus, Code, RefreshCw, AlertCircle } from 'lucide-react';
import {
  TrackingConfig,
  getTrackingConfigurations,
  deleteTrackingConfiguration,
  updateTrackingConfiguration,
} from '../api/trackingApi';
import PixelConfigForm from '../components/PixelConfigForm';
import ConversionEventsTable from '../components/ConversionEventsTable';
import TrackingSnippetDisplay from '../components/TrackingSnippetDisplay';

export default function TrackingConfigPage() {
  const [configurations, setConfigurations] = useState<TrackingConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<TrackingConfig | undefined>();
  const [showSnippet, setShowSnippet] = useState(false);

  const loadConfigurations = async () => {
    setLoading(true);
    setError(null);
    try {
      const configs = await getTrackingConfigurations();
      setConfigurations(configs);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las configuraciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  const handleNewConfig = () => {
    setEditingConfig(undefined);
    setShowForm(true);
  };

  const handleEditConfig = (config: TrackingConfig) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleSaveConfig = () => {
    setShowForm(false);
    setEditingConfig(undefined);
    loadConfigurations();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingConfig(undefined);
  };

  const handleDeleteConfig = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta configuración?')) {
      return;
    }

    try {
      await deleteTrackingConfiguration(id);
      await loadConfigurations();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la configuración');
    }
  };

  const handleToggleConfig = async (id: string, enabled: boolean) => {
    try {
      await updateTrackingConfiguration(id, { isEnabled: enabled });
      await loadConfigurations();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la configuración');
    }
  };

  if (showForm) {
    return (
      <div className="p-6">
        <PixelConfigForm
          config={editingConfig}
          onSave={handleSaveConfig}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pixel/Conversiones y UTM Tracking</h1>
          <p className="text-gray-600 mt-2">
            Configura y gestiona los píxeles de seguimiento de tus campañas publicitarias
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSnippet(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Code className="w-5 h-5" />
            <span>Ver Snippet</span>
          </button>
          <button
            onClick={handleNewConfig}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Píxel</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando configuraciones...</p>
        </div>
      ) : (
        <ConversionEventsTable
          configurations={configurations}
          onEdit={handleEditConfig}
          onDelete={handleDeleteConfig}
          onToggle={handleToggleConfig}
          onViewSnippet={() => setShowSnippet(true)}
        />
      )}

      {showSnippet && (
        <TrackingSnippetDisplay
          configurations={configurations}
          onClose={() => setShowSnippet(false)}
        />
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">¿Cómo funciona?</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>
            <strong>Configura tus píxeles:</strong> Agrega los píxeles de Meta, Google Ads o TikTok
            con sus respectivos IDs.
          </li>
          <li>
            <strong>Activa los eventos:</strong> Configura los eventos de conversión que deseas
            rastrear (citas completadas, leads, etc.).
          </li>
          <li>
            <strong>Obtén el código:</strong> Copia el snippet generado e insértalo en el{' '}
            <code className="bg-blue-100 px-1 rounded">&lt;head&gt;</code> de tu sitio web.
          </li>
          <li>
            <strong>Captura automática:</strong> El sistema capturará automáticamente los parámetros
            UTM cuando los usuarios lleguen desde tus campañas.
          </li>
          <li>
            <strong>Asociación de leads:</strong> Cada nuevo lead o paciente registrado a través del
            formulario web tendrá asociada la información de la campaña que lo trajo.
          </li>
        </ol>
      </div>
    </div>
  );
}


