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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay acciones correctivas</h3>
        <p className="text-gray-600">No se han registrado acciones correctivas para este parte de avería</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
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
                <div className="absolute left-0 top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm ring-1 ring-blue-200"></div>

                <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={16} className="opacity-70" />
                      <span>{fecha}</span>
                      {hora && <span className="text-slate-400">• {hora}</span>}
                    </div>
                    {correctivo.realizadoPor && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User size={16} className="opacity-70" />
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
                    <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-3 border-t border-slate-200">
                      {correctivo.costeMateriales !== undefined && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={12} className="opacity-70" />
                          <span>
                            Materiales: <span className="font-medium text-gray-900">€{correctivo.costeMateriales.toFixed(2)}</span>
                          </span>
                        </div>
                      )}
                      {correctivo.horasTrabajo !== undefined && (
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="opacity-70" />
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



