import { Calendar, Clock, User, Building2, Stethoscope, X } from 'lucide-react';
import { CitaPortal, CitaPasada } from '../api/citasApi';

interface CitaCardProps {
  cita: CitaPortal | CitaPasada;
  esProxima?: boolean;
  onCancelar?: (citaId: string) => void;
}

export default function CitaCard({ cita, esProxima = false, onCancelar }: CitaCardProps) {
  const fechaInicio = new Date(cita.fechaHoraInicio);
  const fechaFin = new Date(cita.fechaHoraFin);
  
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
      case 'programada':
        return 'bg-blue-100 text-blue-800';
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'completada':
        return 'bg-gray-100 text-gray-800';
      case 'ausente':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'programada':
        return 'Programada';
      case 'confirmada':
        return 'Confirmada';
      case 'cancelada':
        return 'Cancelada';
      case 'completada':
        return 'Completada';
      case 'ausente':
        return 'Ausente';
      default:
        return estado;
    }
  };

  const puedeCancelar = esProxima && (cita.estado === 'programada' || cita.estado === 'confirmada');

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
                Dr./Dra. {cita.profesional.nombre} {cita.profesional.apellidos}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-700">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{cita.clinica.nombre}</span>
            </div>
          </div>
        </div>

        <div className="ml-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.estado)}`}>
            {getEstadoLabel(cita.estado)}
          </span>
        </div>
      </div>

      {cita.notasPaciente && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notas: </span>
            {cita.notasPaciente}
          </p>
        </div>
      )}

      {puedeCancelar && onCancelar && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onCancelar(cita._id)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
          >
            <X className="w-4 h-4" />
            <span>Cancelar Cita</span>
          </button>
        </div>
      )}
    </div>
  );
}



