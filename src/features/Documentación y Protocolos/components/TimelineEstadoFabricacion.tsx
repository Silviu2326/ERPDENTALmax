import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { HistorialEstadoFabricacion, EstadoFabricacion } from '../api/fabricacionApi';

interface TimelineEstadoFabricacionProps {
  historial: HistorialEstadoFabricacion[];
  estadoActual: EstadoFabricacion;
}

export default function TimelineEstadoFabricacion({
  historial,
  estadoActual,
}: TimelineEstadoFabricacionProps) {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (historial.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <p className="text-gray-500 text-center">No hay historial de estados disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Historial de Estados</h3>
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Items del timeline */}
        <div className="space-y-6">
          {historial.map((item, index) => {
            const isActual = item.estado === estadoActual;
            const isCancelado = item.estado === 'Cancelada';
            const isCompletado = item.estado === 'Recibido en Clínica';

            return (
              <div key={item._id || index} className="relative flex items-start">
                {/* Icono */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCancelado
                      ? 'bg-red-100 border-red-400'
                      : isCompletado
                      ? 'bg-green-100 border-green-400'
                      : isActual
                      ? 'bg-blue-100 border-blue-400'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  {isCancelado ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : isCompletado ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-600" />
                  )}
                </div>

                {/* Contenido */}
                <div className="ml-4 flex-1 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isActual ? 'text-blue-600' : 'text-gray-900'
                        }`}
                      >
                        {item.estado}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatearFecha(item.fecha)}
                      </p>
                      {item.usuarioId && (
                        <p className="text-xs text-gray-500">
                          Por: {item.usuarioId.nombre}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.notas && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700">{item.notas}</p>
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


