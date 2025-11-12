import { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
  closestCenter,
} from '@dnd-kit/core';
import { useSensor, useSensors, PointerSensor, MouseSensor } from '@dnd-kit/core';
import CitaBlock from './CitaBlock';
import { Cita } from '../api/citasApi';

interface ProfesionalInfo {
  _id: string;
  nombre: string;
  apellidos: string;
  especialidad?: string;
}

interface TratamientoInfo {
  _id: string;
  nombre: string;
  duracionEstimadaMinutos: number;
}

interface CalendarioGridProps {
  citas: Cita[];
  fechaInicio: Date;
  fechaFin: Date;
  vista: 'dia' | 'semana' | 'mes';
  onCitaClick: (cita: Cita) => void;
  onSlotClick: (fecha: Date, hora: string) => void;
  onCitaReprogramada?: (
    citaId: string,
    nuevaFecha: Date,
    nuevaHora: string,
    profesionalId?: string,
    boxId?: string
  ) => void;
  onCitaResizeStart?: (cita: Cita) => void;
  onCitaResizeEnd?: (cita: Cita, nuevaDuracionMinutos: number) => void;
  groupBy?: 'profesional' | 'box';
  profesionales?: ProfesionalInfo[];
  userRole?: string;
  timeSlotDuration?: 10 | 15 | 30;
  visibleHours?: { start: number; end: number };
  tratamientos?: TratamientoInfo[];
  citaDestacada?: string | null;
}

interface DroppableSlotProps {
  id: string;
  dia: Date;
  hora: string;
  columnaId?: string;
  children: React.ReactNode;
  isOver?: boolean;
}

function DroppableSlot({ id, dia, hora, columnaId, children }: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
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
      className={isOver ? 'bg-blue-100 ring-2 ring-blue-400 ring-opacity-50 transition-colors' : ''}
    >
      {children}
    </div>
  );
}

