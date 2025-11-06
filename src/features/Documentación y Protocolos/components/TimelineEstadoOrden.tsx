import { Clock, CheckCircle } from 'lucide-react';
import { HistorialEstado } from '../api/ordenesLaboratorioApi';

interface TimelineEstadoOrdenProps {
  historial: HistorialEstado[];
}

export default function TimelineEstadoOrden({ historial }: TimelineEstadoOrdenProps) {
  if (!historial || historial.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay historial de estados disponible</p>
      </div>
    );
  }

  // Ordenar por fecha descendente (más reciente primero)
  const historialOrdenado = [...historial].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Estados</h3>
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {historialOrdenado.map((item, index) => (
          <div key={item._id || index} className="relative flex items-start space-x-4 pb-6">
            {/* Círculo indicador */}
            <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>

            {/* Contenido */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">{item.estado}</span>
                  <span className="text-sm text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {new Date(item.fecha).toLocaleString('es-ES', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              {item.usuario && (
                <div className="text-sm text-gray-600 mb-2">
                  Por: {item.usuario.nombre} {item.usuario.apellidos}
                </div>
              )}

              {item.notas && (
                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-700">{item.notas}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


