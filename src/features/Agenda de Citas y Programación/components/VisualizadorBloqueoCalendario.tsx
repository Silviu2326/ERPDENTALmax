import { Bloqueo } from '../api/bloqueosApi';
import { Building2, User, Clock, Calendar } from 'lucide-react';

interface VisualizadorBloqueoCalendarioProps {
  bloqueos: Bloqueo[];
  onBloqueoClick?: (bloqueo: Bloqueo) => void;
}

export default function VisualizadorBloqueoCalendario({
  bloqueos,
  onBloqueoClick,
}: VisualizadorBloqueoCalendarioProps) {
  const getBloqueoStyle = (bloqueo: Bloqueo) => {
    // Estilos diferentes para bloqueos de sala vs profesional
    if (bloqueo.tipo === 'SALA') {
      return 'bg-orange-100 border-orange-300 text-orange-800';
    } else {
      return 'bg-purple-100 border-purple-300 text-purple-800';
    }
  };

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatearHora = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (bloqueos.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay bloqueos programados en este período</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bloqueos.map((bloqueo) => (
        <div
          key={bloqueo._id}
          onClick={() => onBloqueoClick?.(bloqueo)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getBloqueoStyle(
            bloqueo
          )}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {bloqueo.tipo === 'SALA' ? (
                  <Building2 className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {bloqueo.tipo === 'SALA'
                    ? `Sala ${bloqueo.recursoId.numero || bloqueo.recursoId.nombreCompleto || 'N/A'}`
                    : `${bloqueo.recursoId.nombre || ''} ${bloqueo.recursoId.apellidos || ''}`.trim()}
                </span>
                {bloqueo.recurrencia && (
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                    Recurrente
                  </span>
                )}
              </div>
              <p className="text-sm mb-2">{bloqueo.motivo}</p>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatearFecha(bloqueo.fechaInicio)}
                    {bloqueo.esDiaCompleto ? ' (Día completo)' : ''}
                  </span>
                </div>
                {!bloqueo.esDiaCompleto && (
                  <>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatearHora(bloqueo.fechaInicio)} - {formatearHora(bloqueo.fechaFin)}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-2 text-xs opacity-75">
                Sede: {bloqueo.sede.nombre}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


