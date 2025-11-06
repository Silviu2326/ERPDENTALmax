import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ResultadoReprogramacion } from '../api/citasApi';

interface ResumenCambiosReprogramacionProps {
  resultado: ResultadoReprogramacion;
}

export default function ResumenCambiosReprogramacion({
  resultado,
}: ResumenCambiosReprogramacionProps) {
  const porcentajeExito = resultado.actualizadas + resultado.errores > 0
    ? Math.round((resultado.actualizadas / (resultado.actualizadas + resultado.errores)) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de la Reprogramación</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-900">Actualizadas</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{resultado.actualizadas}</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-900">Errores</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{resultado.errores}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Tasa de Éxito</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{porcentajeExito}%</p>
        </div>
      </div>

      {resultado.errores > 0 && resultado.detallesErrores.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-3">Detalles de Errores</h4>
          <div className="space-y-2">
            {resultado.detallesErrores.map((error, index) => (
              <div key={index} className="bg-white rounded p-3 border border-yellow-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cita ID: {error.citaId}</p>
                    <p className="text-sm text-gray-600 mt-1">{error.motivo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resultado.success && resultado.errores === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">
              Todas las citas se reprogramaron exitosamente. Los cambios han sido registrados en el historial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


