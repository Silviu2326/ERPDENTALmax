import { Eye, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Blanqueamiento } from '../api/blanqueamientoApi';

interface HistorialBlanqueamientosProps {
  blanqueamientos: Blanqueamiento[];
  loading?: boolean;
  onVerDetalle: (blanqueamiento: Blanqueamiento) => void;
}

export default function HistorialBlanqueamientos({
  blanqueamientos,
  loading = false,
  onVerDetalle,
}: HistorialBlanqueamientosProps) {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Completado':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completado
          </span>
        );
      case 'En Proceso':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            En Proceso
          </span>
        );
      case 'Cancelado':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Cargando historial...</p>
      </div>
    );
  }

  if (blanqueamientos.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 font-medium">No hay tratamientos de blanqueamiento registrados</p>
        <p className="text-sm text-gray-400 mt-1">
          Cree un nuevo tratamiento para comenzar el seguimiento
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blanqueamientos
        .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())
        .map((blanqueamiento) => (
          <div
            key={blanqueamiento._id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Tratamiento iniciado el{' '}
                      {new Date(blanqueamiento.fechaInicio).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h4>
                  </div>
                  {getEstadoBadge(blanqueamiento.estado)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {blanqueamiento.tipoBlanqueamiento}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Producto:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {blanqueamiento.productoUtilizado}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tono Inicial:</span>
                    <span className="ml-2 font-medium text-gray-900">{blanqueamiento.tonoInicial}</span>
                  </div>
                  {blanqueamiento.tonoFinal && (
                    <div>
                      <span className="text-gray-600">Tono Final:</span>
                      <span className="ml-2 font-medium text-gray-900">{blanqueamiento.tonoFinal}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Sesiones:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {blanqueamiento.sesiones.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fotos:</span>
                    <span className="ml-2 font-medium text-gray-900">{blanqueamiento.fotos.length}</span>
                  </div>
                </div>

                {blanqueamiento.notasGenerales && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notas:</span> {blanqueamiento.notasGenerales}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => onVerDetalle(blanqueamiento)}
                className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver Detalle
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}


