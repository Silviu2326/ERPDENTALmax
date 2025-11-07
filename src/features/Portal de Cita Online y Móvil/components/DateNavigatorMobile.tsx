import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DateNavigatorMobileProps {
  fechaSeleccionada: Date;
  vista: 'dia' | 'semana';
  onCambiarFecha: (fecha: Date) => void;
  onCambiarVista: (vista: 'dia' | 'semana') => void;
}

export default function DateNavigatorMobile({
  fechaSeleccionada,
  vista,
  onCambiarFecha,
  onCambiarVista,
}: DateNavigatorMobileProps) {
  const formatearFecha = (fecha: Date): string => {
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  const navegarDia = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaSeleccionada);
    if (direccion === 'anterior') {
      nuevaFecha.setDate(nuevaFecha.getDate() - 1);
    } else {
      nuevaFecha.setDate(nuevaFecha.getDate() + 1);
    }
    onCambiarFecha(nuevaFecha);
  };

  const navegarSemana = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaSeleccionada);
    if (direccion === 'anterior') {
      nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    } else {
      nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    }
    onCambiarFecha(nuevaFecha);
  };

  const irHoy = () => {
    onCambiarFecha(new Date());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => (vista === 'dia' ? navegarDia('anterior') : navegarSemana('anterior'))}
          className="p-2 rounded-xl hover:bg-slate-100 transition-all"
          aria-label="Fecha anterior"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>

        <div className="flex-1 text-center">
          <button
            onClick={irHoy}
            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {formatearFecha(fechaSeleccionada)}
          </button>
          <button
            onClick={irHoy}
            className="block text-xs text-gray-600 hover:text-blue-600 mt-1"
          >
            Ir a hoy
          </button>
        </div>

        <button
          onClick={() => (vista === 'dia' ? navegarDia('siguiente') : navegarSemana('siguiente'))}
          className="p-2 rounded-xl hover:bg-slate-100 transition-all"
          aria-label="Fecha siguiente"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="flex gap-2 rounded-2xl bg-slate-100 p-1">
        <button
          onClick={() => onCambiarVista('dia')}
          className={`inline-flex items-center gap-2 flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            vista === 'dia'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
          }`}
        >
          <Calendar size={18} className={vista === 'dia' ? 'opacity-100' : 'opacity-70'} />
          <span>Día</span>
        </button>
        <button
          onClick={() => onCambiarVista('semana')}
          className={`inline-flex items-center gap-2 flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            vista === 'semana'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
          }`}
        >
          <Calendar size={18} className={vista === 'semana' ? 'opacity-100' : 'opacity-70'} />
          <span>Semana</span>
        </button>
      </div>
    </div>
  );
}



