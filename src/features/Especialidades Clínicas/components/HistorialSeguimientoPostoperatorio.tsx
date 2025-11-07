import { Calendar, User, FileText, Image as ImageIcon, Clock } from 'lucide-react';
import { Postoperatorio, SeguimientoPostoperatorio } from '../api/postoperatorioApi';

interface HistorialSeguimientoPostoperatorioProps {
  postoperatorio: Postoperatorio;
  onNuevoSeguimiento: () => void;
}

export default function HistorialSeguimientoPostoperatorio({
  postoperatorio,
  onNuevoSeguimiento,
}: HistorialSeguimientoPostoperatorioProps) {
  const seguimientos = postoperatorio.seguimientos || [];

  // Ordenar seguimientos por fecha (más reciente primero)
  const seguimientosOrdenados = [...seguimientos].sort((a, b) => {
    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();
    return fechaB - fechaA;
  });

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Seguimiento</h3>
        <button
          onClick={onNuevoSeguimiento}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Calendar size={20} />
          Nuevo Seguimiento
        </button>
      </div>

      {seguimientosOrdenados.length === 0 ? (
        <div className="bg-white shadow-sm rounded-xl p-8 text-center">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay seguimientos registrados</h3>
          <p className="text-gray-600 mb-4">Comience registrando el primer seguimiento postoperatorio</p>
          <button
            onClick={onNuevoSeguimiento}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Nuevo Seguimiento
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {seguimientosOrdenados.map((seguimiento, index) => {
            const fecha = new Date(seguimiento.fecha);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            const horaFormateada = fecha.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={seguimiento._id || index}
                className="border-l-4 border-blue-500 pl-4 py-4 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-all"
              >
                {/* Header del seguimiento */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{fechaFormateada}</h4>
                      <p className="text-sm text-gray-500">{horaFormateada}</p>
                    </div>
                  </div>
                </div>

                {/* Profesional */}
                {seguimiento.profesional && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <User size={16} />
                    <span>
                      {seguimiento.profesional.nombre} {seguimiento.profesional.apellidos || ''}
                    </span>
                  </div>
                )}

                {/* Notas de evolución */}
                {seguimiento.notasEvolucion && (
                  <div className="mb-3">
                    <div className="flex items-start gap-2 mb-2">
                      <FileText size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">Notas de Evolución</p>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{seguimiento.notasEvolucion}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Adjuntos */}
                {seguimiento.adjuntos && seguimiento.adjuntos.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-start gap-2">
                      <ImageIcon size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-2">Archivos Adjuntos</p>
                        <div className="flex flex-wrap gap-2">
                          {seguimiento.adjuntos.map((adjunto, adjIndex) => (
                            <a
                              key={adjIndex}
                              href={adjunto}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-sm"
                            >
                              <ImageIcon size={12} />
                              Ver archivo {adjIndex + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



