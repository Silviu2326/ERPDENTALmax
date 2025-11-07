import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Info } from 'lucide-react';
import {
  obtenerConfiguracionRGPD,
  actualizarConfiguracionRGPD,
  ConfiguracionRGPD,
} from '../api/rgpdApi';

export default function PanelConfiguracionPoliticas() {
  const [configuracion, setConfiguracion] = useState<ConfiguracionRGPD>({
    textoConsentimientoGeneral: '',
    periodoRetencionDatos: 60,
    responsableTratamientoInfo: '',
    dpoInfo: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await obtenerConfiguracionRGPD();
      setConfiguracion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardar = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await actualizarConfiguracionRGPD(configuracion);
      setSuccessMessage('Configuración guardada exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Configuración de Políticas RGPD</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure los textos legales y políticas de retención de datos
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 text-sm">{successMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Texto de Consentimiento General */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto de Consentimiento General
            </label>
            <textarea
              value={configuracion.textoConsentimientoGeneral}
              onChange={(e) =>
                setConfiguracion({ ...configuracion, textoConsentimientoGeneral: e.target.value })
              }
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese el texto del consentimiento para el tratamiento de datos personales..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Este texto se mostrará a los pacientes al solicitar su consentimiento
            </p>
          </div>

          {/* Período de Retención */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período de Retención de Datos (meses)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={configuracion.periodoRetencionDatos}
              onChange={(e) =>
                setConfiguracion({
                  ...configuracion,
                  periodoRetencionDatos: parseInt(e.target.value) || 60,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Tiempo que se conservarán los datos personales después de la última interacción
            </p>
          </div>

          {/* Información del Responsable del Tratamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Información del Responsable del Tratamiento
            </label>
            <textarea
              value={configuracion.responsableTratamientoInfo}
              onChange={(e) =>
                setConfiguracion({ ...configuracion, responsableTratamientoInfo: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre, dirección, contacto del responsable del tratamiento de datos..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Datos de contacto del responsable del tratamiento según RGPD
            </p>
          </div>

          {/* Información del DPO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Información del Delegado de Protección de Datos (DPO)
            </label>
            <textarea
              value={configuracion.dpoInfo}
              onChange={(e) => setConfiguracion({ ...configuracion, dpoInfo: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre, dirección, email del DPO (si aplica)..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Información del DPO si la clínica tiene uno designado
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Nota importante:</p>
                <p>
                  Los cambios en esta configuración afectarán a todos los nuevos consentimientos y
                  solicitudes de derechos. Es recomendable revisar estos textos periódicamente
                  para asegurar el cumplimiento con la normativa vigente.
                </p>
              </div>
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleGuardar}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Configuración'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



