import { Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { CitaAgenda } from '../../api/agenda';

interface MobileAppointmentCardProps {
  cita: CitaAgenda;
  onCitaClick: (cita: CitaAgenda) => void;
  onLlamarPaciente?: (telefono: string) => void;
}

export default function MobileAppointmentCard({
  cita,
  onCitaClick,
  onLlamarPaciente,
}: MobileAppointmentCardProps) {
  const formatearHora = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const obtenerColorEstado = (estado: CitaAgenda['estado']): string => {
    const colores = {
      Pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Confirmado: 'bg-blue-100 text-blue-800 border-blue-300',
      'En Sala de Espera': 'bg-green-100 text-green-800 border-green-300',
      Atendido: 'bg-gray-100 text-gray-800 border-gray-300',
      Cancelado: 'bg-red-100 text-red-800 border-red-300',
      'No se presentó': 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const handleClick = () => {
    onCitaClick(cita);
  };

  const handleLlamar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cita.paciente.telefono && onLlamarPaciente) {
      onLlamarPaciente(cita.paciente.telefono);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
    >
      {/* Header con hora y estado */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-900">
            {formatearHora(cita.fechaHoraInicio)} - {formatearHora(cita.fechaHoraFin)}
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${obtenerColorEstado(
            cita.estado
          )}`}
        >
          {cita.estado}
        </span>
      </div>

      {/* Información del paciente */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">
            {cita.paciente.nombre} {cita.paciente.apellidos}
          </span>
        </div>

        {/* Tratamiento */}
        {cita.tratamiento && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4 text-gray-400" />
            <span>{cita.tratamiento.nombre}</span>
          </div>
        )}

        {/* Contacto */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          {cita.paciente.telefono && (
            <button
              onClick={handleLlamar}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Llamar</span>
            </button>
          )}
          {cita.paciente.email && (
            <a
              href={`mailto:${cita.paciente.email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          )}
        </div>

        {/* Notas de recepción */}
        {cita.notasRecepcion && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600 italic">{cita.notasRecepcion}</p>
          </div>
        )}
      </div>
    </div>
  );
}


