import { Clock, User, DollarSign, Wrench } from 'lucide-react';
import { AccionCorrectiva } from '../api/partesAveriaApi';

interface TimelineHistorialCorrectivosProps {
  correctivos: AccionCorrectiva[];
}

export default function TimelineHistorialCorrectivos({
  correctivos,
}: TimelineHistorialCorrectivosProps) {
  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      return {
        fecha: date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        hora: date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    } catch {
      return { fecha: fecha, hora: '' };
    }
  };

  if (correctivos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-8">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm">No hay acciones correctivas registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Historial de Acciones Correctivas
      </h3>
      <div className="relative">
        {/* Línea vertical del timeline */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {correctivos.map((correctivo, index) => {
            const { fecha, hora } = formatearFecha(correctivo.fecha);
            return (
              <div key={correctivo._id || index} className="relative pl-12">
                {/* Punto del timeline */}
                <div className="absolute left-0 top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm"></div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{fecha}</span>
                      {hora && <span className="text-gray-400">• {hora}</span>}
                    </div>
                    {correctivo.realizadoPor && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{correctivo.realizadoPor}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-900 whitespace-pre-line">
                      {correctivo.descripcionAccion}
                    </p>
                  </div>

                  {(correctivo.costeMateriales || correctivo.horasTrabajo) && (
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 pt-3 border-t border-gray-200">
                      {correctivo.costeMateriales !== undefined && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>
                            Materiales: <span className="font-medium text-gray-900">€{correctivo.costeMateriales.toFixed(2)}</span>
                          </span>
                        </div>
                      )}
                      {correctivo.horasTrabajo !== undefined && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            Horas: <span className="font-medium text-gray-900">{correctivo.horasTrabajo}h</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


