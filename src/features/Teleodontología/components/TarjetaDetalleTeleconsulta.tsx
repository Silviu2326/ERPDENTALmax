import { Video, Calendar, User, FileText, Clock, AlertCircle } from 'lucide-react';
import { Teleconsulta } from '../api/teleconsultasApi';

interface TarjetaDetalleTeleconsultaProps {
  teleconsulta: Teleconsulta;
  onIniciarVideollamada?: (teleconsulta: Teleconsulta) => void;
  onEditar?: (teleconsulta: Teleconsulta) => void;
}

export default function TarjetaDetalleTeleconsulta({
  teleconsulta,
  onIniciarVideollamada,
  onEditar,
}: TarjetaDetalleTeleconsultaProps) {
  const fechaInicio = new Date(teleconsulta.fechaHoraInicio);
  const fechaFormateada = fechaInicio.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const horaFormateada = fechaInicio.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Programada':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Confirmada':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'En Curso':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Completada':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Cancelada':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'No Asistió':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {teleconsulta.paciente?.nombre} {teleconsulta.paciente?.apellidos}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getEstadoColor(
                teleconsulta.estado
              )}`}
            >
              {teleconsulta.estado}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Dr./Dra. {teleconsulta.odontologo?.nombre} {teleconsulta.odontologo?.apellidos}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-700">
          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
          <span className="font-medium">{fechaFormateada}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-blue-600" />
          <span className="font-medium">{horaFormateada}</span>
        </div>
        {teleconsulta.motivoConsulta && (
          <div className="flex items-start text-sm text-gray-700">
            <FileText className="w-4 h-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-medium">Motivo: </span>
              {teleconsulta.motivoConsulta}
            </span>
          </div>
        )}
        {teleconsulta.notasPrevias && (
          <div className="flex items-start text-sm text-gray-700">
            <AlertCircle className="w-4 h-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-medium">Notas: </span>
              {teleconsulta.notasPrevias}
            </span>
          </div>
        )}
        {teleconsulta.enlaceVideollamada && (
          <div className="flex items-center text-sm text-blue-600">
            <Video className="w-4 h-4 mr-2" />
            <a
              href={teleconsulta.enlaceVideollamada}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Enlace de videollamada activo
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        {onIniciarVideollamada && teleconsulta.estado !== 'En Curso' && teleconsulta.estado !== 'Completada' && (
          <button
            onClick={() => onIniciarVideollamada(teleconsulta)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Video className="w-4 h-4" />
            Iniciar Videollamada
          </button>
        )}
        {onEditar && (
          <button
            onClick={() => onEditar(teleconsulta)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
}


