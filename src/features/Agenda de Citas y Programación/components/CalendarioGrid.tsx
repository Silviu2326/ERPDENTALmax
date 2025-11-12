import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Cita } from '../api/citasApi';
import CitaBlock from './CitaBlock';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDroppable, closestCenter } from '@dnd-kit/core';
import { useSensors, useSensor, PointerSensor, MouseSensor } from '@dnd-kit/core';

interface CalendarioGridProps {
  citas: Cita[];
  fechaInicio: Date;
  fechaFin: Date;
  vista: 'dia' | 'semana' | 'mes';
  onCitaClick: (cita: Cita) => void;
  onSlotClick: (fecha: Date, hora: string) => void;
  onCitaReprogramada?: (citaId: string, nuevaFecha: Date, nuevaHora: string, profesionalId?: string, boxId?: string) => void;
  onCitaResizeStart?: (cita: Cita) => void;
  onCitaResizeEnd?: (cita: Cita, nuevaDuracionMinutos: number) => void;
  visibleDays?: number; // Número de días visibles (1, 3, 5, 7)
  groupBy?: 'profesional' | 'box'; // Agrupar por profesionales o boxes
  timeSlotDuration?: 10 | 15 | 30; // Duración de cada slot en minutos
  visibleHours?: { start: number; end: number }; // Rango horario visible
  profesionales?: Array<{ _id: string; nombre: string; apellidos: string; especialidad?: string }>; // Lista de profesionales para agrupación
  userRole?: string; // Rol del usuario para validaciones
  tratamientos?: Array<{ _id: string; nombre: string; duracionEstimadaMinutos: number }>; // Lista de tratamientos para obtener duración mínima
  citaDestacada?: string | null; // ID de la cita que debe destacarse
}

