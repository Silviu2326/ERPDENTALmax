import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { HorarioRecurrente, ExcepcionDisponibilidad } from '../api/disponibilidadApi';

interface DisponibilidadCalendarViewProps {
  horariosRecurrentes: HorarioRecurrente[];
  excepciones: ExcepcionDisponibilidad[];
  fechaInicio?: Date;
  fechaFin?: Date;
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_SEMANA_COMPLETOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function DisponibilidadCalendarView({
  horariosRecurrentes,
  excepciones,
  fechaInicio,
  fechaFin,
}: DisponibilidadCalendarViewProps) {
  const [fechaActual, setFechaActual] = useState(fechaInicio || new Date());

  // Generar semanas del mes
  const getSemanasDelMes = () => {
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    
    // Ajustar al lunes de la semana que contiene el primer día
    const primerLunes = new Date(primerDiaMes);
    const diaSemanaPrimero = primerDiaMes.getDay();
    primerLunes.setDate(primerDiaMes.getDate() - (diaSemanaPrimero === 0 ? 6 : diaSemanaPrimero - 1));

    const semanas: Date[][] = [];
    let fechaActual = new Date(primerLunes);

    while (fechaActual <= ultimoDiaMes || fechaActual.getMonth() === fechaActual.getMonth()) {
      const semana: Date[] = [];
      for (let i = 0; i < 7; i++) {
        semana.push(new Date(fechaActual));
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
      semanas.push(semana);
      
      // Salir si ya pasamos el último día del mes y estamos en un nuevo mes
      if (fechaActual > ultimoDiaMes && fechaActual.getMonth() !== ultimoDiaMes.getMonth()) {
        break;
      }
    }

    return semanas;
  };

  const esMismoDia = (fecha1: Date, fecha2: Date): boolean => {
    return (
      fecha1.getFullYear() === fecha2.getFullYear() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getDate() === fecha2.getDate()
    );
  };

  const estaEnRango = (fecha: Date, inicio: Date, fin: Date): boolean => {
    return fecha >= inicio && fecha <= fin;
  };

  const tieneExcepcion = (fecha: Date): ExcepcionDisponibilidad | null => {
    return excepciones.find(ex => {
      const fechaInicio = new Date(ex.fechaInicio);
      const fechaFin = new Date(ex.fechaFin);
      
      if (ex.diaCompleto) {
        return esMismoDia(fecha, fechaInicio);
      }
      return estaEnRango(fecha, fechaInicio, fechaFin);
    }) || null;
  };

  const tieneHorarioRecurrente = (fecha: Date): HorarioRecurrente[] => {
    const diaSemana = fecha.getDay();
    return horariosRecurrentes.filter(h => h.activo && h.diaSemana === diaSemana);
  };

  const getColorEstado = (fecha: Date): string => {
    const excepcion = tieneExcepcion(fecha);
    if (excepcion) {
      return excepcion.diaCompleto ? 'bg-red-100 border-red-300' : 'bg-orange-100 border-orange-300';
    }
    
    const horarios = tieneHorarioRecurrente(fecha);
    if (horarios.length > 0) {
      return 'bg-green-100 border-green-300';
    }
    
    return 'bg-gray-50 border-gray-200';
  };

  const getTooltip = (fecha: Date): string => {
    const excepcion = tieneExcepcion(fecha);
    if (excepcion) {
      return excepcion.diaCompleto 
        ? `No disponible (${excepcion.motivo})`
        : `Bloqueado: ${excepcion.motivo}`;
    }
    
    const horarios = tieneHorarioRecurrente(fecha);
    if (horarios.length > 0) {
      const horariosStr = horarios.map(h => `${h.horaInicio}-${h.horaFin}`).join(', ');
      return `Disponible: ${horariosStr}`;
    }
    
    return 'Sin horario definido';
  };

  const navegarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + (direccion === 'siguiente' ? 1 : -1));
    setFechaActual(nuevaFecha);
  };

  const irHoy = () => {
    setFechaActual(new Date());
  };

  const esHoy = (fecha: Date): boolean => {
    return esMismoDia(fecha, new Date());
  };

  const esDelMesActual = (fecha: Date): boolean => {
    return fecha.getMonth() === fechaActual.getMonth();
  };

  const semanas = getSemanasDelMes();
  const nombreMes = fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <CalendarIcon size={20} />
          <span>Vista de Disponibilidad</span>
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navegarMes('anterior')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={irHoy}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={() => navegarMes('siguiente')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-md font-semibold text-gray-800 capitalize">{nombreMes}</h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {DIAS_SEMANA.map((dia) => (
                <th key={dia} className="border border-gray-200 p-2 text-center text-sm font-medium text-slate-700 bg-slate-50">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {semanas.map((semana, semanaIndex) => (
              <tr key={semanaIndex}>
                {semana.map((fecha, diaIndex) => {
                  const esDiaActual = esHoy(fecha);
                  const esDelMes = esDelMesActual(fecha);
                  const excepcion = tieneExcepcion(fecha);
                  const horarios = tieneHorarioRecurrente(fecha);

                  return (
                    <td
                      key={diaIndex}
                      className={`border border-gray-200 p-2 min-w-[100px] h-24 ${getColorEstado(fecha)} ${!esDelMes ? 'opacity-50' : ''} ${esDiaActual ? 'ring-2 ring-blue-500' : ''}`}
                      title={getTooltip(fecha)}
                    >
                      <div className="flex flex-col h-full">
                        <div className={`text-sm font-medium mb-1 ${esDiaActual ? 'text-blue-700' : 'text-gray-700'}`}>
                          {fecha.getDate()}
                        </div>
                        <div className="flex-1 overflow-hidden text-xs space-y-1">
                          {excepcion && (
                            <div className={`px-1 py-0.5 rounded ${excepcion.diaCompleto ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'}`}>
                              {excepcion.motivo.substring(0, 15)}
                            </div>
                          )}
                          {horarios.length > 0 && !excepcion && (
                            <div className="text-green-700 font-medium">
                              {horarios[0].horaInicio}-{horarios[0].horaFin}
                              {horarios.length > 1 && ` +${horarios.length - 1}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
          <span>Bloqueo parcial</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span>No disponible (día completo)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
          <span>Sin horario</span>
        </div>
      </div>
    </div>
  );
}



