import { useState } from 'react';
import { Baby, Calendar, Scale, Milk, Pill, AlertTriangle } from 'lucide-react';
import { AnamnesisPediatrica } from '../api/fichasPediatricasAPI';

interface FormularioAnamnesisPediatricaProps {
  anamnesis: AnamnesisPediatrica;
  onChange: (anamnesis: AnamnesisPediatrica) => void;
  readonly?: boolean;
}

export default function FormularioAnamnesisPediatrica({
  anamnesis,
  onChange,
  readonly = false,
}: FormularioAnamnesisPediatricaProps) {
  const [localAnamnesis, setLocalAnamnesis] = useState<AnamnesisPediatrica>(anamnesis);

  const handleChange = (field: keyof AnamnesisPediatrica, value: any) => {
    const updated = { ...localAnamnesis, [field]: value };
    setLocalAnamnesis(updated);
    onChange(updated);
  };

  const handleArrayChange = (field: 'enfermedadesInfantiles' | 'alergias' | 'medicamentosActuales', value: string[]) => {
    const updated = { ...localAnamnesis, [field]: value };
    setLocalAnamnesis(updated);
    onChange(updated);
  };

  const addArrayItem = (field: 'enfermedadesInfantiles' | 'alergias' | 'medicamentosActuales', item: string) => {
    if (!item.trim()) return;
    const current = localAnamnesis[field] || [];
    handleArrayChange(field, [...current, item.trim()]);
  };

  const removeArrayItem = (field: 'enfermedadesInfantiles' | 'alergias' | 'medicamentosActuales', index: number) => {
    const current = localAnamnesis[field] || [];
    handleArrayChange(field, current.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Sección: Historia de Nacimiento */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Baby className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Historia de Nacimiento</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Parto
            </label>
            <select
              value={localAnamnesis.tipoParto || ''}
              onChange={(e) => handleChange('tipoParto', e.target.value || undefined)}
              disabled={readonly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Seleccionar...</option>
              <option value="normal">Normal</option>
              <option value="cesarea">Cesárea</option>
              <option value="instrumental">Instrumental</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semanas de Gestación
            </label>
            <input
              type="number"
              min="20"
              max="42"
              value={localAnamnesis.semanasGestacion || ''}
              onChange={(e) => handleChange('semanasGestacion', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={readonly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Ej: 38"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Peso al Nacer (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={localAnamnesis.pesoNacimiento || ''}
              onChange={(e) => handleChange('pesoNacimiento', e.target.value ? parseFloat(e.target.value) : undefined)}
              disabled={readonly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Ej: 3.2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Historia de Nacimiento
            </label>
            <textarea
              value={localAnamnesis.historiaNacimiento || ''}
              onChange={(e) => handleChange('historiaNacimiento', e.target.value)}
              disabled={readonly}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Complicaciones durante el parto, reanimación, etc."
            />
          </div>
        </div>
      </div>

      {/* Sección: Alimentación */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Milk className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Alimentación</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Lactancia
            </label>
            <select
              value={localAnamnesis.tipoLactancia || ''}
              onChange={(e) => handleChange('tipoLactancia', e.target.value || undefined)}
              disabled={readonly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Seleccionar...</option>
              <option value="materna">Lactancia Materna</option>
              <option value="artificial">Lactancia Artificial</option>
              <option value="mixta">Mixta</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Tiempo de Lactancia (meses)
            </label>
            <input
              type="number"
              min="0"
              max="36"
              value={localAnamnesis.tiempoLactancia || ''}
              onChange={(e) => handleChange('tiempoLactancia', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={readonly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Ej: 6"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alimentación Actual
            </label>
            <textarea
              value={localAnamnesis.alimentacion || ''}
              onChange={(e) => handleChange('alimentacion', e.target.value)}
              disabled={readonly}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Descripción de la alimentación actual, hábitos alimentarios, etc."
            />
          </div>
        </div>
      </div>

      {/* Sección: Historial Médico */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-800">Historial Médico</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Historial Médico General
            </label>
            <textarea
              value={localAnamnesis.historialMedico || ''}
              onChange={(e) => handleChange('historialMedico', e.target.value)}
              disabled={readonly}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Enfermedades, cirugías, hospitalizaciones, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enfermedades Infantiles
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addArrayItem('enfermedadesInfantiles', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                disabled={readonly}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Escriba y presione Enter para agregar"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(localAnamnesis.enfermedadesInfantiles || []).map((enfermedad, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {enfermedad}
                  {!readonly && (
                    <button
                      onClick={() => removeArrayItem('enfermedadesInfantiles', index)}
                      className="ml-1 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alergias
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addArrayItem('alergias', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                disabled={readonly}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Escriba y presione Enter para agregar"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(localAnamnesis.alergias || []).map((alergia, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {alergia}
                  {!readonly && (
                    <button
                      onClick={() => removeArrayItem('alergias', index)}
                      className="ml-1 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medicamentos Actuales
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addArrayItem('medicamentosActuales', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                disabled={readonly}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Escriba y presione Enter para agregar"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(localAnamnesis.medicamentosActuales || []).map((medicamento, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {medicamento}
                  {!readonly && (
                    <button
                      onClick={() => removeArrayItem('medicamentosActuales', index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones Adicionales
            </label>
            <textarea
              value={localAnamnesis.observaciones || ''}
              onChange={(e) => handleChange('observaciones', e.target.value)}
              disabled={readonly}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Observaciones adicionales sobre la anamnesis..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}


