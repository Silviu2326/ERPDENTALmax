import { MessageSquare } from 'lucide-react';

interface VisualizadorMensajeSmsProps {
  mensaje: string;
  maxCaracteres?: number;
}

export default function VisualizadorMensajeSms({
  mensaje,
  maxCaracteres = 160,
}: VisualizadorMensajeSmsProps) {
  const caracteresUsados = mensaje.length;
  const partesNecesarias = Math.ceil(caracteresUsados / maxCaracteres);
  const colorCaracteres =
    caracteresUsados > maxCaracteres * 3
      ? 'text-red-600'
      : caracteresUsados > maxCaracteres * 2
      ? 'text-orange-600'
      : caracteresUsados > maxCaracteres
      ? 'text-yellow-600'
      : 'text-gray-600';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Vista Previa del Mensaje</h3>
      </div>

      {/* Simulación de mensaje SMS */}
      <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600 font-medium">Mensaje SMS</span>
        </div>
        <div className="bg-white rounded p-3 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{mensaje || 'Tu mensaje aparecerá aquí...'}</p>
        </div>
      </div>

      {/* Información de caracteres */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className={colorCaracteres}>
            {caracteresUsados} caracteres
          </span>
          {partesNecesarias > 1 && (
            <span className="text-gray-500">
              ({partesNecesarias} partes)
            </span>
          )}
        </div>
        <span className="text-gray-500">
          Límite: {maxCaracteres} caracteres por parte
        </span>
      </div>

      {/* Advertencia si excede recomendación */}
      {caracteresUsados > maxCaracteres && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          ⚠️ El mensaje se dividirá en múltiples SMS. Esto puede aumentar el costo.
        </div>
      )}
    </div>
  );
}


