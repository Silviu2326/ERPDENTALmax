import { useState } from 'react';
import { AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import { RiesgoCaries } from '../api/fichasPediatricasAPI';

interface EvaluacionRiesgoCariesProps {
  riesgoCaries?: RiesgoCaries;
  onChange: (riesgo: RiesgoCaries) => void;
  readonly?: boolean;
}

const FACTORES_RIESGO = [
  'Alto consumo de azúcares',
  'Higiene bucal deficiente',
  'Antecedentes familiares de caries',
  'Uso frecuente de biberón/chupete con azúcar',
  'Boca seca',
  'Defectos del esmalte',
  'Hábitos de succión prolongados',
  'Baja exposición a flúor',
];

export default function EvaluacionRiesgoCaries({
  riesgoCaries,
  onChange,
  readonly = false,
}: EvaluacionRiesgoCariesProps) {
  const [localRiesgo, setLocalRiesgo] = useState<RiesgoCaries>(
    riesgoCaries || {
      nivel: 'medio',
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      factoresRiesgo: [],
      observaciones: '',
    }
  );

  const handleChange = (field: keyof RiesgoCaries, value: any) => {
    const updated = { ...localRiesgo, [field]: value };
    setLocalRiesgo(updated);
    onChange(updated);
  };

  const toggleFactor = (factor: string) => {
    if (readonly) return;
    const current = localRiesgo.factoresRiesgo || [];
    const updated = current.includes(factor)
      ? current.filter((f) => f !== factor)
      : [...current, factor];
    handleChange('factoresRiesgo', updated);
  };

  const getNivelColor = (nivel: RiesgoCaries['nivel']) => {
    switch (nivel) {
      case 'bajo':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'alto':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'muy_alto':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getNivelLabel = (nivel: RiesgoCaries['nivel']) => {
    switch (nivel) {
      case 'bajo':
        return 'Bajo';
      case 'medio':
        return 'Medio';
      case 'alto':
        return 'Alto';
      case 'muy_alto':
        return 'Muy Alto';
      default:
        return nivel;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle size={20} className="text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Evaluación de Riesgo de Caries</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nivel de Riesgo
            </label>
            <select
              value={localRiesgo.nivel}
              onChange={(e) => handleChange('nivel', e.target.value as RiesgoCaries['nivel'])}
              disabled={readonly}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100"
            >
              <option value="bajo">Bajo</option>
              <option value="medio">Medio</option>
              <option value="alto">Alto</option>
              <option value="muy_alto">Muy Alto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Fecha de Evaluación
            </label>
            <input
              type="date"
              value={localRiesgo.fechaEvaluacion}
              onChange={(e) => handleChange('fechaEvaluacion', e.target.value)}
              disabled={readonly}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ring-1 ${getNivelColor(localRiesgo.nivel)}`}>
            <CheckCircle size={16} />
            <span className="font-semibold">Riesgo: {getNivelLabel(localRiesgo.nivel)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Factores de Riesgo Identificados
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {FACTORES_RIESGO.map((factor) => {
              const isSelected = (localRiesgo.factoresRiesgo || []).includes(factor);
              return (
                <button
                  key={factor}
                  type="button"
                  onClick={() => toggleFactor(factor)}
                  disabled={readonly}
                  className={`text-left px-3 py-2 rounded-xl ring-1 transition-all ${
                    isSelected
                      ? 'bg-blue-50 ring-blue-400 text-blue-900'
                      : 'bg-slate-50 ring-slate-200 text-slate-700 hover:ring-slate-300'
                  } ${readonly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded ring-1 flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 ring-blue-600'
                          : 'ring-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <span className="text-sm">{factor}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Observaciones
          </label>
          <textarea
            value={localRiesgo.observaciones || ''}
            onChange={(e) => handleChange('observaciones', e.target.value)}
            disabled={readonly}
            rows={3}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100"
            placeholder="Observaciones adicionales sobre el riesgo de caries..."
          />
        </div>
      </div>
    </div>
  );
}



