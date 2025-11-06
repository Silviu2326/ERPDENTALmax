import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export interface CommunicationStep {
  step: number;
  channel: 'email' | 'sms' | 'whatsapp';
  templateId?: string;
  delayDays: number;
}

interface CommunicationStepBuilderProps {
  steps: CommunicationStep[];
  onChange: (steps: CommunicationStep[]) => void;
}

export default function CommunicationStepBuilder({ steps, onChange }: CommunicationStepBuilderProps) {
  const addStep = () => {
    const newStep: CommunicationStep = {
      step: steps.length + 1,
      channel: 'email',
      delayDays: 0,
    };
    onChange([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index).map((step, idx) => ({
      ...step,
      step: idx + 1,
    }));
    onChange(newSteps);
  };

  const updateStep = (index: number, updates: Partial<CommunicationStep>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    onChange(newSteps);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Secuencia de Comunicación
        </label>
        <button
          type="button"
          onClick={addStep}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar Paso
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm">No hay pasos configurados</p>
          <p className="text-gray-400 text-xs mt-1">Agrega al menos un paso de comunicación</p>
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 pt-2">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Paso {step.step}
                    </label>
                    <input
                      type="number"
                      value={step.step}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Canal
                    </label>
                    <select
                      value={step.channel}
                      onChange={(e) =>
                        updateStep(index, {
                          channel: e.target.value as 'email' | 'sms' | 'whatsapp',
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Días de Retraso
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={step.delayDays}
                      onChange={(e) =>
                        updateStep(index, { delayDays: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex-shrink-0 pt-6">
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition-colors"
                      title="Eliminar paso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {step.channel === 'email' && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    ID de Plantilla (Opcional)
                  </label>
                  <input
                    type="text"
                    value={step.templateId || ''}
                    onChange={(e) => updateStep(index, { templateId: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="ID de plantilla de email"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


