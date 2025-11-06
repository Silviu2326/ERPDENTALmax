import { CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { Hallazgo, ActualizarHallazgo } from '../../api/odontogramaApi';

interface BotoneraEstadoTratamientoProps {
  hallazgo: Hallazgo;
  onUpdate: (datos: ActualizarHallazgo) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export default function BotoneraEstadoTratamiento({
  hallazgo,
  onUpdate,
  onDelete,
  disabled = false,
}: BotoneraEstadoTratamientoProps) {
  const handleEstadoChange = (nuevoEstado: 'realizado' | 'en_progreso' | 'descartado') => {
    const datos: ActualizarHallazgo = {
      estado: nuevoEstado,
      fechaRealizacion: nuevoEstado === 'realizado' ? new Date().toISOString() : undefined,
    };
    onUpdate(datos);
  };

  const puedeMarcarRealizado =
    hallazgo.estado === 'planificado' || hallazgo.estado === 'en_progreso';
  const puedeMarcarEnProgreso = hallazgo.estado === 'planificado';
  const puedeDescartar = hallazgo.estado !== 'realizado' && hallazgo.estado !== 'descartado';

  return (
    <div className="flex flex-wrap gap-2">
      {puedeMarcarRealizado && (
        <button
          onClick={() => handleEstadoChange('realizado')}
          disabled={disabled}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Marcar como realizado"
        >
          <CheckCircle className="w-4 h-4" />
          Realizado
        </button>
      )}

      {puedeMarcarEnProgreso && (
        <button
          onClick={() => handleEstadoChange('en_progreso')}
          disabled={disabled}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Marcar como en progreso"
        >
          <Clock className="w-4 h-4" />
          En Progreso
        </button>
      )}

      {puedeDescartar && (
        <button
          onClick={() => handleEstadoChange('descartado')}
          disabled={disabled}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Descartar tratamiento"
        >
          <XCircle className="w-4 h-4" />
          Descartar
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          disabled={disabled}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Eliminar hallazgo"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      )}
    </div>
  );
}


