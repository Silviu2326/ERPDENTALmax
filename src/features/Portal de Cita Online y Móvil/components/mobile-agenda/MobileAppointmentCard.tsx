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
      Pendiente: 'bg-yellow-100 text-yellow-800 ring-yellow-300',
      Confirmado: 'bg-blue-100 text-blue-800 ring-blue-300',
      'En Sala de Espera': 'bg-green-100 text-green-800 ring-green-300',
      Atendido: 'bg-slate-100 text-slate-800 ring-slate-300',
      Cancelado: 'bg-red-100 text-red-800 ring-red-300',
      'No se presentó': 'bg-orange-100 text-orange-800 ring-orange-300',
    };
    return colores[estado] || 'bg-slate-100 text-slate-800 ring-slate-300';
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
      className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.98] flex flex-col"
    >
      {/* Header con hora y estado */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-gray-900">
            {formatearHora(cita.fechaHoraInicio)} - {formatearHora(cita.fechaHoraFin)}
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${obtenerColorEstado(
            cita.estado
          )}`}
        >
          {cita.estado}
        </span>
      </div>

      {/* Información del paciente */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2">
          <User size={16} className="text-slate-500" />
          <span className="text-sm font-medium text-gray-900">
            {cita.paciente.nombre} {cita.paciente.apellidos}
          </span>
        </div>

        {/* Tratamiento */}
        {cita.tratamiento && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FileText size={16} className="text-slate-500" />
            <span>{cita.tratamiento.nombre}</span>
          </div>
        )}

        {/* Contacto */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-200 mt-auto">
          {cita.paciente.telefono && (
            <button
              onClick={handleLlamar}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              <Phone size={16} />
              <span>Llamar</span>
            </button>
          )}
          {cita.paciente.email && (
            <a
              href={`mailto:${cita.paciente.email}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              <Mail size={16} />
              <span>Email</span>
            </a>
          )}
        </div>

        {/* Notas de recepción */}
        {cita.notasRecepcion && (
          <div className="mt-2 pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-600 italic">{cita.notasRecepcion}</p>
          </div>
        )}
      </div>
    </div>
  );
}



