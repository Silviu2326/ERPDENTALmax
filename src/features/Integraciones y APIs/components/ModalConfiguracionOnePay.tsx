import { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';
import {
  guardarConfiguracionOnePay,
  ConfiguracionOnePay,
} from '../api/pasarelasPagoApi';

interface ModalConfiguracionOnePayProps {
  configuracion: ConfiguracionOnePay | null;
  onCerrar: () => void;
  onGuardado: () => void;
}

export default function ModalConfiguracionOnePay({
  configuracion,
  onCerrar,
  onGuardado,
}: ModalConfiguracionOnePayProps) {
  const [formData, setFormData] = useState({
    apiKey: '',
    sharedSecret: '',
    entorno: 'integracion' as 'integracion' | 'produccion',
    activa: true,
  });
  const [mostrarApiKey, setMostrarApiKey] = useState(false);
  const [mostrarSharedSecret, setMostrarSharedSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (configuracion) {
      setFormData({
        apiKey: configuracion.apiKey || '',
        sharedSecret: configuracion.sharedSecret || '',
        entorno: configuracion.entorno || 'integracion',
        activa: configuracion.activa ?? true,
      });
    }
  }, [configuracion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await guardarConfiguracionOnePay(formData);
      onGuardado();
    } catch (err) {
      console.error('Error al guardar configuración:', err);
      setError('Error al guardar la configuración. Por favor, verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {configuracion ? 'Editar Configuración One Pay' : 'Nueva Configuración One Pay'}
          </h2>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key *
            </label>
            <div className="relative">
              <input
                type={mostrarApiKey ? 'text' : 'password'}
                required
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu API Key de Transbank"
              />
              <button
                type="button"
                onClick={() => setMostrarApiKey(!mostrarApiKey)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {mostrarApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Obtén tu API Key desde el panel de Transbank
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shared Secret *
            </label>
            <div className="relative">
              <input
                type={mostrarSharedSecret ? 'text' : 'password'}
                required
                value={formData.sharedSecret}
                onChange={(e) => setFormData({ ...formData, sharedSecret: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu Shared Secret de Transbank"
              />
              <button
                type="button"
                onClick={() => setMostrarSharedSecret(!mostrarSharedSecret)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {mostrarSharedSecret ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Obtén tu Shared Secret desde el panel de Transbank
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entorno *
            </label>
            <select
              value={formData.entorno}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  entorno: e.target.value as 'integracion' | 'produccion',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="integracion">Integración (Pruebas)</option>
              <option value="produccion">Producción</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Usa Integración para pruebas y Producción para pagos reales
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.activa}
              onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              id="activa"
            />
            <label htmlFor="activa" className="text-sm font-medium text-gray-700">
              Activar integración
            </label>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Las credenciales se almacenan de forma segura y
              encriptada. Asegúrate de usar las credenciales correctas según el entorno seleccionado.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



