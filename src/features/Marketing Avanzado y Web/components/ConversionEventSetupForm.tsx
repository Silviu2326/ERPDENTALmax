import { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  ConversionEventSettings,
  ConversionEvent,
  Platform,
  getConversionEventSettings,
  saveConversionEventSettings,
} from '../api/adsIntegrationApi';

interface ConversionEventSetupFormProps {
  onSave?: () => void;
}

const ERP_EVENTS = [
  { value: 'cita_completada', label: 'Cita Completada' },
  { value: 'primera_cita_asistida', label: 'Primera Cita Asistida' },
  { value: 'presupuesto_aceptado', label: 'Presupuesto Aceptado' },
  { value: 'tratamiento_iniciado', label: 'Tratamiento Iniciado' },
  { value: 'tratamiento_completado', label: 'Tratamiento Completado' },
  { value: 'pago_realizado', label: 'Pago Realizado' },
];

const GOOGLE_ADS_EVENTS = [
  { value: 'purchase', label: 'Compra' },
  { value: 'lead', label: 'Lead' },
  { value: 'sign_up', label: 'Registro' },
  { value: 'appointment', label: 'Cita' },
  { value: 'phone_call', label: 'Llamada Telefónica' },
];

const META_ADS_EVENTS = [
  { value: 'Purchase', label: 'Compra' },
  { value: 'Lead', label: 'Lead' },
  { value: 'CompleteRegistration', label: 'Registro Completo' },
  { value: 'Schedule', label: 'Programar Cita' },
  { value: 'Contact', label: 'Contacto' },
];

export default function ConversionEventSetupForm({ onSave }: ConversionEventSetupFormProps) {
  const [settings, setSettings] = useState<ConversionEventSettings>({ conversionEvents: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getConversionEventSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error al cargar la configuración:', error);
      setMessage({ type: 'error', text: 'Error al cargar la configuración' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = (platform: Platform) => {
    const newEvent: ConversionEvent = {
      erpEvent: '',
      platformEvent: '',
      platform,
      enabled: true,
    };
    setSettings({
      conversionEvents: [...settings.conversionEvents, newEvent],
    });
  };

  const handleUpdateEvent = (index: number, updates: Partial<ConversionEvent>) => {
    const updated = [...settings.conversionEvents];
    updated[index] = { ...updated[index], ...updates };
    setSettings({ conversionEvents: updated });
  };

  const handleRemoveEvent = (index: number) => {
    const updated = settings.conversionEvents.filter((_, i) => i !== index);
    setSettings({ conversionEvents: updated });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage(null);

      // Validar que todos los eventos tengan erpEvent y platformEvent
      const invalid = settings.conversionEvents.some(
        (event) => !event.erpEvent || !event.platformEvent
      );

      if (invalid) {
        setMessage({ type: 'error', text: 'Por favor, completa todos los campos de los eventos' });
        setIsSaving(false);
        return;
      }

      await saveConversionEventSettings(settings);
      setMessage({ type: 'success', text: 'Configuración guardada correctamente' });
      
      if (onSave) {
        onSave();
      }

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      setMessage({ type: 'error', text: 'Error al guardar la configuración' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Configuración de Eventos de Conversión
        </h3>
        <p className="text-sm text-gray-600">
          Configura qué eventos del ERP se enviarán como conversiones a las plataformas publicitarias.
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Google Ads Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Google Ads</h4>
            <button
              onClick={() => handleAddEvent('google')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Agregar Evento
            </button>
          </div>
          <div className="space-y-3">
            {settings.conversionEvents
              .filter((event) => event.platform === 'google')
              .map((event, index) => {
                const actualIndex = settings.conversionEvents.findIndex(
                  (e, i) => e.platform === 'google' && i >= index
                );
                return (
                  <div key={actualIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Evento ERP
                        </label>
                        <select
                          value={event.erpEvent}
                          onChange={(e) =>
                            handleUpdateEvent(actualIndex, { erpEvent: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Seleccionar...</option>
                          {ERP_EVENTS.map((evt) => (
                            <option key={evt.value} value={evt.value}>
                              {evt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Evento Google Ads
                        </label>
                        <select
                          value={event.platformEvent}
                          onChange={(e) =>
                            handleUpdateEvent(actualIndex, { platformEvent: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Seleccionar...</option>
                          {GOOGLE_ADS_EVENTS.map((evt) => (
                            <option key={evt.value} value={evt.value}>
                              {evt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end space-x-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={event.enabled}
                            onChange={(e) =>
                              handleUpdateEvent(actualIndex, { enabled: e.target.checked })
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Habilitado</span>
                        </label>
                        <button
                          onClick={() => handleRemoveEvent(actualIndex)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Meta Ads Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Meta Ads</h4>
            <button
              onClick={() => handleAddEvent('meta')}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              + Agregar Evento
            </button>
          </div>
          <div className="space-y-3">
            {settings.conversionEvents
              .filter((event) => event.platform === 'meta')
              .map((event, index) => {
                const actualIndex = settings.conversionEvents.findIndex(
                  (e, i) => e.platform === 'meta' && i >= index
                );
                return (
                  <div key={actualIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Evento ERP
                        </label>
                        <select
                          value={event.erpEvent}
                          onChange={(e) =>
                            handleUpdateEvent(actualIndex, { erpEvent: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Seleccionar...</option>
                          {ERP_EVENTS.map((evt) => (
                            <option key={evt.value} value={evt.value}>
                              {evt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Evento Meta Ads
                        </label>
                        <select
                          value={event.platformEvent}
                          onChange={(e) =>
                            handleUpdateEvent(actualIndex, { platformEvent: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Seleccionar...</option>
                          {META_ADS_EVENTS.map((evt) => (
                            <option key={evt.value} value={evt.value}>
                              {evt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end space-x-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={event.enabled}
                            onChange={(e) =>
                              handleUpdateEvent(actualIndex, { enabled: e.target.checked })
                            }
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">Habilitado</span>
                        </label>
                        <button
                          onClick={() => handleRemoveEvent(actualIndex)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}


