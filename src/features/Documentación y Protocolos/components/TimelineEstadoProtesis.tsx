import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { HistorialEstado, EstadoProtesis } from '../api/protesisApi';

interface TimelineEstadoProtesisProps {
  historial: HistorialEstado[];
  estadoActual: EstadoProtesis;
}

const estadosOrden: EstadoProtesis[] = [
  'Prescrita',
  'Enviada a Laboratorio',
  'Recibida de Laboratorio',
  'Prueba en Paciente',
  'Ajustes en Laboratorio',
  'Instalada',
  'Cancelada',
];

function getEstadoIcon(estado: EstadoProtesis) {
  switch (estado) {
    case 'Instalada':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'Cancelada':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'Prescrita':
      return <AlertCircle className="w-5 h-5 text-blue-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
}

function getEstadoColor(estado: EstadoProtesis, esActual: boolean) {
  if (esActual) {
    switch (estado) {
      case 'Instalada':
        return 'bg-green-500';
      case 'Cancelada':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  }
  return 'bg-gray-300';
}

export default function TimelineEstadoProtesis({
  historial,
  estadoActual,
}: TimelineEstadoProtesisProps) {
  const historialOrdenado = [...historial].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Estados</h3>
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-4">
          {historialOrdenado.map((item, index) => {
            const esActual = item.estado === estadoActual;
            const esUltimo = index === historialOrdenado.length - 1;

            return (
              <div key={item._id || index} className="relative flex items-start space-x-4">
                {/* Icono */}
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${getEstadoColor(
                    item.estado,
                    esActual
                  )} text-white`}
                >
                  {getEstadoIcon(item.estado)}
                </div>

                {/* Contenido */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={`font-semibold ${
                        esActual ? 'text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {item.estado}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(item.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Por: {item.usuario.nombre}
                  </p>
                  {item.nota && (
                    <p className="text-sm text-gray-500 italic mt-1">{item.nota}</p>
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


