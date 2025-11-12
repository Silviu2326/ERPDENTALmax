import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface DaysRangeSelectorProps {
  valorInicial?: number;
  onChange: (dias: number) => void;
}

const OPCIONES_DIAS = [1, 3, 5, 7] as const;
const STORAGE_KEY = 'agenda_visible_days';

/**
 * Componente DaysRangeSelector
 * 
 * Selector de número de días visibles (1, 3, 5 o 7) para adaptar
 * la pantalla de la agenda. Persiste la preferencia en localStorage.
 * 
 * @param valorInicial - Valor inicial de días visibles (opcional)
 * @param onChange - Callback que se ejecuta cuando cambia el número de días
 */
export default function DaysRangeSelector({
  valorInicial,
  onChange,
}: DaysRangeSelectorProps) {
  // Cargar preferencia desde localStorage o usar valor inicial
  const [diasVisibles, setDiasVisibles] = useState<number>(() => {
    if (valorInicial) {
      return valorInicial;
    }
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (OPCIONES_DIAS.includes(parsed as any)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Error al cargar preferencia de días visibles:', error);
    }
    
    // Valor por defecto: 7 días (semana completa)
    return 7;
  });

  // Persistir en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, diasVisibles.toString());
    } catch (error) {
      console.warn('Error al guardar preferencia de días visibles:', error);
    }
  }, [diasVisibles]);

  // Notificar al componente padre cuando cambie
  useEffect(() => {
    onChange(diasVisibles);
  }, [diasVisibles, onChange]);

  const handleChange = (dias: number) => {
    setDiasVisibles(dias);
  };

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
      <Calendar className="w-4 h-4 text-gray-500" />
      <span className="text-sm font-medium text-gray-700">Días visibles:</span>
      <div className="flex items-center space-x-1">
        {OPCIONES_DIAS.map((dias) => (
          <button
            key={dias}
            onClick={() => handleChange(dias)}
            className={`
              px-3 py-1 text-sm font-medium rounded-lg transition-all
              ${
                diasVisibles === dias
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            title={`Mostrar ${dias} ${dias === 1 ? 'día' : 'días'}`}
          >
            {dias}
          </button>
        ))}
      </div>
    </div>
  );
}

