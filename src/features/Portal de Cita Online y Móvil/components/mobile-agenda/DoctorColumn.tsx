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
    <div className="flex-shrink-0 w-full sm:w-80 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4 h-full flex flex-col">
      {/* Header de la columna */}
      <div className="mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full ring-1 ring-slate-300"
            style={{
              backgroundColor: profesional.colorAgenda || '#3B82F6',
            }}
          />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {profesional.nombre} {profesional.apellidos}
            </h3>
            {profesional.especialidad && (
              <p className="text-xs text-slate-600">{profesional.especialidad}</p>
            )}
          </div>
          <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full ring-1 ring-slate-200">
            {citasOrdenadas.length}
          </span>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto flex-1">
        {citasOrdenadas.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <User size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm text-slate-600">No hay citas programadas</p>
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