const defaultVisibleHours = { start: 7, end: 20 };

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
  groupBy = 'profesional',
  profesionales = [],
  userRole,
  timeSlotDuration = 30,
  visibleHours = defaultVisibleHours,
  tratamientos = [],
  citaDestacada = null,
}: CalendarioGridProps) {
  const [fechaActual, setFechaActual] = useState(new Date(fechaInicio));
  const [activeCita, setActiveCita] = useState<Cita | null>(null);

  useEffect(() => {
    setFechaActual(new Date(fechaInicio));
  }, [fechaInicio]);

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

  const dias = useMemo(() => {
    const resultado: Date[] = [];
    const inicio = new Date(fechaActual);

    if (vista === 'dia') {
      resultado.push(new Date(inicio));
    } else {
      const diaSemana = inicio.getDay();
      const lunes = new Date(inicio);
      lunes.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
      for (let i = 0; i < 7; i++) {
        const dia = new Date(lunes);
        dia.setDate(lunes.getDate() + i);
        resultado.push(dia);
      }
    }

    return resultado;
  }, [fechaActual, vista]);

  const columnasPorDia = useMemo(() => {
    if (groupBy === 'box') {
      const boxes = new Set<string>();
      citas.forEach((cita) => {
        if (cita.box_asignado) boxes.add(cita.box_asignado);
      });
      const boxesOrdenados = Array.from(boxes).sort((a, b) => a.localeCompare(b, 'es'));
      const columnas = boxesOrdenados.length
        ? boxesOrdenados.map((box) => ({ id: box, label: `Box ${box}`, type: 'box' as const }))
        : [{ id: 'sin-box', label: 'Sin box', type: 'box' as const }];
      return dias.map(() => columnas.map((c) => ({ ...c })));
    }

    const columnasProfesionales = (profesionales.length
      ? profesionales
      : Array.from(
          new Map(
            citas.map((cita) => [
              cita.profesional._id,
              {
                id: cita.profesional._id,
                nombre: cita.profesional.nombre,
                apellidos: cita.profesional.apellidos,
              },
            ])
          ).values()
        )
    ).map((prof) => ({
      id: prof._id,
      label: `${prof.nombre} ${prof.apellidos}`,
      type: 'profesional' as const,
    }));

    return dias.map(() => columnasProfesionales.map((c) => ({ ...c })));
  }, [dias, citas, groupBy, profesionales]);

  const obtenerCitasPorColumna = (dia: Date, hora: string, columna: { id: string; type: 'profesional' | 'box' }) => {
    const [horaStr, minutoStr] = hora.split(':');
    const horaInicio = new Date(dia);
    horaInicio.setHours(parseInt(horaStr, 10), parseInt(minutoStr, 10), 0, 0);

    return citas.filter((cita) => {
      const fechaInicioCita = new Date(cita.fecha_hora_inicio);
      if (fechaInicioCita.toDateString() !== dia.toDateString()) return false;

      const coincideColumna =
        columna.type === 'box'
          ? cita.box_asignado === columna.id
          : cita.profesional._id === columna.id;

      if (!coincideColumna) return false;

      return (
        fechaInicioCita.getHours() === horaInicio.getHours() &&
        fechaInicioCita.getMinutes() === horaInicio.getMinutes()
      );
    });
  };

  const getCitasPorDiaYHora = (dia: Date, hora: string) => {
    const [horaStr, minutoStr] = hora.split(':');
    const horaInicio = new Date(dia);
    horaInicio.setHours(parseInt(horaStr, 10), parseInt(minutoStr, 10), 0, 0);

    return citas.filter((cita) => {
      const fechaInicioCita = new Date(cita.fecha_hora_inicio);
      return (
        fechaInicioCita.toDateString() === dia.toDateString() &&
        fechaInicioCita.getHours() === horaInicio.getHours() &&
        fechaInicioCita.getMinutes() === horaInicio.getMinutes()
      );
    });
  };

  const getTotalCitasDia = (dia: Date) =>
    citas.filter((cita) => new Date(cita.fecha_hora_inicio).toDateString() === dia.toDateString()).length;

  const getResumenDia = (dia: Date) => {
    const citasDelDia = citas.filter((cita) => new Date(cita.fecha_hora_inicio).toDateString() === dia.toDateString());
    const total = citasDelDia.length;
    const confirmadas = citasDelDia.filter((c) => c.estado === 'confirmada').length;
    const programadas = citasDelDia.filter((c) => c.estado === 'programada').length;
    const urgentes = citasDelDia.filter((c) => c.notas?.toLowerCase().includes('urgente')).length;
    const duracionTotal = citasDelDia.reduce((sum, c) => sum + c.duracion_minutos, 0);
    return { total, confirmadas, programadas, urgentes, duracionTotal };
  };

  const resumenSemana = useMemo(() => {
    const resumen = dias.map((dia) => getResumenDia(dia));
    const totalSemana = resumen.reduce((sum, r) => sum + r.total, 0);
    const confirmadasSemana = resumen.reduce((sum, r) => sum + r.confirmadas, 0);
    const urgentesSemana = resumen.reduce((sum, r) => sum + r.urgentes, 0);
    const horasTotales = resumen.reduce((sum, r) => sum + r.duracionTotal, 0) / 60;
    return { totalSemana, confirmadasSemana, urgentesSemana, horasTotales };
  }, [dias, citas]);

  const sensores = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

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

  const getTituloVista = () => {
    if (vista === 'dia') {
      return fechaActual.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    if (vista === 'semana') {
      const inicioSemana = dias[0];
      const finSemana = dias[dias.length - 1];
      return `${inicioSemana.getDate()} - ${finSemana.getDate()} de ${nombreMeses[inicioSemana.getMonth()]} ${inicioSemana.getFullYear()}`;
    }
    return `${nombreMeses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const citaData = event.active.data.current?.cita as Cita | undefined;
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

    if (citaData.estado === 'realizada' || citaData.estado === 'cancelada') {
      return;
    }

    if (dropData.columnaId && onCitaReprogramada) {
      const nuevoProfesionalId = groupBy === 'profesional' ? dropData.columnaId : undefined;
      const nuevoBoxId = groupBy === 'box' ? dropData.columnaId : undefined;

      const esRecepcionista = userRole === 'recepcionista';
      const esCoordinador = userRole === 'director' || userRole === 'propietario';

      if (groupBy === 'profesional' && nuevoProfesionalId && citaData.profesional._id !== nuevoProfesionalId) {
        if (esRecepcionista) {
          alert('Los recepcionistas solo pueden mover citas dentro del mismo profesional.');
          return;
        }
        if (!esCoordinador) {
          // permitir por defecto si no hay restricciones adicionales
        }
      }

      if (groupBy === 'box' && nuevoBoxId && citaData.box_asignado !== nuevoBoxId) {
        if (esRecepcionista) {
          alert('Los recepcionistas solo pueden mover citas dentro del mismo box.');
          return;
        }
      }

      onCitaReprogramada(
        citaData._id!,
        dropData.dia,
        dropData.hora,
        nuevoProfesionalId,
        nuevoBoxId
      );
    }
  };

  return (
    <DndContext
      sensors={sensores}
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
              <h3 className="text-lg font-semibold text-gray-800 capitalize">{getTituloVista()}</h3>
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
                    <p className="text-lg font-bold text-purple-700">
                      {Math.round(resumenSemana.horasTotales * 10) / 10}h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {groupBy === 'profesional' || groupBy === 'box' ? (
              <>
                <div
                  className="grid border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white"
                  style={{ gridTemplateColumns: `80px repeat(${dias.length}, minmax(240px, 1fr))` }}
                >
                  <div className="p-3 border-r border-gray-200" />
                  {dias.map((dia, diaIndex) => {
                    const esHoy = dia.toDateString() === new Date().toDateString();
                    const totalCitas = getTotalCitasDia(dia);
                    const esFinDeSemana = dia.getDay() === 0 || dia.getDay() === 6;

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
                      >
                        <div
                          className={`text-xs uppercase mb-1 ${
                            esHoy ? 'text-blue-700 font-bold' : 'text-gray-500'
                          }`}
                        >
                          {nombreDias[dia.getDay()]}
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            esHoy ? 'text-blue-700' : 'text-gray-800'
                          }`}
                        >
                          {dia.getDate()}
                        </div>
                        {totalCitas > 0 && (
                          <div
                            className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-block ${
                              esHoy ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {totalCitas} {totalCitas === 1 ? 'cita' : 'citas'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div
                  className="grid border-b border-gray-200 bg-white"
                  style={{ gridTemplateColumns: `80px repeat(${dias.length}, minmax(240px, 1fr))` }}
                >
                  <div className="p-2 border-r border-gray-200" />
                  {dias.map((_, diaIndex) => (
                    <div
                      key={`group-header-${diaIndex}`}
                      className="border-r border-gray-200 bg-white text-xs font-medium text-gray-700"
                    >
                      <div className="flex gap-2 overflow-x-auto px-2 py-1">
                        {columnasPorDia[diaIndex].map((columna) => (
                          <span
                            key={`${diaIndex}-${columna.id}`}
                            className="px-2 py-1 bg-gray-100 rounded-lg whitespace-nowrap border border-gray-200"
                          >
                            {columna.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {horasDelDia.map((hora, horaIndex) => (
                  <div
                    key={`row-${horaIndex}`}
                    className={`grid border-b border-gray-100 ${
                      horaIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                    style={{ gridTemplateColumns: `80px repeat(${dias.length}, minmax(240px, 1fr))` }}
                  >
                    <div className="p-2 border-r border-gray-200 text-xs font-medium text-gray-500">{hora}</div>
                    {dias.map((dia, diaIndex) => (
                      <div key={`day-slot-${diaIndex}-${horaIndex}`} className="border-r border-gray-200 px-1">
                        <div className="grid grid-flow-col auto-cols-[minmax(200px,1fr)] gap-1 overflow-x-auto">
                          {columnasPorDia[diaIndex].map((columna, colIndex) => {
                            const citasEnSlot = obtenerCitasPorColumna(dia, hora, columna);
                            const esHoy = dia.toDateString() === new Date().toDateString();
                            const ahora = new Date();
                            const [horaSlot, minutoSlot] = hora.split(':').map(Number);
                            const horaSlotDate = new Date(dia);
                            horaSlotDate.setHours(horaSlot, minutoSlot, 0, 0);
                            const esHoraPasada = esHoy && horaSlotDate < ahora;
                            const esHoraActual =
                              esHoy &&
                              ahora.getHours() === horaSlot &&
                              ahora.getMinutes() >= minutoSlot &&
                              ahora.getMinutes() < minutoSlot + timeSlotDuration;

                            const slotId = `slot-${diaIndex}-${colIndex}-${horaIndex}`;

                            return (
                              <DroppableSlot
                                key={slotId}
                                id={slotId}
                                dia={dia}
                                hora={hora}
                                columnaId={columna.id}
                              >
                                <div
                                  className={`border border-gray-100 rounded-lg p-1 min-h-[60px] transition-all relative group ${
                                    esHoraActual
                                      ? 'bg-yellow-50 ring-2 ring-yellow-300 ring-opacity-50'
                                      : esHoraPasada
                                      ? 'bg-gray-50/50 opacity-70'
                                      : 'hover:bg-blue-50/40'
                                  }`}
                                >
                                  <div className="space-y-0.5">
                                    {citasEnSlot.map((cita) => {
                                      const tratamiento = tratamientos.find(
                                        (t) => t._id === cita.tratamiento?._id
                                      );
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
                      </div>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div
                  className="grid border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white"
                  style={{ gridTemplateColumns: `repeat(${dias.length}, minmax(0, 1fr))` }}
                >
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
                        <div
                          className={`text-xs uppercase mb-1 ${
                            esHoy ? 'text-blue-700 font-bold' : 'text-gray-500'
                          }`}
                        >
                          {nombreDias[dia.getDay()]}
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            esHoy ? 'text-blue-700' : 'text-gray-800'
                          }`}
                        >
                          {dia.getDate()}
                        </div>
                        {totalCitas > 0 && (
                          <div
                            className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-block ${
                              esHoy ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {totalCitas} {totalCitas === 1 ? 'cita' : 'citas'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="grid" style={{ gridTemplateColumns: `80px repeat(${dias.length}, minmax(0, 1fr))` }}>
                  <div className="border-r border-gray-200">
                    {horasDelDia.map((hora, horaIndex) => (
                      <div
                        key={`hora-simple-${horaIndex}`}
                        className="border-b border-gray-100 p-1.5 min-h-[60px] text-xs font-medium text-gray-500"
                      >
                        {hora}
                      </div>
                    ))}
                  </div>

                  {dias.map((dia, diaIndex) => (
                    <div key={diaIndex} className="border-r border-gray-200 last:border-r-0 min-h-[1400px]">
                      {horasDelDia.map((hora, horaIndex) => {
                        const citasEnSlot = getCitasPorDiaYHora(dia, hora);
                        const esHoy = dia.toDateString() === new Date().toDateString();
                        const ahora = new Date();
                        const [horaSlot, minutoSlot] = hora.split(':').map(Number);
                        const horaSlotDate = new Date(dia);
                        horaSlotDate.setHours(horaSlot, minutoSlot, 0, 0);
                        const esHoraPasada = esHoy && horaSlotDate < ahora;
                        const esHoraActual =
                          esHoy &&
                          ahora.getHours() === horaSlot &&
                          ahora.getMinutes() >= minutoSlot &&
                          ahora.getMinutes() < minutoSlot + timeSlotDuration;

                        const slotId = `slot-simple-${diaIndex}-${horaIndex}`;

                        return (
                          <DroppableSlot key={slotId} id={slotId} dia={dia} hora={hora}>
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
                                <div
                                  className={`text-xs font-medium ${
                                    esHoraActual
                                      ? 'text-yellow-700 font-bold'
                                      : esHoraPasada
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {hora}
                                </div>
                                {citasEnSlot.length > 0 && (
                                  <div className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                                    {citasEnSlot.length}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-0.5">
                                {citasEnSlot.map((cita) => {
                                  const tratamiento = tratamientos.find(
                                    (t) => t._id === cita.tratamiento?._id
                                  );
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
              </>
            )}
          </div>
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

