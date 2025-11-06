import { User } from 'lucide-react';
import { CitaAgenda, ProfesionalAgenda } from '../../api/agenda';
import MobileAppointmentCard from './MobileAppointmentCard';

interface DoctorColumnProps {
  profesional: ProfesionalAgenda;
  citas: CitaAgenda[];
  onCitaClick: (cita: CitaAgenda) => void;
  onLlamarPaciente?: (telefono: string) => void;
}

export default function DoctorColumn({
  profesional,
  citas,
  onCitaClick,
  onLlamarPaciente,
}: DoctorColumnProps) {
  // Ordenar citas por hora de inicio
  const citasOrdenadas = [...citas].sort((a, b) => {
    const fechaA = new Date(a.fechaHoraInicio).getTime();
    const fechaB = new Date(b.fechaHoraInicio).getTime();
    return fechaA - fechaB;
  });

  return (
    <div className="flex-shrink-0 w-full sm:w-80 bg-gray-50 rounded-lg border border-gray-200 p-4">
      {/* Header de la columna */}
      <div className="mb-4 pb-3 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: profesional.colorAgenda || '#3B82F6',
            }}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {profesional.nombre} {profesional.apellidos}
            </h3>
            {profesional.especialidad && (
              <p className="text-xs text-gray-500">{profesional.especialidad}</p>
            )}
          </div>
          <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-full">
            {citasOrdenadas.length}
          </span>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
        {citasOrdenadas.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay citas programadas</p>
          </div>
        ) : (
          citasOrdenadas.map((cita) => (
            <MobileAppointmentCard
              key={cita._id}
              cita={cita}
              onCitaClick={onCitaClick}
              onLlamarPaciente={onLlamarPaciente}
            />
          ))
        )}
      </div>
    </div>
  );
}


