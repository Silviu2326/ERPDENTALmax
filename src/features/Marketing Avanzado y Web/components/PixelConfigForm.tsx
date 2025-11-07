import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import {
  TrackingConfig,
  TrackingPlatform,
  ConversionEvent,
  createTrackingConfiguration,
  updateTrackingConfiguration,
} from '../api/trackingApi';

interface PixelConfigFormProps {
  config?: TrackingConfig;
  onSave: () => void;
  onCancel: () => void;
}

const PLATFORMS: { value: TrackingPlatform; label: string }[] = [
  { value: 'Meta', label: 'Meta (Facebook/Instagram)' },
  { value: 'GoogleAds', label: 'Google Ads' },
  { value: 'TikTok', label: 'TikTok Ads' },
];

const DEFAULT_EVENTS: { [key in TrackingPlatform]: ConversionEvent[] } = {
  Meta: [
    { eventName: 'PageView', eventCode: 'PageView' },
    { eventName: 'Lead', eventCode: 'Lead' },
    { eventName: 'CompleteRegistration', eventCode: 'CompleteRegistration' },
  ],
  GoogleAds: [
    { eventName: 'page_view', eventCode: 'page_view' },
    { eventName: 'conversion', eventCode: 'conversion' },
    { eventName: 'sign_up', eventCode: 'sign_up' },
  ],
  TikTok: [
    { eventName: 'CompletePayment', eventCode: 'CompletePayment' },
    { eventName: 'SubmitForm', eventCode: 'SubmitForm' },
  ],
};

export default function PixelConfigForm({ config, onSave, onCancel }: PixelConfigFormProps) {
  const [platform, setPlatform] = useState<TrackingPlatform>(config?.platform || 'Meta');
  const [pixelId, setPixelId] = useState(config?.pixelId || '');
  const [isEnabled, setIsEnabled] = useState(config?.isEnabled ?? true);
  const [conversionEvents, setConversionEvents] = useState<ConversionEvent[]>(
    config?.conversionEvents || DEFAULT_EVENTS[config?.platform || 'Meta']
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (platform && !config) {
      setConversionEvents(DEFAULT_EVENTS[platform]);
    }
  }, [platform, config]);

  const handleAddEvent = () => {
    setConversionEvents([...conversionEvents, { eventName: '', eventCode: '' }]);
  };

  const handleRemoveEvent = (index: number) => {
    setConversionEvents(conversionEvents.filter((_, i) => i !== index));
  };

  const handleEventChange = (index: number, field: 'eventName' | 'eventCode', value: string) => {
    const updated = [...conversionEvents];
    updated[index] = { ...updated[index], [field]: value };
    setConversionEvents(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const configData: Omit<TrackingConfig, '_id' | 'createdAt' | 'updatedAt' | 'clinicId'> = {
        platform,
        pixelId: pixelId.trim(),
        isEnabled,
        conversionEvents: conversionEvents.filter((e) => e.eventName && e.eventCode),
      };

      if (config?._id) {
        await updateTrackingConfiguration(config._id, configData);
      } else {
        await createTrackingConfiguration(configData);
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 ring-1 ring-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {config ? 'Editar Configuración de Píxel' : 'Nueva Configuración de Píxel'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-slate-700 mb-2">
            Plataforma
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as TrackingPlatform)}
            disabled={!!config}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
            required
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          {config && (
            <p className="mt-1 text-sm text-slate-500">No se puede cambiar la plataforma de una configuración existente</p>
          )}
        </div>

        <div>
          <label htmlFor="pixelId" className="block text-sm font-medium text-slate-700 mb-2">
            Pixel ID
          </label>
          <input
            type="text"
            id="pixelId"
            value={pixelId}
            onChange={(e) => setPixelId(e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            placeholder="Ej: 123456789012345"
            required
          />
          <p className="mt-1 text-sm text-slate-500">
            Ingresa el ID del píxel proporcionado por la plataforma
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isEnabled"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
          />
          <label htmlFor="isEnabled" className="ml-2 block text-sm text-slate-700">
            Activar seguimiento
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-slate-700">
              Eventos de Conversión
            </label>
            <button
              type="button"
              onClick={handleAddEvent}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Plus size={16} />
              <span>Agregar Evento</span>
            </button>
          </div>

          <div className="space-y-3">
            {conversionEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={event.eventName}
                  onChange={(e) => handleEventChange(index, 'eventName', e.target.value)}
                  placeholder="Nombre del evento"
                  className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  required
                />
                <input
                  type="text"
                  value={event.eventCode}
                  onChange={(e) => handleEventChange(index, 'eventCode', e.target.value)}
                  placeholder="Código del evento"
                  className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveEvent(index)}
                  className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label="Eliminar evento"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}



