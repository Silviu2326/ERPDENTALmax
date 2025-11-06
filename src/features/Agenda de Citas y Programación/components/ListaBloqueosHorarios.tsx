import { X, Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import { ExcepcionDisponibilidad } from '../api/disponibilidadApi';

interface ListaBloqueosHorariosProps {
  excepciones: ExcepcionDisponibilidad[];
  onEliminar: (excepcionId: string) => void;
  loading?: boolean;
}

export default function ListaBloqueosHorarios({
  excepciones,
  onEliminar,
  loading = false,
}: ListaBloqueosHorariosProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (excepciones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No hay excepciones o bloqueos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {excepciones.map((excepcion) => {
        const fechaInicio = new Date(excepcion.fechaInicio);
        const fechaFin = new Date(excepcion.fechaFin);
        const esMismoDia = fechaInicio.toDateString() === fechaFin.toDateString();

        const formatearFecha = (fecha: Date, incluirHora: boolean = false): string => {
          const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          
          const diaSemana = diasSemana[fecha.getDay()];
          const dia = fecha.getDate();
          const mes = meses[fecha.getMonth()];
          const anio = fecha.getFullYear();
          
          let fechaFormateada = `${diaSemana}, ${dia} de ${mes} de ${anio}`;
          
          if (incluirHora) {
            const horas = fecha.getHours().toString().padStart(2, '0');
            const minutos = fecha.getMinutes().toString().padStart(2, '0');
            fechaFormateada += ` de ${horas}:${minutos}`;
          }
          
          return fechaFormateada;
        };

        const formatearHora = (fecha: Date): string => {
          const horas = fecha.getHours().toString().padStart(2, '0');
          const minutos = fecha.getMinutes().toString().padStart(2, '0');
          return `${horas}:${minutos}`;
        };

        return (
          <div
            key={excepcion._id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    {excepcion.diaCompleto
                      ? formatearFecha(fechaInicio)
                      : formatearFecha(fechaInicio, true)}
                  </span>
                </div>

                {!excepcion.diaCompleto && (
                  <div className="flex items-center space-x-2 mb-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatearHora(fechaInicio)} - {formatearHora(fechaFin)}
                    </span>
                  </div>
                )}

                {excepcion.motivo && (
                  <div className="flex items-start space-x-2 text-gray-700">
                    <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{excepcion.motivo}</span>
                  </div>
                )}

                {excepcion.diaCompleto && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Día completo
                  </span>
                )}
              </div>

              <button
                onClick={() => excepcion._id && onEliminar(excepcion._id)}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar excepción"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

