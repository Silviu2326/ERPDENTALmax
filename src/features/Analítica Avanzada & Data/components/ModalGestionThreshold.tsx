import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { KPIThreshold } from '../api/alertasApi';

interface ModalGestionThresholdProps {
  threshold: KPIThreshold | null;
  metricasDisponibles: Array<{ valor: string; etiqueta: string; descripcion: string }>;
  onGuardar: (threshold: Omit<KPIThreshold, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCerrar: () => void;
}

export default function ModalGestionThreshold({
  threshold,
  metricasDisponibles,
  onGuardar,
  onCerrar,
}: ModalGestionThresholdProps) {
  const [formData, setFormData] = useState<Omit<KPIThreshold, '_id' | 'createdAt' | 'updatedAt'>>({
    nombre: '',
    descripcion: '',
    metrica: '',
    operador: 'mayor_que',
    valorUmbral: 0,
    valorUmbral2: undefined,
    frecuenciaVerificacion: 'diaria',
    activa: true,
    notificaciones: {
      email: false,
      push: false,
      dashboard: true,
      usuariosNotificar: [],
    },
    sedeId: undefined,
    profesionalId: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (threshold) {
      setFormData({
        nombre: threshold.nombre,
        descripcion: threshold.descripcion || '',
        metrica: threshold.metrica,
        operador: threshold.operador,
        valorUmbral: threshold.valorUmbral,
        valorUmbral2: threshold.valorUmbral2,
        frecuenciaVerificacion: threshold.frecuenciaVerificacion,
        activa: threshold.activa,
        notificaciones: threshold.notificaciones,
        sedeId: threshold.sedeId,
        profesionalId: threshold.profesionalId,
      });
    }
  }, [threshold]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!formData.metrica) {
      setError('Debes seleccionar una métrica');
      return;
    }
    if (formData.operador === 'entre' && (!formData.valorUmbral2 || formData.valorUmbral2 <= formData.valorUmbral)) {
      setError('Para el operador "entre", el segundo valor debe ser mayor que el primero');
      return;
    }

    setLoading(true);
    try {
      await onGuardar(formData);
      onCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar threshold');
    } finally {
      setLoading(false);
    }
  };

  const getOperadorTexto = (operador: string) => {
    switch (operador) {
      case 'mayor_que':
        return 'Mayor que';
      case 'menor_que':
        return 'Menor que';
      case 'igual':
        return 'Igual a';
      case 'diferente':
        return 'Diferente de';
      case 'entre':
        return 'Entre';
      default:
        return operador;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {threshold ? 'Editar Threshold' : 'Nuevo Threshold'}
          </h2>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Threshold *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Métrica *
              </label>
              <select
                value={formData.metrica}
                onChange={(e) => setFormData({ ...formData, metrica: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecciona una métrica</option>
                {metricasDisponibles.map((m) => (
                  <option key={m.valor} value={m.valor}>
                    {m.etiqueta}
                  </option>
                ))}
              </select>
              {formData.metrica && (
                <p className="text-xs text-gray-500 mt-1">
                  {metricasDisponibles.find((m) => m.valor === formData.metrica)?.descripcion}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operador *
              </label>
              <select
                value={formData.operador}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    operador: e.target.value as any,
                    valorUmbral2: e.target.value !== 'entre' ? undefined : formData.valorUmbral2,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="mayor_que">Mayor que</option>
                <option value="menor_que">Menor que</option>
                <option value="igual">Igual a</option>
                <option value="diferente">Diferente de</option>
                <option value="entre">Entre</option>
              </select>
            </div>
          </div>

          <div className={`grid gap-4 ${formData.operador === 'entre' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Umbral *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valorUmbral}
                onChange={(e) => setFormData({ ...formData, valorUmbral: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {formData.operador === 'entre' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Umbral 2 *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorUmbral2 || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, valorUmbral2: parseFloat(e.target.value) || undefined })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frecuencia de Verificación *
            </label>
            <select
              value={formData.frecuenciaVerificacion}
              onChange={(e) =>
                setFormData({ ...formData, frecuenciaVerificacion: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="tiempo_real">Tiempo Real</option>
              <option value="diaria">Diaria</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Notificaciones
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.notificaciones.dashboard}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificaciones: {
                        ...formData.notificaciones,
                        dashboard: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mostrar en Dashboard</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.notificaciones.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificaciones: {
                        ...formData.notificaciones,
                        email: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enviar por Email</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.notificaciones.push}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificaciones: {
                        ...formData.notificaciones,
                        push: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Notificación Push</span>
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.activa}
              onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              id="activa"
            />
            <label htmlFor="activa" className="text-sm font-medium text-gray-700">
              Threshold Activo
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCerrar}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
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


