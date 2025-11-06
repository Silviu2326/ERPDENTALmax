import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface MobileAgendaHeaderProps {
  fechaSeleccionada: Date;
  onCambiarFecha: (fecha: Date) => void;
  onAnteriorDia: () => void;
  onSiguienteDia: () => void;
  onHoy: () => void;
  mostrarFiltros?: boolean;
  onToggleFiltros?: () => void;
}

export default function MobileAgendaHeader({
  fechaSeleccionada,
  onCambiarFecha,
  onAnteriorDia,
  onSiguienteDia,
  onHoy,
  mostrarFiltros = false,
  onToggleFiltros,
}: MobileAgendaHeaderProps) {
  const formatearFecha = (fecha: Date): string => {
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  const esHoy = () => {
    const hoy = new Date();
    return (
      fechaSeleccionada.getDate() === hoy.getDate() &&
      fechaSeleccionada.getMonth() === hoy.getMonth() &&
      fechaSeleccionada.getFullYear() === hoy.getFullYear()
    );
  };

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="px-4 py-3">
        {/* Navegación de fecha */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onAnteriorDia}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Día anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 text-center mx-4">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {formatearFecha(fechaSeleccionada)}
              </h2>
            </div>
            {esHoy() && (
              <span className="text-xs text-blue-600 font-medium mt-1 block">Hoy</span>
            )}
          </div>

          <button
            onClick={onSiguienteDia}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Día siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Botones de acción rápida */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onHoy}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              esHoy()
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ir a hoy
          </button>

          {mostrarFiltros && onToggleFiltros && (
            <button
              onClick={onToggleFiltros}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


