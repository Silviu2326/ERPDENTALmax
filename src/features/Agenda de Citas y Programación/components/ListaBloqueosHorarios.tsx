import { X, Calendar, Clock, FileText, AlertCircle, Loader2 } from 'lucide-react';
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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (excepciones.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay excepciones o bloqueos</h3>
        <p className="text-gray-600">No hay excepciones o bloqueos registrados</p>
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
            className="bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition-shadow ring-1 ring-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    {excepcion.diaCompleto
                      ? formatearFecha(fechaInicio)
                      : formatearFecha(fechaInicio, true)}
                  </span>
                </div>

                {!excepcion.diaCompleto && (
                  <div className="flex items-center space-x-2 mb-2 text-gray-600">
                    <Clock size={16} />
                    <span className="text-sm">
                      {formatearHora(fechaInicio)} - {formatearHora(fechaFin)}
                    </span>
                  </div>
                )}

                {excepcion.motivo && (
                  <div className="flex items-start space-x-2 text-gray-700">
                    <FileText size={16} className="mt-0.5 flex-shrink-0" />
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
                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Eliminar excepción"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

