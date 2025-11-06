import { useState } from 'react';
import { ClipboardList } from 'lucide-react';

interface SeccionPlanRecomendadoProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function SeccionPlanRecomendado({
  value,
  onChange,
  error,
}: SeccionPlanRecomendadoProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-6">
      <label className="flex items-center space-x-2 mb-3">
        <ClipboardList className="w-5 h-5 text-blue-600" />
        <span className="text-lg font-semibold text-gray-900">Plan de Tratamiento Recomendado</span>
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe el plan de tratamiento recomendado, incluyendo pasos a seguir, próximas citas necesarias, etc..."
          rows={8}
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
        Detalle el plan de tratamiento que recomienda seguir el paciente tras esta teleconsulta.
      </p>
    </div>
  );
}


