import { ResultadosEncuesta } from '../api/encuestasApi';
import { BarChart3, TrendingUp, MessageSquare, Star } from 'lucide-react';

interface DashboardResultadosEncuestaProps {
  resultados: ResultadosEncuesta;
}

export default function DashboardResultadosEncuesta({
  resultados,
}: DashboardResultadosEncuestaProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{resultados.titulo}</h2>
        <div className="flex items-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">{resultados.totalRespuestas}</span> respuestas
            </span>
          </div>
          {resultados.promedioGeneral && (
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600">
                Promedio: <span className="font-semibold text-gray-900">{resultados.promedioGeneral.toFixed(1)}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas por pregunta */}
      <div className="grid grid-cols-1 gap-6">
        {resultados.estadisticas.map((estadistica, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {estadistica.preguntaTexto}
            </h3>

            {estadistica.tipo === 'estrellas' && estadistica.promedio !== undefined && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900">
                      {estadistica.promedio.toFixed(1)}
                    </span>
                    <span className="text-gray-600">/ 5.0</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{ width: `${(estadistica.promedio / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {estadistica.tipo === 'multiple' && estadistica.distribucion && (
              <div className="space-y-3">
                {Object.entries(estadistica.distribucion).map(([opcion, count]) => {
                  const porcentaje = (count / resultados.totalRespuestas) * 100;
                  return (
                    <div key={opcion} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{opcion}</span>
                        <span className="text-gray-600 font-medium">
                          {count} ({porcentaje.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {estadistica.tipo === 'abierta' && estadistica.respuestasAbiertas && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {estadistica.respuestasAbiertas.length > 0 ? (
                  estadistica.respuestasAbiertas.map((respuesta, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 text-sm">{respuesta}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No hay respuestas abiertas para esta pregunta
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



