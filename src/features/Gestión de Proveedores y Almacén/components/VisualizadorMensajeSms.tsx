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
    <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Vista Previa del Mensaje</h3>
      </div>

      {/* Simulación de mensaje SMS */}
      <div className="bg-gray-50 rounded-xl p-4 mb-3 ring-1 ring-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600 font-medium">Mensaje SMS</span>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm ring-1 ring-gray-200">
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
        <div className="mt-3 p-2 bg-yellow-50 ring-1 ring-yellow-200 rounded-xl text-xs text-yellow-800">
          ⚠️ El mensaje se dividirá en múltiples SMS. Esto puede aumentar el costo.
        </div>
      )}
    </div>
  );
}



