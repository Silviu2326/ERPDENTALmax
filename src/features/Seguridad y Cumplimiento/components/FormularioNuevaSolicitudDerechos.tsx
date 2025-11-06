import { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { crearSolicitudDerechos, SolicitudDerechos } from '../api/rgpdApi';

interface FormularioNuevaSolicitudDerechosProps {
  pacienteId?: string;
  onGuardado?: (solicitud: SolicitudDerechos) => void;
  onCancelar?: () => void;
}

export default function FormularioNuevaSolicitudDerechos({
  pacienteId,
  onGuardado,
  onCancelar,
}: FormularioNuevaSolicitudDerechosProps) {
  const [formData, setFormData] = useState({
    pacienteId: pacienteId || '',
    tipoDerecho: '' as SolicitudDerechos['tipoDerecho'] | '',
    detalleSolicitud: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tiposDerecho: Array<{ value: SolicitudDerechos['tipoDerecho']; label: string }> = [
    { value: 'ACCESO', label: 'Acceso - Obtener copia de mis datos' },
    { value: 'RECTIFICACION', label: 'Rectificación - Corregir datos incorrectos' },
    { value: 'SUPRESION', label: 'Supresión - Eliminar mis datos' },
    { value: 'LIMITACION', label: 'Limitación - Restringir el tratamiento' },
    { value: 'PORTABILIDAD', label: 'Portabilidad - Exportar mis datos' },
    { value: 'OPOSICION', label: 'Oposición - Oponerme al tratamiento' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.pacienteId || !formData.tipoDerecho) {
      setError('Por favor, complete todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      const nuevaSolicitud = await crearSolicitudDerechos({
        pacienteId: formData.pacienteId,
        tipoDerecho: formData.tipoDerecho,
        detalleSolicitud: formData.detalleSolicitud,
      });

      if (onGuardado) {
        onGuardado(nuevaSolicitud);
      }

      // Reset form
      setFormData({
        pacienteId: pacienteId || '',
        tipoDerecho: '' as SolicitudDerechos['tipoDerecho'] | '',
        detalleSolicitud: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Nueva Solicitud de Derechos</h3>
        {onCancelar && (
          <button
            onClick={onCancelar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ID del Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID del Paciente <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.pacienteId}
            onChange={(e) => setFormData({ ...formData, pacienteId: e.target.value })}
            required
            disabled={!!pacienteId}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Ingrese el ID del paciente"
          />
        </div>

        {/* Tipo de Derecho */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Derecho <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.tipoDerecho}
            onChange={(e) =>
              setFormData({
                ...formData,
                tipoDerecho: e.target.value as SolicitudDerechos['tipoDerecho'],
              })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione un tipo de derecho</option>
            {tiposDerecho.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Detalle de la Solicitud */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detalle de la Solicitud
          </label>
          <textarea
            value={formData.detalleSolicitud}
            onChange={(e) => setFormData({ ...formData, detalleSolicitud: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describa los detalles de la solicitud del paciente..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Información adicional sobre la solicitud del paciente
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {onCancelar && (
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Solicitud'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}


