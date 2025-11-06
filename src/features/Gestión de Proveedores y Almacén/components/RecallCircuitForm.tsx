import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { RecallCircuit } from '../api/recallsApi';
import CommunicationStepBuilder, { CommunicationStep } from './CommunicationStepBuilder';

interface RecallCircuitFormProps {
  circuito?: RecallCircuit;
  onGuardar: (circuito: Omit<RecallCircuit, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onCancelar: () => void;
  loading?: boolean;
}

export default function RecallCircuitForm({
  circuito,
  onGuardar,
  onCancelar,
  loading = false,
}: RecallCircuitFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    trigger: {
      type: 'appointment',
      details: {
        treatmentId: '',
        appointmentType: '',
      },
      daysAfter: 180,
    },
    communicationSequence: [] as CommunicationStep[],
  });

  useEffect(() => {
    if (circuito) {
      setFormData({
        name: circuito.name,
        description: circuito.description || '',
        isActive: circuito.isActive,
        trigger: circuito.trigger,
        communicationSequence: circuito.communicationSequence as CommunicationStep[],
      });
    }
  }, [circuito]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.communicationSequence.length === 0) {
      alert('Debes agregar al menos un paso de comunicación');
      return;
    }

    onGuardar({
      name: formData.name,
      description: formData.description,
      isActive: formData.isActive,
      trigger: formData.trigger,
      communicationSequence: formData.communicationSequence,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {circuito ? 'Editar Circuito de Recall' : 'Nuevo Circuito de Recall'}
        </h2>
        <button
          onClick={onCancelar}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Información Básica */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Circuito <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Recordatorio de Limpieza Semestral"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe el propósito de este circuito de recall..."
            />
          </div>
        </div>

        {/* Configuración del Disparador */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">Configuración del Disparador</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Disparador <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.trigger.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  trigger: {
                    ...formData.trigger,
                    type: e.target.value,
                    details: {
                      treatmentId: '',
                      appointmentType: '',
                    },
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="appointment">Después de Cita</option>
              <option value="treatment">Después de Tratamiento</option>
              <option value="last_visit">Última Visita</option>
            </select>
          </div>

          {formData.trigger.type === 'treatment' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID de Tratamiento
              </label>
              <input
                type="text"
                value={formData.trigger.details.treatmentId || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trigger: {
                      ...formData.trigger,
                      details: {
                        ...formData.trigger.details,
                        treatmentId: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ID del tratamiento"
              />
            </div>
          )}

          {formData.trigger.type === 'appointment' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Cita
              </label>
              <input
                type="text"
                value={formData.trigger.details.appointmentType || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trigger: {
                      ...formData.trigger,
                      details: {
                        ...formData.trigger.details,
                        appointmentType: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Limpieza, Revisión, etc."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Días Después del Evento <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.trigger.daysAfter}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  trigger: {
                    ...formData.trigger,
                    daysAfter: parseInt(e.target.value) || 0,
                  },
                })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Secuencia de Comunicación */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <CommunicationStepBuilder
            steps={formData.communicationSequence}
            onChange={(steps) => setFormData({ ...formData, communicationSequence: steps })}
          />
        </div>

        {/* Estado */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Circuito activo
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar Circuito'}
          </button>
        </div>
      </form>
    </div>
  );
}


