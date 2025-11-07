import { useState, useEffect } from 'react';
import { Save, Clock, Trash2, AlertCircle } from 'lucide-react';
import { BackupSettings, getBackupSettings, updateBackupSettings } from '../api/backupApi';

interface BackupScheduleSettingsProps {
  onSettingsUpdated?: () => void;
}

export default function BackupScheduleSettings({ onSettingsUpdated }: BackupScheduleSettingsProps) {
  const [settings, setSettings] = useState<BackupSettings>({
    schedule: '0 2 * * *',
    retentionDays: 30,
    enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = await getBackupSettings();
      setSettings(config);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await updateBackupSettings(settings);
      setSuccess(true);
      if (onSettingsUpdated) {
        onSettingsUpdated();
      }
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const parseCronExpression = (cron: string) => {
    const parts = cron.split(' ');
    if (parts.length !== 5) return { hora: '02:00', dias: 'Diario' };
    const minutos = parts[1];
    const horas = parts[2];
    const dias = parts[3];
    const meses = parts[4];

    const hora = `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}`;

    let diasTexto = 'Diario';
    if (dias !== '*') {
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      if (dias.includes(',')) {
        const diasNum = dias.split(',').map((d) => parseInt(d));
        diasTexto = diasNum.map((d) => diasSemana[d]).join(', ');
      } else if (dias.includes('-')) {
        const [inicio, fin] = dias.split('-').map((d) => parseInt(d));
        diasTexto = `${diasSemana[inicio]} - ${diasSemana[fin]}`;
      } else {
        diasTexto = diasSemana[parseInt(dias)];
      }
    }

    return { hora, dias: diasTexto };
  };

  const generarCronExpression = (hora: string, frecuencia: string) => {
    const [horas, minutos] = hora.split(':').map(Number);
    let dias = '*';

    if (frecuencia === 'diario') {
      dias = '*';
    } else if (frecuencia === 'semanal') {
      dias = '1'; // Lunes
    } else if (frecuencia === 'mensual') {
      dias = '1'; // Primer día del mes
    }

    return `${minutos} ${horas} ${dias} * *`;
  };

  const { hora, dias } = parseCronExpression(settings.schedule);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Copias Automáticas</h3>
          <p className="text-sm text-gray-500">Programa copias de seguridad automáticas</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">Configuración guardada correctamente</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Estado de copias automáticas */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Habilitar copias de seguridad automáticas</span>
          </label>
          <p className="ml-7 mt-1 text-sm text-gray-500">
            Las copias automáticas se ejecutarán según la programación configurada
          </p>
        </div>

        {settings.enabled && (
          <>
            {/* Frecuencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia</label>
              <select
                value={
                  settings.schedule.includes('*') && settings.schedule.split(' ')[2] === '*'
                    ? 'diario'
                    : settings.schedule.split(' ')[2] === '1'
                    ? 'semanal'
                    : 'mensual'
                }
                onChange={(e) => {
                  const frecuencia = e.target.value;
                  const nuevaHora = hora;
                  const nuevoCron = generarCronExpression(nuevaHora, frecuencia);
                  setSettings({ ...settings, schedule: nuevoCron });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal (Lunes)</option>
                <option value="mensual">Mensual (Primer día del mes)</option>
              </select>
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hora de ejecución</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => {
                  const nuevaHora = e.target.value;
                  const frecuencia =
                    settings.schedule.includes('*') && settings.schedule.split(' ')[2] === '*'
                      ? 'diario'
                      : settings.schedule.split(' ')[2] === '1'
                      ? 'semanal'
                      : 'mensual';
                  const nuevoCron = generarCronExpression(nuevaHora, frecuencia);
                  setSettings({ ...settings, schedule: nuevoCron });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Se recomienda ejecutar durante horas de bajo uso del sistema
              </p>
            </div>

            {/* Retención */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de retención de copias
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={settings.retentionDays}
                onChange={(e) =>
                  setSettings({ ...settings, retentionDays: parseInt(e.target.value) || 30 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Las copias más antiguas se eliminarán automáticamente después de este período
              </p>
            </div>

            {/* Resumen de configuración */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Resumen de configuración:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Frecuencia: {dias}</li>
                <li>• Hora: {hora}</li>
                <li>• Retención: {settings.retentionDays} días</li>
              </ul>
            </div>
          </>
        )}

        {/* Botón de guardar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



