import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export interface EstadoSubida {
  id: string;
  nombreArchivo: string;
  progreso: number;
  estado: 'pendiente' | 'subiendo' | 'completado' | 'error';
  error?: string;
}

interface UploadProgressBarProps {
  estados: EstadoSubida[];
  progresoTotal?: number;
}

export default function UploadProgressBar({ estados, progresoTotal }: UploadProgressBarProps) {
  const estadosCompletados = estados.filter((e) => e.estado === 'completado').length;
  const estadosConError = estados.filter((e) => e.estado === 'error').length;
  const estadosSubiendo = estados.filter((e) => e.estado === 'subiendo').length;

  const progresoCalculado = progresoTotal !== undefined 
    ? progresoTotal 
    : estados.length > 0 
      ? (estadosCompletados / estados.length) * 100 
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Progreso de Subida</h3>
          <span className="text-sm font-medium text-gray-600">
            {estadosCompletados} de {estados.length} completadas
          </span>
        </div>
        
        {/* Barra de progreso general */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              estadosConError > 0
                ? 'bg-yellow-500'
                : progresoCalculado === 100
                ? 'bg-green-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${progresoCalculado}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {progresoCalculado.toFixed(0)}% completado
        </p>
      </div>

      {/* Lista de estados individuales */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {estados.map((estado) => (
          <div
            key={estado.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex-shrink-0">
              {estado.estado === 'completado' && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              {estado.estado === 'error' && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              {(estado.estado === 'pendiente' || estado.estado === 'subiendo') && (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {estado.nombreArchivo}
              </p>
              {estado.estado === 'subiendo' && (
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${estado.progreso}%` }}
                  />
                </div>
              )}
              {estado.estado === 'error' && estado.error && (
                <p className="text-xs text-red-600 mt-1">{estado.error}</p>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <span className="text-xs font-medium text-gray-500 capitalize">
                {estado.estado === 'subiendo' && `${estado.progreso}%`}
                {estado.estado === 'pendiente' && 'Pendiente'}
                {estado.estado === 'completado' && 'Completado'}
                {estado.estado === 'error' && 'Error'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      {estados.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {estadosCompletados > 0 && (
              <span className="text-green-600 font-medium">
                ✓ {estadosCompletados} completadas
              </span>
            )}
            {estadosConError > 0 && (
              <span className="text-red-600 font-medium">
                ✗ {estadosConError} con error
              </span>
            )}
            {estadosSubiendo > 0 && (
              <span className="text-blue-600 font-medium">
                ⏳ {estadosSubiendo} subiendo
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


