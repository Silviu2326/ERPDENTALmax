import { Search, AlertCircle } from 'lucide-react';
import { AnalisisCausaRaizInput } from './AnalisisCausaRaizInput';

interface SeccionAnalisisCausaRaizProps {
  analisisCausaRaiz?: string;
  onAnalisisChange: (analisis: string) => void;
  readonly?: boolean;
}

export default function SeccionAnalisisCausaRaiz({
  analisisCausaRaiz,
  onAnalisisChange,
  readonly = false,
}: SeccionAnalisisCausaRaizProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Search className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Análisis de Causa Raíz
          </h3>
          <p className="text-sm text-gray-500">
            Investiga y documenta la causa raíz del problema
          </p>
        </div>
      </div>

      {!analisisCausaRaiz && !readonly && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">
                Análisis pendiente
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                El análisis de causa raíz debe completarse antes de definir las
                acciones correctivas y preventivas.
              </p>
            </div>
          </div>
        </div>
      )}

      <AnalisisCausaRaizInput
        valor={analisisCausaRaiz || ''}
        onGuardar={onAnalisisChange}
        readonly={readonly}
      />
    </div>
  );
}

