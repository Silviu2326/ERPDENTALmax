import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Cita, moverCita } from '../api/citasApi';
import CitaCardSemanal from './CitaCardSemanal';

interface SemanaCalendarioGridProps {
  citas: Cita[];
  fechaInicio: Date;
  fechaFin: Date;
  onCitaClick: (cita: Cita) => void;
  onSlotClick: (fecha: Date, hora: string) => void;
  onCitaMovida?: (cita: Cita) => void;
}

export default function SemanaCalendarioGrid({
  citas,
  fechaInicio,
  fechaFin,
  onCitaClick,
  onSlotClick,
  onCitaMovida,
}: SemanaCalendarioGridProps) {
  const [citaArrastrando, setCitaArrastrando] = useState<Cita | null>(null);
  const [slotSobre, setSlotSobre] = useState<{ fecha: Date; hora: string } | null>(null);

  // Generar días de la semana (lunes a domingo)
  const getDiasSemana = () => {
    const dias: Date[] = [];
    const inicio = new Date(fechaInicio);
    
    // Asegurar que empezamos en lunes
    const diaSemana = inicio.getDay();
    const lunes = new Date(inicio);
    lunes.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
    lunes.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      dias.push(dia);
    }
    
    return dias;
  };

  // Generar horas del día (8:00 a 21:00)
  const horasDelDia = Array.from({ length: 14 }, (_, i) => {
    const hora = 8 + i;
    return `${hora.toString().padStart(2, '0')}:00`;
  });

  const dias = getDiasSemana();
  const nombreDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Obtener citas para un día y hora específicos
  const getCitasPorDiaYHora = (dia: Date, hora: string) => {
    const [horaStr, minutoStr] = hora.split(':');
    const horaInicio = new Date(dia);
    horaInicio.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);
    const horaFin = new Date(horaInicio);
    horaFin.setHours(horaFin.getHours() + 1);

    return citas.filter((cita) => {
      const fechaInicioCita = new Date(cita.fecha_hora_inicio);
      const fechaFinCita = new Date(cita.fecha_hora_fin);
      
      // Verificar si la cita se solapa con este slot
      return (
        fechaInicioCita < horaFin &&
        fechaFinCita > horaInicio &&
        fechaInicioCita.toDateString() === dia.toDateString()
      );
    });
  };

  // Manejar inicio de arrastre
  const handleDragStart = (e: React.DragEvent, cita: Cita) => {
    setCitaArrastrando(cita);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cita._id || '');
  };

  // Manejar arrastre sobre un slot
  const handleDragOver = (e: React.DragEvent, dia: Date, hora: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setSlotSobre({ fecha: dia, hora });
  };

  // Manejar fin de arrastre
  const handleDragEnd = () => {
    setCitaArrastrando(null);
    setSlotSobre(null);
  };

  // Manejar soltar cita
  const handleDrop = async (e: React.DragEvent, dia: Date, hora: string) => {
    e.preventDefault();
    
    if (!citaArrastrando) return;

    const [horaStr, minutoStr] = hora.split(':');
    const nuevaFechaHora = new Date(dia);
    nuevaFechaHora.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);

    try {
      // Calcular nueva fecha fin (mantener duración original)
      const fechaInicioOriginal = new Date(citaArrastrando.fecha_hora_inicio);
      const fechaFinOriginal = new Date(citaArrastrando.fecha_hora_fin);
      const duracionMinutos = Math.round(
        (fechaFinOriginal.getTime() - fechaInicioOriginal.getTime()) / (1000 * 60)
      );
      
      const nuevaFechaFin = new Date(nuevaFechaHora);
      nuevaFechaFin.setMinutes(nuevaFechaFin.getMinutes() + duracionMinutos);

      // Mover la cita
      const citaActualizada = await moverCita(
        citaArrastrando._id!,
        nuevaFechaHora.toISOString()
      );

      if (onCitaMovida) {
        onCitaMovida(citaActualizada);
      }
    } catch (error) {
      console.error('Error al mover la cita:', error);
      alert('No se pudo mover la cita. Verifique que no haya conflictos de horario.');
    } finally {
      setCitaArrastrando(null);
      setSlotSobre(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header con días */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {dias.map((dia, index) => {
          const esHoy = dia.toDateString() === new Date().toDateString();
          return (
            <div
              key={index}
              className={`p-3 text-center border-r border-gray-200 last:border-r-0 ${
                esHoy ? 'bg-blue-50 font-semibold' : ''
              }`}
            >
              <div className="text-xs text-gray-500 uppercase mb-1">
                {nombreDias[index]}
              </div>
              <div className={`text-lg ${esHoy ? 'text-blue-600' : 'text-gray-800'}`}>
                {dia.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid de horas y días */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 min-w-full">
          {dias.map((dia, diaIndex) => (
            <div
              key={diaIndex}
              className="border-r border-gray-200 last:border-r-0 min-h-[800px]"
            >
              {horasDelDia.map((hora, horaIndex) => {
                const citasEnSlot = getCitasPorDiaYHora(dia, hora);
                const esHoy = dia.toDateString() === new Date().toDateString();
                const horaActual = new Date().getHours();
                const [horaSlot] = hora.split(':');
                const esHoraPasada = esHoy && parseInt(horaSlot) < horaActual;
                const esSlotSobre = slotSobre?.fecha.toDateString() === dia.toDateString() && 
                                   slotSobre?.hora === hora;

                return (
                  <div
                    key={horaIndex}
                    onDragOver={(e) => handleDragOver(e, dia, hora)}
                    onDrop={(e) => handleDrop(e, dia, hora)}
                    onDragLeave={() => {
                      if (slotSobre?.fecha.toDateString() === dia.toDateString() && 
                          slotSobre?.hora === hora) {
                        setSlotSobre(null);
                      }
                    }}
                    className={`border-b border-gray-100 p-2 min-h-[80px] relative group ${
                      esHoraPasada 
                        ? 'bg-gray-50 opacity-60' 
                        : esSlotSobre
                        ? 'bg-blue-100 border-blue-300 border-2'
                        : 'hover:bg-blue-50/30'
                    } transition-colors`}
                  >
                    <div className="text-xs text-gray-400 mb-1">{hora}</div>
                    <div className="space-y-1">
                      {citasEnSlot.map((cita) => (
                        <div
                          key={cita._id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, cita)}
                          onDragEnd={handleDragEnd}
                          className="cursor-move"
                        >
                          <CitaCardSemanal
                            cita={cita}
                            onClick={() => onCitaClick(cita)}
                          />
                        </div>
                      ))}
                      {citasEnSlot.length === 0 && !esHoraPasada && (
                        <button
                          onClick={() => onSlotClick(dia, hora)}
                          className="w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-blue-600 hover:text-blue-700"
                          title="Hacer clic para crear nueva cita"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



