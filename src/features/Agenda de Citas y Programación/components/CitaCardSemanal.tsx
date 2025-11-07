import { Cita } from '../api/citasApi';
import { Clock, User, Stethoscope, MapPin } from 'lucide-react';

interface CitaCardSemanalProps {
  cita: Cita;
  onClick: () => void;
}

const getColorPorEstado = (estado: string) => {
  const colores: Record<string, string> = {
    programada: 'bg-blue-100 border-blue-300 text-blue-800',
    confirmada: 'bg-green-100 border-green-300 text-green-800',
    cancelada: 'bg-red-100 border-red-300 text-red-800',
    realizada: 'bg-gray-100 border-gray-300 text-gray-800',
    'no-asistio': 'bg-orange-100 border-orange-300 text-orange-800',
  };
  return colores[estado] || 'bg-gray-100 border-gray-300 text-gray-800';
};

export default function CitaCardSemanal({ cita, onClick }: CitaCardSemanalProps) {
  const fechaInicio = new Date(cita.fecha_hora_inicio);
  const fechaFin = new Date(cita.fecha_hora_fin);
  
  const horaInicio = fechaInicio.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const horaFin = fechaFin.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const duracionMinutos = Math.round((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60));

  return (
    <div
      onClick={onClick}
      className={`${getColorPorEstado(cita.estado)} rounded-lg p-2 mb-1 cursor-pointer hover:shadow-md transition-all border-l-4 group`}
      title={`${cita.paciente.nombre} ${cita.paciente.apellidos} - ${horaInicio} - ${horaFin}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs font-semibold">
              {horaInicio} - {horaFin}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 mb-1">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs font-medium truncate">
              {cita.paciente.nombre} {cita.paciente.apellidos}
            </span>
          </div>

          {cita.profesional && (
            <div className="flex items-center space-x-1 mb-1">
              <Stethoscope className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs truncate">
                Dr. {cita.profesional.nombre} {cita.profesional.apellidos}
              </span>
            </div>
          )}

          {cita.tratamiento && (
            <div className="text-xs truncate mt-1">
              {cita.tratamiento.nombre}
            </div>
          )}

          {cita.box_asignado && (
            <div className="flex items-center space-x-1 mt-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs">Box {cita.box_asignado}</span>
            </div>
          )}
        </div>
      </div>

      {cita.notas && (
        <div className="mt-1 text-xs opacity-75 truncate" title={cita.notas}>
          {cita.notas}
        </div>
      )}
    </div>
  );
}



