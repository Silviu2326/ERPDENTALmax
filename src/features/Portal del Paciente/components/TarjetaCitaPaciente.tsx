import { Calendar, Clock, User, Building2, Stethoscope, X, Edit } from 'lucide-react';
import { CitaPaciente } from '../api/citasPacienteApi';

interface TarjetaCitaPacienteProps {
  cita: CitaPaciente;
  esProxima?: boolean;
  onCancelar?: (citaId: string) => void;
  onModificar?: (cita: CitaPaciente) => void;
}

export default function TarjetaCitaPaciente({ 
  cita, 
  esProxima = false, 
  onCancelar, 
  onModificar 
}: TarjetaCitaPacienteProps) {
  const fechaInicio = new Date(cita.fecha_hora_inicio);
  const fechaFin = new Date(cita.fecha_hora_fin);
  
  const formatoFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatoHora = (fecha: Date) => {
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Programada':
        return 'bg-blue-100 text-blue-800';
      case 'Confirmada':
        return 'bg-green-100 text-green-800';
      case 'CanceladaPorPaciente':
      case 'CanceladaPorClinica':
        return 'bg-red-100 text-red-800';
      case 'Completada':
        return 'bg-gray-100 text-gray-800';
      case 'NoAsistio':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'Programada':
        return 'Programada';
      case 'Confirmada':
        return 'Confirmada';
      case 'CanceladaPorPaciente':
        return 'Cancelada por Paciente';
      case 'CanceladaPorClinica':
        return 'Cancelada por Clínica';
      case 'Completada':
        return 'Completada';
      case 'NoAsistio':
        return 'No Asistió';
      default:
        return estado;
    }
  };

  const puedeGestionar = esProxima && (cita.estado === 'Programada' || cita.estado === 'Confirmada');

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formatoFecha(fechaInicio)}
              </h3>
              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {formatoHora(fechaInicio)} - {formatoHora(fechaFin)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {cita.tratamiento && (
              <div className="flex items-center space-x-2 text-gray-700">
                <Stethoscope className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{cita.tratamiento.nombre}</span>
              </div>
            )}

            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                Dr./Dra. {cita.doctor.nombre} {cita.doctor.apellidos}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-700">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{cita.sucursal.nombre}</span>
            </div>
          </div>
        </div>

        <div className="ml-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.estado)}`}>
            {getEstadoLabel(cita.estado)}
          </span>
        </div>
      </div>

      {cita.notas_paciente && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notas: </span>
            {cita.notas_paciente}
          </p>
        </div>
      )}

      {puedeGestionar && (onCancelar || onModificar) && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center space-x-2">
          {onModificar && (
            <button
              onClick={() => onModificar(cita)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Modificar</span>
            </button>
          )}
          {onCancelar && (
            <button
              onClick={() => onCancelar(cita._id)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}



