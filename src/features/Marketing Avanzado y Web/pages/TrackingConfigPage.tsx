import { useState, useEffect } from 'react';
import { Plus, Code, RefreshCw, AlertCircle, Target } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <PixelConfigForm
            config={editingConfig}
            onSave={handleSaveConfig}
            onCancel={handleCancelForm}
          />
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
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Target size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Pixel/Conversiones y UTM Tracking
                  </h1>
                  <p className="text-gray-600">
                    Configura y gestiona los píxeles de seguimiento de tus campañas publicitarias
                  </p>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSnippet(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-all"
                >
                  <Code size={20} />
                  <span>Ver Snippet</span>
                </button>
                <button
                  onClick={handleNewConfig}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                  <Plus size={20} />
                  <span>Nuevo Píxel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 transition-colors"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <RefreshCw size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando configuraciones...</p>
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

          <div className="bg-white rounded-lg shadow-sm p-6 ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">¿Cómo funciona?</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>
                <strong className="text-gray-900">Configura tus píxeles:</strong> Agrega los píxeles de Meta, Google Ads o TikTok
                con sus respectivos IDs.
              </li>
              <li>
                <strong className="text-gray-900">Activa los eventos:</strong> Configura los eventos de conversión que deseas
                rastrear (citas completadas, leads, etc.).
              </li>
              <li>
                <strong className="text-gray-900">Obtén el código:</strong> Copia el snippet generado e insértalo en el{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">&lt;head&gt;</code> de tu sitio web.
              </li>
              <li>
                <strong className="text-gray-900">Captura automática:</strong> El sistema capturará automáticamente los parámetros
                UTM cuando los usuarios lleguen desde tus campañas.
              </li>
              <li>
                <strong className="text-gray-900">Asociación de leads:</strong> Cada nuevo lead o paciente registrado a través del
                formulario web tendrá asociada la información de la campaña que lo trajo.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {showSnippet && (
        <TrackingSnippetDisplay
          configurations={configurations}
          onClose={() => setShowSnippet(false)}
        />
      )}
    </div>
  );
}



