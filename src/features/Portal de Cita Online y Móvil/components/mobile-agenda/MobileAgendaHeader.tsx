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
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-0 z-10 ring-1 ring-slate-200">
      {/* Navegación de fecha */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onAnteriorDia}
          className="p-2 rounded-xl hover:bg-slate-100 transition-all"
          aria-label="Día anterior"
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </button>

        <div className="flex-1 text-center mx-4">
          <div className="flex items-center justify-center gap-2">
            <Calendar size={16} className="text-blue-600" />
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
          className="p-2 rounded-xl hover:bg-slate-100 transition-all"
          aria-label="Día siguiente"
        >
          <ChevronRight size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Botones de acción rápida */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onHoy}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            esHoy()
              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 ring-1 ring-slate-200'
          }`}
        >
          Ir a hoy
        </button>

        {mostrarFiltros && onToggleFiltros && (
          <button
            onClick={onToggleFiltros}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 ring-1 ring-slate-200"
          >
            <Filter size={16} />
            Filtros
          </button>
        )}
      </div>
    </div>
  );
}



