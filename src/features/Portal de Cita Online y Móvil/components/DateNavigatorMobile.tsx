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
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => (vista === 'dia' ? navegarDia('anterior') : navegarSemana('anterior'))}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fecha anterior"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex-1 text-center">
          <button
            onClick={irHoy}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            {formatearFecha(fechaSeleccionada)}
          </button>
          <button
            onClick={irHoy}
            className="block text-xs text-gray-500 hover:text-blue-500 mt-1"
          >
            Ir a hoy
          </button>
        </div>

        <button
          onClick={() => (vista === 'dia' ? navegarDia('siguiente') : navegarSemana('siguiente'))}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fecha siguiente"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onCambiarVista('dia')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            vista === 'dia'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4 inline-block mr-2" />
          Día
        </button>
        <button
          onClick={() => onCambiarVista('semana')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            vista === 'semana'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4 inline-block mr-2" />
          Semana
        </button>
      </div>
    </div>
  );
}


