import { Calendar, Eye } from 'lucide-react';
import { AtmEvaluacion } from '../api/atmApi';

interface TablaSeguimientoATMProps {
  evaluaciones: AtmEvaluacion[];
  onVerDetalle: (evaluacion: AtmEvaluacion) => void;
}

export default function TablaSeguimientoATM({ evaluaciones, onVerDetalle }: TablaSeguimientoATMProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Historial de Evaluaciones</h2>
        <span className="text-sm text-gray-600">{evaluaciones.length} evaluación(es)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Índice Fonseca</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Diagnósticos</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Apertura Máx. (mm)</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {evaluaciones.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No hay evaluaciones registradas
                </td>
              </tr>
            ) : (
              evaluaciones.map((evaluacion) => (
                <tr
                  key={evaluacion._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {new Date(evaluacion.fechaEvaluacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {evaluacion.anamnesis?.indiceFonseca !== undefined ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          {evaluacion.anamnesis.indiceFonseca.toFixed(1)}%
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            evaluacion.anamnesis.indiceFonseca < 15
                              ? 'bg-green-500'
                              : evaluacion.anamnesis.indiceFonseca < 35
                              ? 'bg-yellow-500'
                              : evaluacion.anamnesis.indiceFonseca < 50
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {evaluacion.diagnostico && evaluacion.diagnostico.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {evaluacion.diagnostico.slice(0, 2).map((diag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {diag.codigo}
                          </span>
                        ))}
                        {evaluacion.diagnostico.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{evaluacion.diagnostico.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {evaluacion.examenClinico?.rangosMovimiento?.aperturaMaxima ? (
                      <span className="text-sm text-gray-700">
                        {evaluacion.examenClinico.rangosMovimiento.aperturaMaxima} mm
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onVerDetalle(evaluacion)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalle
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


