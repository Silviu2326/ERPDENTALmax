import { CheckCircle } from 'lucide-react';

interface PreguntaTipoMultipleChoiceProps {
  preguntaId: string;
  preguntaTexto: string;
  opciones: string[];
  valor?: string;
  onChange: (valor: string) => void;
  requerida?: boolean;
}

export default function PreguntaTipoMultipleChoice({
  preguntaId,
  preguntaTexto,
  opciones,
  valor = '',
  onChange,
  requerida = false,
}: PreguntaTipoMultipleChoiceProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {preguntaTexto}
        {requerida && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {opciones.map((opcion, index) => (
          <label
            key={index}
            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
              valor === opcion
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name={preguntaId}
              value={opcion}
              checked={valor === opcion}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
              required={requerida}
            />
            <div className="flex items-center flex-1">
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  valor === opcion
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {valor === opcion && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="text-gray-700">{opcion}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}


