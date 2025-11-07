import { Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { HistorialCapa } from '../api/capasApi';

interface HistorialCapaTimelineProps {
  historial: HistorialCapa[];
}

export default function HistorialCapaTimeline({
  historial,
}: HistorialCapaTimelineProps) {
  if (!historial || historial.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center py-8">
          <Clock size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay historial disponible</p>
        </div>
      </div>
    );
  }

  // Ordenar por fecha descendente (más reciente primero)
  const historialOrdenado = [...historial].sort(
    (a, b) =>
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const getIconoPorAccion = (accion: string) => {
    const accionLower = accion.toLowerCase();
    if (accionLower.includes('creado') || accionLower.includes('creada')) {
      return <CheckCircle size={20} className="text-green-600" />;
    }
    if (accionLower.includes('cerrado') || accionLower.includes('cerrada')) {
      return <CheckCircle size={20} className="text-blue-600" />;
    }
    if (accionLower.includes('actualizado') || accionLower.includes('modificado')) {
      return <AlertCircle size={20} className="text-yellow-600" />;
    }
    return <Clock size={20} className="text-gray-600" />;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-xl ring-1 ring-blue-200/70">
          <Clock size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Historial de Cambios
          </h3>
          <p className="text-sm text-gray-500">
            Registro completo de todas las modificaciones realizadas
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {historialOrdenado.map((item, index) => (
            <div key={item._id || index} className="relative flex gap-4">
              {/* Icono */}
              <div className="relative z-10 flex-shrink-0">
                <div className="bg-white p-2 rounded-full border-2 border-gray-200">
                  {getIconoPorAccion(item.accion)}
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 pb-6">
                <div className="bg-slate-50 rounded-xl ring-1 ring-slate-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {item.accion}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <User size={12} />
                        <span>
                          {item.usuario.nombre} {item.usuario.apellidos || ''}
                        </span>
                        <span className="mx-1">•</span>
                        <span>
                          {new Date(item.fecha).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.comentario && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-sm text-gray-700">{item.comentario}</p>
                    </div>
                  )}

                  {item.cambios && Object.keys(item.cambios).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs font-medium text-slate-600 mb-2">
                        Cambios realizados:
                      </p>
                      <ul className="space-y-1">
                        {Object.entries(item.cambios).map(([campo, valor]) => (
                          <li key={campo} className="text-xs text-gray-600">
                            <span className="font-medium">{campo}:</span>{' '}
                            {String(valor)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



