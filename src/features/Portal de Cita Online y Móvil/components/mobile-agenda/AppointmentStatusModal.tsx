import { X, CheckCircle, Clock, UserCheck, XCircle, AlertCircle } from 'lucide-react';
import { CitaAgenda } from '../../api/agenda';

interface AppointmentStatusModalProps {
  cita: CitaAgenda | null;
  isOpen: boolean;
  onClose: () => void;
  onCambiarEstado: (citaId: string, nuevoEstado: CitaAgenda['estado']) => Promise<void>;
}

const estadosDisponibles: Array<{
  valor: CitaAgenda['estado'];
  label: string;
  icon: React.ReactNode;
  color: string;
  descripcion: string;
}> = [
  {
    valor: 'Pendiente',
    label: 'Pendiente',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100',
    descripcion: 'Cita sin confirmar',
  },
  {
    valor: 'Confirmado',
    label: 'Confirmado',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
    descripcion: 'Cita confirmada por el paciente',
  },
  {
    valor: 'En Sala de Espera',
    label: 'En Sala de Espera',
    icon: <UserCheck className="w-5 h-5" />,
    color: 'text-green-600 bg-green-50 hover:bg-green-100',
    descripcion: 'Paciente ha llegado (Check-in)',
  },
  {
    valor: 'Atendido',
    label: 'Atendido',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-gray-600 bg-gray-50 hover:bg-gray-100',
    descripcion: 'Cita completada',
  },
  {
    valor: 'Cancelado',
    label: 'Cancelado',
    icon: <XCircle className="w-5 h-5" />,
    color: 'text-red-600 bg-red-50 hover:bg-red-100',
    descripcion: 'Cita cancelada',
  },
  {
    valor: 'No se presentó',
    label: 'No se presentó',
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-orange-600 bg-orange-50 hover:bg-orange-100',
    descripcion: 'Paciente no asistió',
  },
];

export default function AppointmentStatusModal({
  cita,
  isOpen,
  onClose,
  onCambiarEstado,
}: AppointmentStatusModalProps) {
  if (!isOpen || !cita) return null;

  const formatearHora = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCambiarEstado = async (nuevoEstado: CitaAgenda['estado']) => {
    try {
      await onCambiarEstado(cita._id, nuevoEstado);
      onClose();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Cambiar Estado de Cita</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Información de la cita */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Paciente</p>
              <p className="font-semibold text-gray-900">
                {cita.paciente.nombre} {cita.paciente.apellidos}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha y Hora</p>
              <p className="font-medium text-gray-900">
                {formatearFecha(cita.fechaHoraInicio)} - {formatearHora(cita.fechaHoraInicio)} -{' '}
                {formatearHora(cita.fechaHoraFin)}
              </p>
            </div>
            {cita.tratamiento && (
              <div>
                <p className="text-sm text-gray-500">Tratamiento</p>
                <p className="font-medium text-gray-900">{cita.tratamiento.nombre}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Estado Actual</p>
              <p className="font-medium text-gray-900">{cita.estado}</p>
            </div>
          </div>
        </div>

        {/* Opciones de estado */}
        <div className="px-6 py-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Seleccionar nuevo estado:</p>
          <div className="space-y-2">
            {estadosDisponibles.map((estado) => (
              <button
                key={estado.valor}
                onClick={() => handleCambiarEstado(estado.valor)}
                disabled={cita.estado === estado.valor}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  cita.estado === estado.valor
                    ? 'border-blue-500 bg-blue-50 cursor-not-allowed opacity-60'
                    : `border-gray-200 ${estado.color} cursor-pointer`
                }`}
              >
                <div className="flex-shrink-0">{estado.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{estado.label}</p>
                  <p className="text-xs opacity-75">{estado.descripcion}</p>
                </div>
                {cita.estado === estado.valor && (
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}


