import { Star } from 'lucide-react';
import { useState } from 'react';

interface PreguntaTipoEstrellasProps {
  preguntaId: string;
  preguntaTexto: string;
  valor?: number;
  onChange: (valor: number) => void;
  requerida?: boolean;
}

export default function PreguntaTipoEstrellas({
  preguntaId,
  preguntaTexto,
  valor = 0,
  onChange,
  requerida = false,
}: PreguntaTipoEstrellasProps) {
  const [hovered, setHovered] = useState<number>(0);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {preguntaTexto}
        {requerida && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hovered || valor)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        {valor > 0 && (
          <span className="ml-3 text-sm text-gray-600 font-medium">
            {valor} de 5
          </span>
        )}
      </div>
    </div>
  );
}



