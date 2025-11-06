import { useState, useEffect } from 'react';
import { Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';
import { consultarDisponibilidad, DisponibilidadHorario, FiltrosDisponibilidad } from '../api/citasPacienteApi';

interface SelectorDisponibilidadProps {
  filtros: FiltrosDisponibilidad;
  onSeleccionarHorario: (horario: DisponibilidadHorario) => void;
  horarioSeleccionado?: DisponibilidadHorario | null;
}

export default function SelectorDisponibilidad({
  filtros,
  onSeleccionarHorario,
  horarioSeleccionado,
}: SelectorDisponibilidadProps) {
  const [horarios, setHorarios] = useState<DisponibilidadHorario[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (filtros.tratamiento_id && filtros.fecha_inicio && filtros.fecha_fin) {
      cargarDisponibilidad();
    }
  }, [filtros]);

  const cargarDisponibilidad = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await consultarDisponibilidad(filtros);
      setHorarios(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al consultar la disponibilidad');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatearHora = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearFechaCompleta = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Agrupar horarios por fecha
  const horariosPorFecha = horarios.reduce((acc, horario) => {
    const fecha = new Date(horario.start).toDateString();
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(horario);
    return acc;
  }, {} as Record<string, DisponibilidadHorario[]>);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Consultando disponibilidad...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
        <button
          onClick={cargarDisponibilidad}
          className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (horarios.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">No hay horarios disponibles en el rango de fechas seleccionado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Calendar className="w-4 h-4" />
        <span>Selecciona un horario disponible:</span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(horariosPorFecha).map(([fecha, horariosFecha]) => (
          <div key={fecha} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              {formatearFechaCompleta(horariosFecha[0].start)}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {horariosFecha.map((horario) => {
                const estaSeleccionado =
                  horarioSeleccionado &&
                  horario.start === horarioSeleccionado.start &&
                  horario.end === horarioSeleccionado.end;

                return (
                  <button
                    key={`${horario.start}-${horario.end}`}
                    onClick={() => onSeleccionarHorario(horario)}
                    className={`
                      p-3 rounded-lg border-2 transition-all text-left
                      ${estaSeleccionado
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-4 h-4 ${estaSeleccionado ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="font-medium text-sm">
                        {formatearHora(horario.start)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      hasta {formatearHora(horario.end)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


