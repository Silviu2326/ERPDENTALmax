import { X, Calendar, User } from 'lucide-react';
import { Hallazgo } from '../../api/odontogramaApi';

interface ModalHistorialDienteProps {
  isOpen: boolean;
  onClose: () => void;
  dienteId: number;
  dienteNombre: string;
  hallazgos: Hallazgo[];
}

const ESTADOS_LABEL: Record<string, string> = {
  diagnostico: 'Diagnóstico',
  planificado: 'Planificado',
  realizado: 'Realizado',
  en_progreso: 'En Progreso',
  descartado: 'Descartado',
  ausente: 'Ausente',
};

const ESTADOS_COLOR: Record<string, string> = {
  diagnostico: 'bg-yellow-100 text-yellow-800',
  planificado: 'bg-blue-100 text-blue-800',
  realizado: 'bg-green-100 text-green-800',
  en_progreso: 'bg-orange-100 text-orange-800',
  descartado: 'bg-red-100 text-red-800',
  ausente: 'bg-gray-100 text-gray-800',
};

export default function ModalHistorialDiente({
  isOpen,
  onClose,
  dienteId,
  dienteNombre,
  hallazgos,
}: ModalHistorialDienteProps) {
  if (!isOpen) return null;

  const hallazgosOrdenados = [...hallazgos].sort((a, b) => {
    const fechaA = new Date(a.fechaRegistro).getTime();
    const fechaB = new Date(b.fechaRegistro).getTime();
    return fechaB - fechaA; // Más reciente primero
  });

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Historial - Diente {dienteId}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{dienteNombre}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {hallazgosOrdenados.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay registros de tratamientos para este diente</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {hallazgosOrdenados.map((hallazgo) => (
                  <div
                    key={hallazgo._id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {hallazgo.codigoTratamiento} - {hallazgo.nombreTratamiento || 'Tratamiento'}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADOS_COLOR[hallazgo.estado] || ESTADOS_COLOR.diagnostico}`}
                          >
                            {ESTADOS_LABEL[hallazgo.estado] || hallazgo.estado}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Superficies: {hallazgo.superficies.join(', ').toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {hallazgo.nota && (
                      <p className="text-sm text-gray-700 mt-2 italic">"{hallazgo.nota}"</p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Registrado: {formatFecha(hallazgo.fechaRegistro)}</span>
                      </div>
                      {hallazgo.fechaActualizacion && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Actualizado: {formatFecha(hallazgo.fechaActualizacion)}</span>
                        </div>
                      )}
                      {hallazgo.profesional && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>
                            {hallazgo.profesional.nombre} {hallazgo.profesional.apellidos}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



