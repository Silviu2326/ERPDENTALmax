import { CheckCircle, Clock, AlertCircle, User, Calendar } from 'lucide-react';
import { AccionCorrectiva, AccionPreventiva } from '../api/incidenciasApi';

interface PlanAccionCardProps {
  tipo: 'correctiva' | 'preventiva';
  acciones: AccionCorrectiva[] | AccionPreventiva[];
  onMarcarCompletada?: (accionId: string) => void;
  onEditar?: (accion: AccionCorrectiva | AccionPreventiva) => void;
  readonly?: boolean;
}

export default function PlanAccionCard({
  tipo,
  acciones,
  onMarcarCompletada,
  onEditar,
  readonly = false,
}: PlanAccionCardProps) {
  const tipoLabel = tipo === 'correctiva' ? 'Correctivas' : 'Preventivas';

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isVencida = (fecha: string) => {
    return new Date(fecha) < new Date() && !acciones.find(a => a.fecha_limite === fecha && a.completada);
  };

  const getEstadoAccion = (accion: AccionCorrectiva | AccionPreventiva) => {
    if (accion.completada) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        label: 'Completada',
      };
    }

    if (isVencida(accion.fecha_limite)) {
      return {
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        label: 'Vencida',
      };
    }

    return {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      label: 'Pendiente',
    };
  };

  if (acciones.length === 0) {
    return (
      <div className="bg-white shadow-sm p-6 rounded-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Acciones {tipoLabel}
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>No hay acciones {tipoLabel.toLowerCase()} registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className={`p-2 rounded-xl ring-1 ${tipo === 'correctiva' ? 'bg-blue-100 ring-blue-200/70' : 'bg-green-100 ring-green-200/70'}`}>
            {tipo === 'correctiva' ? (
              <CheckCircle size={20} className="text-blue-600" />
            ) : (
              <AlertCircle size={20} className="text-green-600" />
            )}
          </div>
          Acciones {tipoLabel}
          <span className="text-sm font-normal text-gray-500">
            ({acciones.length})
          </span>
        </h3>
      </div>

      <div className="space-y-4">
        {acciones.map((accion, index) => {
          const estado = getEstadoAccion(accion);
          const EstadoIcon = estado.icon;

          return (
            <div
              key={accion._id || index}
              className={`rounded-xl p-4 ring-1 ${estado.bgColor} ring-slate-200`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <EstadoIcon size={16} className={estado.color} />
                    <span className={`text-sm font-medium ${estado.color}`}>
                      {estado.label}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-3">{accion.descripcion}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>Responsable: {accion.responsable || 'No asignado'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span className={isVencida(accion.fecha_limite) && !accion.completada ? 'text-red-600 font-medium' : ''}>
                        Vence: {formatFecha(accion.fecha_limite)}
                      </span>
                    </div>
                    {accion.fecha_completada && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={16} />
                        <span>Completada: {formatFecha(accion.fecha_completada)}</span>
                      </div>
                    )}
                  </div>
                  {accion.observaciones && (
                    <div className="mt-3 p-3 bg-white rounded-xl ring-1 ring-slate-200">
                      <p className="text-sm text-gray-700">
                        <strong>Observaciones:</strong> {accion.observaciones}
                      </p>
                    </div>
                  )}
                </div>
                {!readonly && (
                  <div className="flex items-center gap-2">
                    {onEditar && (
                      <button
                        onClick={() => onEditar(accion)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Editar acción"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    {!accion.completada && onMarcarCompletada && accion._id && (
                      <button
                        onClick={() => onMarcarCompletada(accion._id!)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"
                        title="Marcar como completada"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



