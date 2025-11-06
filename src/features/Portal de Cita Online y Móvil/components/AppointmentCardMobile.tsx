import { Phone, Clock, User, FileText } from 'lucide-react';
import { CitaProfesional, DetallesCitaMovil } from '../api/agendaProfesionalApi';
import AppointmentStatusChip from './AppointmentStatusChip';

interface AppointmentCardMobileProps {
  cita: CitaProfesional | DetallesCitaMovil;
  onVerDetalles: (citaId: string) => void;
  onLlamarPaciente?: (telefono: string) => void;
  mostrarDetalles?: boolean;
}

export default function AppointmentCardMobile({
  cita,
  onVerDetalles,
  onLlamarPaciente,
  mostrarDetalles = false,
}: AppointmentCardMobileProps) {
  const formatearHora = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatearHoraCompleta = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const calcularDuracion = (inicio: string, fin: string): number => {
    const inicioDate = new Date(inicio);
    const finDate = new Date(fin);
    return Math.round((finDate.getTime() - inicioDate.getTime()) / (1000 * 60));
  };

  const duracion = calcularDuracion(cita.fechaHoraInicio, cita.fechaHoraFin);

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4"
      style={
        cita.profesional.colorAgenda
          ? { borderLeftColor: cita.profesional.colorAgenda }
          : { borderLeftColor: '#3b82f6' }
      }
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-lg font-bold text-gray-900">
              {formatearHora(cita.fechaHoraInicio)}
            </span>
            <span className="text-sm text-gray-500">({duracion} min)</span>
          </div>
          <AppointmentStatusChip estado={cita.estado} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-900">
              {cita.paciente.nombre} {cita.paciente.apellidos}
            </p>
            {mostrarDetalles && cita.paciente.telefono && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{cita.paciente.telefono}</span>
                {onLlamarPaciente && (
                  <button
                    onClick={() => onLlamarPaciente(cita.paciente.telefono!)}
                    className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    aria-label="Llamar al paciente"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-700">{cita.tratamiento.nombre}</p>
        </div>

        {cita.profesional && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              {cita.profesional.nombre} {cita.profesional.apellidos}
            </p>
          </div>
        )}

        {mostrarDetalles && cita.notas && (
          <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-xs font-medium text-yellow-800 mb-1">Notas:</p>
            <p className="text-sm text-yellow-700">{cita.notas}</p>
          </div>
        )}

        {mostrarDetalles && 'alertasMedicas' in cita.paciente && cita.paciente.alertasMedicas && (
          <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
            <p className="text-xs font-medium text-red-800 mb-1">⚠️ Alertas Médicas:</p>
            <p className="text-sm text-red-700">{cita.paciente.alertasMedicas}</p>
          </div>
        )}
      </div>

      {!mostrarDetalles && (
        <button
          onClick={() => onVerDetalles(cita._id)}
          className="mt-3 w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          Ver detalles
        </button>
      )}
    </div>
  );
}


