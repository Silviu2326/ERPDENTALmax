import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

interface MiniCalendarPanelProps {
  fechaActual?: Date;
  onDatePicked: (fecha: Date) => void;
  onClose: () => void;
}

/**
 * Componente MiniCalendarPanel
 * 
 * Muestra un mini calendario mensual anclado en la agenda que permite
 * saltar rápidamente a cualquier día. Al seleccionar una fecha, emite
 * el evento onDatePicked y registra métricas de uso.
 * 
 * @param fechaActual - Fecha actualmente seleccionada (opcional)
 * @param onDatePicked - Callback que se ejecuta cuando se selecciona una fecha
 * @param onClose - Callback para cerrar el panel
 */
export default function MiniCalendarPanel({
  fechaActual = new Date(),
  onDatePicked,
  onClose,
}: MiniCalendarPanelProps) {
  const [mesActual, setMesActual] = useState(fechaActual.getMonth());
  const [anioActual, setAnioActual] = useState(fechaActual.getFullYear());
  const panelRef = useRef<HTMLDivElement>(null);

  // Cerrar el panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const nombreMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const nombreDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Calcular los días del mes
  const diasDelMes = useMemo(() => {
    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const dias: Array<{ dia: number; fecha: Date; esHoy: boolean; esSeleccionado: boolean }> = [];

    // Días del mes anterior para completar la primera semana
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

    // Días del mes actual
    const hoy = new Date();
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(anioActual, mesActual, dia);
      const esHoy = fecha.toDateString() === hoy.toDateString();
      const esSeleccionado = fecha.toDateString() === fechaActual.toDateString();
      dias.push({
        dia,
        fecha,
        esHoy,
        esSeleccionado,
      });
    }

    // Días del mes siguiente para completar la última semana
    const diasRestantes = 42 - dias.length; // 6 semanas * 7 días = 42
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
  }, [mesActual, anioActual, fechaActual]);

  const handleDiaClick = (fecha: Date) => {
    // Registrar métrica de uso
    try {
      const metricData = {
        event: 'mini_calendar_date_picked',
        fecha: fecha.toISOString(),
        timestamp: new Date().toISOString(),
        mes: mesActual + 1,
        anio: anioActual,
      };
      
      // Guardar en localStorage para análisis posterior
      const existingMetrics = JSON.parse(
        localStorage.getItem('agenda_metrics') || '[]'
      );
      existingMetrics.push(metricData);
      
      // Mantener solo las últimas 100 métricas
      const recentMetrics = existingMetrics.slice(-100);
      localStorage.setItem('agenda_metrics', JSON.stringify(recentMetrics));
      
      // También intentar enviar a un endpoint de analytics si existe
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('mini_calendar_date_picked', metricData);
      }
    } catch (error) {
      console.warn('Error al registrar métrica de uso:', error);
    }

    // Emitir evento onDatePicked
    onDatePicked(fecha);
  };

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
    handleDiaClick(hoy);
  };

  return (
    <div 
      ref={panelRef}
      className="fixed right-4 top-20 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {nombreMeses[mesActual]} {anioActual}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          title="Cerrar calendario"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Navegación de mes */}
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

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {nombreDias.map((dia) => (
          <div
            key={dia}
            className="text-center text-xs font-semibold text-gray-500 py-1"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-1">
        {diasDelMes.map((item, index) => {
          const esMesActual = item.fecha.getMonth() === mesActual;
          const esHoy = item.esHoy;
          const esSeleccionado = item.esSeleccionado;

          return (
            <button
              key={index}
              onClick={() => handleDiaClick(item.fecha)}
              className={`
                aspect-square p-1 text-sm rounded-lg transition-all
                ${!esMesActual ? 'text-gray-300' : 'text-gray-700'}
                ${esHoy ? 'bg-blue-100 font-bold text-blue-700 ring-2 ring-blue-400' : ''}
                ${esSeleccionado && !esHoy ? 'bg-blue-600 text-white font-semibold' : ''}
                ${!esHoy && !esSeleccionado && esMesActual
                  ? 'hover:bg-gray-100 hover:text-gray-900'
                  : ''
                }
              `}
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

