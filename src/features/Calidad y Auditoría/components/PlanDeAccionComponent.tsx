import { CheckCircle, Clock, User, Calendar, AlertCircle } from 'lucide-react';
import {
  AccionCorrectiva,
  AccionPreventiva,
  Capa,
} from '../api/capasApi';

interface PlanDeAccionComponentProps {
  capa: Capa;
  onActualizarAccionCorrectiva?: (accion: AccionCorrectiva) => void;
  onActualizarAccionPreventiva?: (accion: AccionPreventiva) => void;
  responsables?: Array<{ _id: string; nombre: string; apellidos?: string }>;
  readonly?: boolean;
}

export default function PlanDeAccionComponent({
  capa,
  onActualizarAccionCorrectiva,
  onActualizarAccionPreventiva,
  responsables = [],
  readonly = false,
}: PlanDeAccionComponentProps) {
  const formatFecha = (fecha?: string) => {
    if (!fecha) return 'No definida';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getResponsableNombre = (responsableId?: string) => {
    if (!responsableId) return 'Sin asignar';
    const responsable = responsables.find((r) => r._id === responsableId);
    return responsable
      ? `${responsable.nombre} ${responsable.apellidos || ''}`
      : 'Sin asignar';
  };

  const isAccionCompletada = (fechaCompletado?: string) => {
    return !!fechaCompletado;
  };

  const isAccionVencida = (fechaLimite?: string) => {
    if (!fechaLimite) return false;
    return new Date(fechaLimite) < new Date() && !isAccionCompletada();
  };

  return (
    <div className="space-y-6">
      {/* Acción Correctiva */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 rounded-lg">
            <CheckCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Acción Correctiva
            </h3>
            <p className="text-sm text-gray-500">
              Acción para corregir el problema identificado
            </p>
          </div>
        </div>

        {capa.accion_correctiva ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-900">
                  {capa.accion_correctiva.descripcion}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Responsable
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-900">
                    {getResponsableNombre(capa.accion_correctiva.id_responsable)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha Límite
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-900">
                      {formatFecha(capa.accion_correctiva.fecha_limite)}
                    </p>
                    {isAccionVencida(capa.accion_correctiva.fecha_limite) && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3" />
                        Vencida
                      </span>
                    )}
                    {isAccionCompletada(
                      capa.accion_correctiva.fecha_completado
                    ) && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Completada
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {capa.accion_correctiva.fecha_completado && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Completado
                </label>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-sm text-green-900">
                    {formatFecha(capa.accion_correctiva.fecha_completado)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Acción correctiva no definida
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Define una acción correctiva para resolver el problema.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Acción Preventiva */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Acción Preventiva
            </h3>
            <p className="text-sm text-gray-500">
              Acción para prevenir la recurrencia del problema
            </p>
          </div>
        </div>

        {capa.accion_preventiva ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-900">
                  {capa.accion_preventiva.descripcion}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Responsable
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-900">
                    {getResponsableNombre(capa.accion_preventiva.id_responsable)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha Límite
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-900">
                      {formatFecha(capa.accion_preventiva.fecha_limite)}
                    </p>
                    {isAccionVencida(capa.accion_preventiva.fecha_limite) && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3" />
                        Vencida
                      </span>
                    )}
                    {isAccionCompletada(
                      capa.accion_preventiva.fecha_completado
                    ) && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Completada
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {capa.accion_preventiva.fecha_completado && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Completado
                </label>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-sm text-green-900">
                    {formatFecha(capa.accion_preventiva.fecha_completado)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Acción preventiva no definida
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Define una acción preventiva para evitar la recurrencia del
                  problema.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