// Componente para slot droppable
function DroppableSlot({ 
  id, 
  dia, 
  hora, 
  columnaId, 
  children, 
  isOver 
}: { 
  id: string; 
  dia: Date; 
  hora: string; 
  columnaId?: string; 
  children: React.ReactNode;
  isOver?: boolean;
}) {
  const { setNodeRef, isOver: isOverDroppable } = useDroppable({
    id,
    data: {
      dia,
      hora,
      columnaId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${isOver || isOverDroppable ? 'bg-blue-100 ring-2 ring-blue-400 ring-opacity-50' : ''}`}
    >
      {children}
    </div>
  );
}

export default function CalendarioGrid({
  citas,
  fechaInicio,
  fechaFin,
  vista,
  onCitaClick,
  onSlotClick,
  onCitaReprogramada,
  onCitaResizeStart,
  onCitaResizeEnd,
  visibleDays = 7, // Por defecto 7 días (semana completa)
  groupBy = 'profesional',
  timeSlotDuration = 30,
  visibleHours = { start: 7, end: 20 },
  profesionales = [],
  userRole,
  tratamientos = [],
  citaDestacada = null,
}: CalendarioGridProps) {
  const [fechaActual, setFechaActual] = useState(new Date(fechaInicio));
  const [activeCita, setActiveCita] = useState<Cita | null>(null);

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requiere 8px de movimiento antes de activar
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const citaData = active.data.current?.cita as Cita | undefined;
    if (citaData) {
      setActiveCita(citaData);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCita(null);

    if (!over) return;

    const citaData = active.data.current?.cita as Cita | undefined;
    const dropData = over.data.current as { dia?: Date; hora?: string; columnaId?: string } | undefined;

    if (!citaData || !dropData?.dia || !dropData?.hora) return;

    // Validaciones básicas
    if (citaData.estado === 'realizada' || citaData.estado === 'cancelada') {
      return;
    }

    // Si hay columna (profesional o box), verificar permisos
    if (dropData.columnaId) {
      const esCoordinador = userRole === 'director' || userRole === 'propietario';
      const esRecepcionista = userRole === 'recepcionista';

      if (groupBy === 'profesional') {
        const nuevoProfesionalId = dropData.columnaId;
        const profesionalOriginalId = citaData.profesional._id;

        // Recepcionista solo puede mover dentro del mismo profesional
        if (esRecepcionista && nuevoProfesionalId !== profesionalOriginalId) {
          alert('Los recepcionistas solo pueden mover citas dentro del mismo profesional.');
          return;
        }

        // Coordinador puede mover entre profesionales, pero validar capacidad
        if (esCoordinador && nuevoProfesionalId !== profesionalOriginalId) {
          // Validar que el profesional puede realizar el tratamiento
          const nuevoProfesional = profesionales.find(p => p._id === nuevoProfesionalId);
          if (nuevoProfesional && citaData.tratamiento) {
            // Aquí se podría añadir validación de especialidad/tratamiento
            // Por ahora, permitimos el movimiento
          }
        }
      } else if (groupBy === 'box') {
        const nuevoBoxId = dropData.columnaId;
        const boxOriginalId = citaData.box_asignado;

        // Recepcionista solo puede mover dentro del mismo box
        if (esRecepcionista && nuevoBoxId !== boxOriginalId) {
          alert('Los recepcionistas solo pueden mover citas dentro del mismo box.');
          return;
        }
      }
    }

    // Llamar al handler de reprogramación
    if (onCitaReprogramada) {
      const nuevoProfesionalId = groupBy === 'profesional' && dropData.columnaId ? dropData.columnaId : undefined;
      const nuevoBoxId = groupBy === 'box' && dropData.columnaId ? dropData.columnaId : undefined;
      
      onCitaReprogramada(
        citaData._id!,
        dropData.dia,
        dropData.hora,
        nuevoProfesionalId,
        nuevoBoxId
      );
    }
  };

  // Generar horas del día basadas en timeSlotDuration y visibleHours
  const horasDelDia = useMemo(() => {
    const horas: string[] = [];
    const totalMinutos = (visibleHours.end - visibleHours.start) * 60;
    const numSlots = Math.floor(totalMinutos / timeSlotDuration);
    
    for (let i = 0; i < numSlots; i++) {
      const minutosTotales = visibleHours.start * 60 + i * timeSlotDuration;
      const hora = Math.floor(minutosTotales / 60);
      const minuto = minutosTotales % 60;
      horas.push(`${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`);
    }
    
    return horas;
  }, [timeSlotDuration, visibleHours]);

  // Obtener columnas según el modo de agrupación
  const getColumnas = useMemo(() => {
    if (groupBy === 'box') {
      // Agrupar por boxes
      const boxes = new Set<string>();
      citas.forEach(cita => {
        if (cita.box_asignado) {
          boxes.add(cita.box_asignado);
        }
      });
      const boxesArray = Array.from(boxes).sort((a, b) => {
        // Ordenar numéricamente si son números, alfabéticamente si son letras
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.localeCompare(b);
      });
      return boxesArray.map(box => ({ type: 'box' as const, id: box, label: `Box ${box}` }));
    } else {
      // Agrupar por profesionales
      return profesionales.map(prof => ({
        type: 'profesional' as const,
        id: prof._id,
        label: `${prof.nombre} ${prof.apellidos}`
      }));
    }
  }, [groupBy, citas, profesionales]);

  const getDiasVista = () => {
    const dias: Date[] = [];
    const inicio = new Date(fechaActual);
    
    if (vista === 'dia') {
      dias.push(new Date(inicio));
    } else if (vista === 'semana') {
      // Calcular el número de días a mostrar basado en visibleDays
      const numDias = visibleDays && [1, 3, 5, 7].includes(visibleDays) ? visibleDays : 7;
      
      // Si es 1 día, mostrar solo el día actual
      if (numDias === 1) {
        dias.push(new Date(inicio));
      } else {
        // Para otros casos, calcular desde el lunes de la semana
        const diaSemana = inicio.getDay();
        const lunes = new Date(inicio);
        lunes.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
        
        // Si visibleDays es 3 o 5, centrar alrededor del día actual
        if (numDias === 3) {
          // Mostrar día anterior, actual y siguiente
          const diaAnterior = new Date(inicio);
          diaAnterior.setDate(inicio.getDate() - 1);
          dias.push(diaAnterior);
          dias.push(new Date(inicio));
          const diaSiguiente = new Date(inicio);
          diaSiguiente.setDate(inicio.getDate() + 1);
          dias.push(diaSiguiente);
        } else if (numDias === 5) {
          // Mostrar 2 días antes, actual y 2 días después
          for (let i = -2; i <= 2; i++) {
            const dia = new Date(inicio);
            dia.setDate(inicio.getDate() + i);
            dias.push(dia);
          }
        } else {
          // 7 días: semana completa desde el lunes
          for (let i = 0; i < 7; i++) {
            const dia = new Date(lunes);
            dia.setDate(lunes.getDate() + i);
            dias.push(dia);
          }
        }
      }
    } else {
      // Mes: mostrar solo la semana actual simplificada
      const diaSemana = inicio.getDay();
      const lunes = new Date(inicio);
      lunes.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
      
      const numDias = visibleDays && [1, 3, 5, 7].includes(visibleDays) ? visibleDays : 7;
      
      if (numDias === 1) {
        dias.push(new Date(inicio));
      } else if (numDias === 3) {
        const diaAnterior = new Date(inicio);
        diaAnterior.setDate(inicio.getDate() - 1);
        dias.push(diaAnterior);
        dias.push(new Date(inicio));
        const diaSiguiente = new Date(inicio);
        diaSiguiente.setDate(inicio.getDate() + 1);
        dias.push(diaSiguiente);
      } else if (numDias === 5) {
        for (let i = -2; i <= 2; i++) {
          const dia = new Date(inicio);
          dia.setDate(inicio.getDate() + i);
          dias.push(dia);
        }
      } else {
        for (let i = 0; i < 7; i++) {
          const dia = new Date(lunes);
          dia.setDate(lunes.getDate() + i);
          dias.push(dia);
        }
      }
    }
    
    return dias;
  };

  const getCitasPorDiaYHoraYColumna = (dia: Date, hora: string, columnaId: string) => {
    const [horaStr, minutoStr] = hora.split(':');
    const horaInicio = new Date(dia);
    horaInicio.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);
    const horaFin = new Date(horaInicio);
    horaFin.setMinutes(horaFin.getMinutes() + timeSlotDuration);

    return citas.filter((cita) => {
      const fechaInicioCita = new Date(cita.fecha_hora_inicio);
      const fechaFinCita = new Date(cita.fecha_hora_fin);
      
      // Verificar si la cita se solapa con el slot de tiempo
      const seSolapa = (
        (fechaInicioCita >= horaInicio && fechaInicioCita < horaFin) ||
        (fechaFinCita > horaInicio && fechaFinCita <= horaFin) ||
        (fechaInicioCita <= horaInicio && fechaFinCita >= horaFin)
      );
      
      // Verificar que sea del día correcto
      const mismoDia = fechaInicioCita.toDateString() === dia.toDateString();
      
      // Verificar que coincida con la columna (profesional o box)
      const coincideColumna = groupBy === 'box' 
        ? cita.box_asignado === columnaId
        : cita.profesional._id === columnaId;
      
      return seSolapa && mismoDia && coincideColumna;
    });
  };
  
  // Mantener función original para compatibilidad
  const getCitasPorDiaYHora = (dia: Date, hora: string) => {
    const [horaStr, minutoStr] = hora.split(':');
    const horaInicio = new Date(dia);
    horaInicio.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);
    const horaFin = new Date(horaInicio);
    horaFin.setMinutes(horaFin.getMinutes() + timeSlotDuration);

    return citas.filter((cita) => {
      const fechaInicioCita = new Date(cita.fecha_hora_inicio);
      const fechaFinCita = new Date(cita.fecha_hora_fin);
      
      const seSolapa = (
        (fechaInicioCita >= horaInicio && fechaInicioCita < horaFin) ||
        (fechaFinCita > horaInicio && fechaFinCita <= horaFin) ||
        (fechaInicioCita <= horaInicio && fechaFinCita >= horaFin)
      );
      
      return seSolapa && fechaInicioCita.toDateString() === dia.toDateString();
    });
  };
  
  const getTotalCitasDia = (dia: Date) => {
    return citas.filter((cita) => {
      const fechaCita = new Date(cita.fecha_hora_inicio);
      return fechaCita.toDateString() === dia.toDateString();
    }).length;
  };
  
  const getResumenDia = (dia: Date) => {
    const citasDelDia = citas.filter((cita) => {
      const fechaCita = new Date(cita.fecha_hora_inicio);
      return fechaCita.toDateString() === dia.toDateString();
    });
    
    const total = citasDelDia.length;
    const confirmadas = citasDelDia.filter(c => c.estado === 'confirmada').length;
    const programadas = citasDelDia.filter(c => c.estado === 'programada').length;
    const urgentes = citasDelDia.filter(c => c.notas?.toLowerCase().includes('urgente')).length;
    const duracionTotal = citasDelDia.reduce((sum, c) => sum + c.duracion_minutos, 0);
    
    return { total, confirmadas, programadas, urgentes, duracionTotal };
  };
  
  const dias = getDiasVista();
  
  const resumenSemana = useMemo(() => {
    const resumen = dias.map(dia => getResumenDia(dia));
    const totalSemana = resumen.reduce((sum, r) => sum + r.total, 0);
    const confirmadasSemana = resumen.reduce((sum, r) => sum + r.confirmadas, 0);
    const urgentesSemana = resumen.reduce((sum, r) => sum + r.urgentes, 0);
    const horasTotales = resumen.reduce((sum, r) => sum + r.duracionTotal, 0) / 60;
    
    return { totalSemana, confirmadasSemana, urgentesSemana, horasTotales };
  }, [dias, citas]);

  const navegarFecha = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    if (vista === 'dia') {
      nuevaFecha.setDate(nuevaFecha.getDate() + (direccion === 'siguiente' ? 1 : -1));
    } else if (vista === 'semana') {
      nuevaFecha.setDate(nuevaFecha.getDate() + (direccion === 'siguiente' ? 7 : -7));
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + (direccion === 'siguiente' ? 1 : -1));
    }
    setFechaActual(nuevaFecha);
  };

  const irHoy = () => {
    setFechaActual(new Date());
  };
  const nombreDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const nombreMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getTituloVista = () => {
    if (vista === 'dia') {
      return fechaActual.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } else if (vista === 'semana') {
      const inicioSemana = dias[0];
      const finSemana = dias[dias.length - 1];
      return `${inicioSemana.getDate()} - ${finSemana.getDate()} de ${nombreMeses[inicioSemana.getMonth()]} ${inicioSemana.getFullYear()}`;
    } else {
      return `${nombreMeses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navegarFecha('anterior')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:shadow-md"
              title={vista === 'dia' ? 'Día anterior' : vista === 'semana' ? 'Semana anterior' : 'Mes anterior'}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 capitalize">
              {getTituloVista()}
            </h3>
            <button
              onClick={() => navegarFecha('siguiente')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:shadow-md"
              title={vista === 'dia' ? 'Día siguiente' : vista === 'semana' ? 'Semana siguiente' : 'Mes siguiente'}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={irHoy}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Hoy</span>
          </button>
        </div>
        
        {/* Resumen de la semana/día */}
        {vista === 'semana' && resumenSemana.totalSemana > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Semana</p>
                  <p className="text-lg font-bold text-blue-700">{resumenSemana.totalSemana}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 border border-green-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Confirmadas</p>
                  <p className="text-lg font-bold text-green-700">{resumenSemana.confirmadasSemana}</p>
                </div>
              </div>
            </div>
            {resumenSemana.urgentesSemana > 0 && (
              <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-xs text-gray-600">Urgentes</p>
                    <p className="text-lg font-bold text-red-700">{resumenSemana.urgentesSemana}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-600">Horas Totales</p>
                  <p className="text-lg font-bold text-purple-700">{Math.round(resumenSemana.horasTotales * 10) / 10}h</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header con días y columnas de agrupación */}
          {groupBy === 'profesional' || groupBy === 'box' ? (
            // Vista agrupada: días x columnas (profesionales/boxes)
            <>
              {/* Header: una fila con días, cada día tiene sub-columnas para grupos */}
              <div 
                className="grid border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white"
                style={{ gridTemplateColumns: `80px repeat(${dias.length * getColumnas.length}, 1fr)` }}
              >
                {/* Celda vacía para el header de horas */}
                <div className="p-3 border-r border-gray-200"></div>
                {/* Headers de días con sub-columnas */}
                {dias.map((dia, diaIndex) => {
                  const esHoy = dia.toDateString() === new Date().toDateString();
                  const totalCitas = getTotalCitasDia(dia);
                  const esFinDeSemana = dia.getDay() === 0 || dia.getDay() === 6;
                  
                  const startCol = 1 + diaIndex * getColumnas.length + 1;
                  const endCol = startCol + getColumnas.length;
                  
                  return (
                    <div
                      key={`day-header-${diaIndex}`}
                      className={`p-3 text-center border-r border-gray-200 ${
                        esHoy
                          ? 'bg-gradient-to-br from-blue-100 to-blue-50 font-semibold ring-2 ring-blue-400'
                          : esFinDeSemana
                          ? 'bg-gradient-to-br from-gray-100 to-gray-50'
                          : 'bg-white'
                      }`}
                      style={{ gridColumn: `${startCol} / ${endCol}` }}
                    >
                      <div className={`text-xs uppercase mb-1 ${
                        esHoy ? 'text-blue-700 font-bold' : 'text-gray-500'
                      }`}>
                        {nombreDias[dia.getDay()]}
                      </div>
                      <div className={`text-lg font-bold ${
                        esHoy ? 'text-blue-700' : 'text-gray-800'
                      }`}>
                        {dia.getDate()}
                      </div>
                      {totalCitas > 0 && (
                        <div className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-block ${
                          esHoy 
                            ? 'bg-blue-200 text-blue-800' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {totalCitas} {totalCitas === 1 ? 'cita' : 'citas'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Segunda fila: headers de grupos (profesionales/boxes) por día */}
              <div 
                className="grid border-b border-gray-200 bg-white"
                style={{ gridTemplateColumns: `80px repeat(${dias.length * getColumnas.length}, 1fr)` }}
              >
                {/* Celda vacía para el header de horas */}
                <div className="p-2 border-r border-gray-200"></div>
                {/* Headers de grupos para cada día */}
                {dias.map((dia, diaIndex) => (
                  getColumnas.map((col, colIndex) => {
                    const colPosition = 1 + diaIndex * getColumnas.length + colIndex + 1;
                    return (
                      <div
                        key={`${diaIndex}-${colIndex}`}
                        className="p-2 text-center border-r border-gray-200 bg-white text-xs font-medium text-gray-700"
                        style={{ gridColumn: colPosition }}
                      >
                        {col.label}
                      </div>
                    );
                  })
                ))}
              </div>
              
              {/* Grid principal: horas x (días x grupos) */}
              {horasDelDia.map((hora, horaIndex) => (
                <div
                  key={`row-${horaIndex}`}
                  className={`grid border-b border-gray-100 ${
                    horaIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                  style={{ gridTemplateColumns: `80px repeat(${dias.length * getColumnas.length}, 1fr)` }}
                >
                  {/* Columna de horas */}
                  <div className="p-2 border-r border-gray-200 text-xs font-medium text-gray-500">
                    {hora}
                  </div>
                  
                  {/* Celdas por día y grupo */}
                  {dias.map((dia, diaIndex) => (
                    getColumnas.map((col, colIndex) => {
                      const citasEnSlot = getCitasPorDiaYHoraYColumna(dia, hora, col.id);
                      const esHoy = dia.toDateString() === new Date().toDateString();
                      const ahora = new Date();
                      const [horaSlot, minutoSlot] = hora.split(':').map(Number);
                      const horaSlotDate = new Date(dia);
                      horaSlotDate.setHours(horaSlot, minutoSlot, 0, 0);
                      const esHoraPasada = esHoy && horaSlotDate < ahora;
                      const esHoraActual = esHoy && 
                        ahora.getHours() === horaSlot && 
                        ahora.getMinutes() >= minutoSlot && 
                        ahora.getMinutes() < minutoSlot + timeSlotDuration;
                      const colPosition = 1 + diaIndex * getColumnas.length + colIndex + 1;

                      const slotId = `slot-${diaIndex}-${colIndex}-${horaIndex}`;
                      return (
                        <DroppableSlot
                          key={slotId}
                          id={slotId}
                          dia={dia}
                          hora={hora}
                          columnaId={col.id}
                        >
                          <div
                            className={`border-r border-gray-100 p-1 min-h-[60px] ${
                              esHoraActual 
                                ? 'bg-yellow-50 ring-2 ring-yellow-300 ring-opacity-50' 
                                : esHoraPasada 
                                ? 'bg-gray-50/50 opacity-70' 
                                : 'hover:bg-blue-50/40'
                            } transition-all relative group`}
                            style={{ gridColumn: colPosition }}
                          >
                            <div className="space-y-0.5">
                              {citasEnSlot.map((cita) => {
                                const tratamiento = tratamientos.find(t => t._id === cita.tratamiento?._id);
                                const duracionMinima = tratamiento?.duracionEstimadaMinutos || 15;
                                return (
                                  <CitaBlock
                                    key={cita._id}
                                    cita={cita}
                                    onClick={() => onCitaClick(cita)}
                                    onResizeStart={onCitaResizeStart}
                                    onResizeEnd={onCitaResizeEnd}
                                    duracionMinimaMinutos={duracionMinima}
                                    timeSlotDuration={timeSlotDuration}
                                    citasEnSlot={citasEnSlot}
                                    destacada={citaDestacada === cita._id}
                                  />
                                );
                              })}
                              {citasEnSlot.length === 0 && !esHoraPasada && (
                                <button
                                  onClick={() => onSlotClick(dia, hora)}
                                  className="w-full h-full min-h-[40px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-blue-600 hover:text-blue-700 border-2 border-dashed border-blue-300 rounded hover:bg-blue-50/50"
                                  title="Hacer clic para crear nueva cita"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  <span className="text-xs">Nueva cita</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </DroppableSlot>
                      );
                    })
                  ))}
                </div>
              ))}
            </>
          ) : (
            // Vista original: solo días
            <div className={`grid border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white`}
                 style={{ gridTemplateColumns: `repeat(${dias.length}, minmax(0, 1fr))` }}>
              {dias.map((dia, index) => {
              const esHoy = dia.toDateString() === new Date().toDateString();
              const totalCitas = getTotalCitasDia(dia);
              const esFinDeSemana = dia.getDay() === 0 || dia.getDay() === 6;
              
              return (
                <div
                  key={index}
                  className={`p-3 text-center border-r border-gray-200 last:border-r-0 ${
                    esHoy
                      ? 'bg-gradient-to-br from-blue-100 to-blue-50 font-semibold ring-2 ring-blue-400'
                      : esFinDeSemana
                      ? 'bg-gradient-to-br from-gray-100 to-gray-50'
                      : 'bg-white'
                  }`}
                >
                  <div className={`text-xs uppercase mb-1 ${
                    esHoy ? 'text-blue-700 font-bold' : 'text-gray-500'
                  }`}>
                    {nombreDias[dia.getDay()]}
                  </div>
                  <div className={`text-lg font-bold ${
                    esHoy ? 'text-blue-700' : 'text-gray-800'
                  }`}>
                    {dia.getDate()}
                  </div>
                  {totalCitas > 0 && (
                    <div className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-block ${
                      esHoy 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {totalCitas} {totalCitas === 1 ? 'cita' : 'citas'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid"
               style={{ gridTemplateColumns: `repeat(${dias.length}, minmax(0, 1fr))` }}>
            {dias.map((dia, diaIndex) => (
              <div
                key={diaIndex}
                className="border-r border-gray-200 last:border-r-0 min-h-[1400px]"
              >
                {horasDelDia.map((hora, horaIndex) => {
                  const citasEnSlot = getCitasPorDiaYHora(dia, hora);
                  const esHoy = dia.toDateString() === new Date().toDateString();
                  const ahora = new Date();
                  const [horaSlot, minutoSlot] = hora.split(':').map(Number);
                  const horaSlotDate = new Date(dia);
                  horaSlotDate.setHours(horaSlot, minutoSlot, 0, 0);
                  const esHoraPasada = esHoy && horaSlotDate < ahora;
                  const esHoraActual = esHoy && 
                    ahora.getHours() === horaSlot && 
                    ahora.getMinutes() >= minutoSlot && 
                    ahora.getMinutes() < minutoSlot + 30;

                  const slotId = `slot-simple-${diaIndex}-${horaIndex}`;
                  return (
                    <DroppableSlot
                      key={slotId}
                      id={slotId}
                      dia={dia}
                      hora={hora}
                    >
                      <div
                        className={`border-b border-gray-100 p-1.5 min-h-[60px] ${
                          esHoraActual 
                            ? 'bg-yellow-50 ring-2 ring-yellow-300 ring-opacity-50' 
                            : esHoraPasada 
                            ? 'bg-gray-50/50 opacity-70' 
                            : 'hover:bg-blue-50/40'
                        } transition-all relative group`}
                      >
                            <div className="flex items-center justify-between mb-1">
                          <div className={`text-xs font-medium ${
                            esHoraActual 
                              ? 'text-yellow-700 font-bold' 
                              : esHoraPasada 
                              ? 'text-gray-400' 
                              : 'text-gray-500'
                          }`}>
                            {hora}
                          </div>
                          {citasEnSlot.length > 0 && (
                            <div className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                              {citasEnSlot.length}
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          {citasEnSlot.map((cita, citaIndex) => {
                            const tratamiento = tratamientos.find(t => t._id === cita.tratamiento?._id);
                            const duracionMinima = tratamiento?.duracionEstimadaMinutos || 15;
                            return (
                              <CitaBlock
                                key={cita._id}
                                cita={cita}
                                onClick={() => onCitaClick(cita)}
                                onResizeStart={onCitaResizeStart}
                                onResizeEnd={onCitaResizeEnd}
                                duracionMinimaMinutos={duracionMinima}
                                timeSlotDuration={timeSlotDuration}
                                citasEnSlot={citasEnSlot}
                                destacada={citaDestacada === cita._id}
                              />
                            );
                          })}
                          {citasEnSlot.length === 0 && !esHoraPasada && (
                            <button
                              onClick={() => onSlotClick(dia, hora)}
                              className="w-full h-full min-h-[40px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-blue-600 hover:text-blue-700 border-2 border-dashed border-blue-300 rounded hover:bg-blue-50/50"
                              title="Hacer clic para crear nueva cita"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              <span className="text-xs">Nueva cita</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </DroppableSlot>
                  );
                })}
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
      <DragOverlay>
        {activeCita ? (
          <div className="opacity-90 rotate-3">
            <CitaBlock cita={activeCita} onClick={() => {}} disabled />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

