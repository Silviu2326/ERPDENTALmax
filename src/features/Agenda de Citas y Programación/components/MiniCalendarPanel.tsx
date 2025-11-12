import { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniCalendarPanelProps {
  fechaActual?: Date;
  onDatePicked: (fecha: Date) => void;
}

export default function MiniCalendarPanel({
  fechaActual = new Date(),
  onDatePicked,
}: MiniCalendarPanelProps) {
  const [mesActual, setMesActual] = useState(fechaActual.getMonth());
  const [anioActual, setAnioActual] = useState(fechaActual.getFullYear());

  const nombreMeses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const nombreDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const diasDelMes = useMemo(() => {
    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const dias: Array<{ dia: number; fecha: Date; esHoy: boolean; esSeleccionado: boolean }> = [];

    const mesAnterior = new Date(anioActual, mesActual, 0);
    const diasMesAnterior = mesAnterior.getDate();
    for (let i = diaInicioSemana - 1; i >= 0; i--) {
      const fecha = new Date(anioActual, mesActual - 1, diasMesAnterior - i);
      dias.push({
        dia: diasMesAnterior - i,
        fecha,
        esHoy: false,
        esSeleccionado: false,
      });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(fechaActual);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(anioActual, mesActual, dia);
      const esHoy = fecha.toDateString() === hoy.toDateString();
      const esSeleccionado = fecha.toDateString() === fechaSeleccionada.toDateString();
      dias.push({
        dia,
        fecha,
        esHoy,
        esSeleccionado,
      });
    }

    const diasRestantes = 42 - dias.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const fecha = new Date(anioActual, mesActual + 1, dia);
      dias.push({
        dia,
        fecha,
        esHoy: false,
        esSeleccionado: false,
      });
    }

    return dias;
  }, [anioActual, mesActual, fechaActual]);

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    if (direccion === 'anterior') {
      if (mesActual === 0) {
        setMesActual(11);
        setAnioActual(anioActual - 1);
      } else {
        setMesActual(mesActual - 1);
      }
    } else {
      if (mesActual === 11) {
        setMesActual(0);
        setAnioActual(anioActual + 1);
      } else {
        setMesActual(mesActual + 1);
      }
    }
  };

  const irHoy = () => {
    const hoy = new Date();
    setMesActual(hoy.getMonth());
    setAnioActual(hoy.getFullYear());
    onDatePicked(hoy);
  };

  const handleDiaClick = (fecha: Date) => {
    onDatePicked(fecha);
  };

  return (
    <div className="fixed left-4 sm:left-56 lg:left-72 top-20 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {nombreMeses[mesActual]} {anioActual}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => cambiarMes('anterior')}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={irHoy}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Hoy
        </button>
        <button
          onClick={() => cambiarMes('siguiente')}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Mes siguiente"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {nombreDias.map((dia) => (
          <div key={dia} className="text-center text-xs font-semibold text-gray-500 py-1">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {diasDelMes.map((item, index) => {
          const esMesActual = item.fecha.getMonth() === mesActual;
          const esHoy = item.esHoy;
          const esSeleccionado = item.esSeleccionado;

          return (
            <button
              key={index}
              onClick={() => handleDiaClick(item.fecha)}
              className={`aspect-square p-1 text-sm rounded-lg transition-all
                ${!esMesActual ? 'text-gray-300' : 'text-gray-700'}
                ${esHoy ? 'bg-blue-100 font-bold text-blue-700 ring-2 ring-blue-400' : ''}
                ${esSeleccionado && !esHoy ? 'bg-blue-600 text-white font-semibold' : ''}
                ${!esHoy && !esSeleccionado && esMesActual ? 'hover:bg-gray-100 hover:text-gray-900' : ''}`}
              title={item.fecha.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            >
              {item.dia}
            </button>
          );
        })}
      </div>
    </div>
  );
}
