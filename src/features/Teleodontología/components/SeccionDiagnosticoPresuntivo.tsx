import { useState } from 'react';
import { Stethoscope } from 'lucide-react';

interface SeccionDiagnosticoPresuntivoProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function SeccionDiagnosticoPresuntivo({
  value,
  onChange,
  error,
}: SeccionDiagnosticoPresuntivoProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-6">
      <label className="flex items-center space-x-2 mb-3">
        <Stethoscope className="w-5 h-5 text-blue-600" />
        <span className="text-lg font-semibold text-gray-900">Diagnóstico Presuntivo</span>
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe el diagnóstico presuntivo basado en los hallazgos de la teleconsulta..."
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            error
              ? 'border-red-300 bg-red-50'
              : isFocused
              ? 'border-blue-400 bg-white'
              : 'border-gray-300 bg-gray-50'
          }`}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Puede usar formato de texto enriquecido. Este diagnóstico se integrará en la historia clínica del paciente.
      </p>
    </div>
  );
}



