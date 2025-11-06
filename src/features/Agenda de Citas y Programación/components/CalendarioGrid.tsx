import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Cita } from '../api/citasApi';
import CitaBlock from './CitaBlock';

interface CalendarioGridProps {
  citas: Cita[];
  fechaInicio: Date;
  fechaFin: Date;
  vista: 'dia' | 'semana' | 'mes';
  onCitaClick: (cita: Cita) => void;
  onSlotClick: (fecha: Date, hora: string) => void;
}

export default function CalendarioGrid({
  citas,
  fechaInicio,
  fechaFin,
  vista,
  onCitaClick,
  onSlotClick,
}: CalendarioGridProps) {
  const [fechaActual, setFechaActual] = useState(new Date(fechaInicio));

  const horasDelDia = Array.from({ length: 28 }, (_, i) => {
    const hora = 7 + Math.floor(i / 2); // De 7:00 a 20:00
    const minuto = (i % 2) * 30; // 00 o 30
    return `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  });

  const getDiasVista = () => {
    const dias: Date[] = [];
    const inicio = new Date(fechaActual);
    
    if (vista === 'dia') {
      dias.push(new Date(inicio));
    } else if (vista === 'semana') {
      // Lunes de la semana
      const diaSemana = inicio.getDay();
      const lunes = new Date(inicio);
      lunes.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
      
      for (let i = 0; i < 7; i++) {
        const dia = new Date(lunes);
        dia.setDate(lunes.getDate() + i);
        dias.push(dia);
      }
    } else {
      // Mes: mostrar solo la semana actual simplificada
      const diaSemana = inicio.getDay();
      const lunes = new Date(inicio);
      lunes.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
      
      for (let i = 0; i < 7; i++) {
        const dia = new Date(lunes);
        dia.setDate(lunes.getDate() + i);
        dias.push(dia);
      }
    }
    
    return dias;
  };

  const getCitasPorDiaYHora = (dia: Date, hora: string) => {
    const [horaStr, minutoStr] = hora.split(':');
    const horaInicio = new Date(dia);
    horaInicio.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);
    const horaFin = new Date(horaInicio);
    horaFin.setMinutes(horaFin.getMinutes() + 30); // Intervalo de 30 minutos

    return citas.filter((cita) => {
      const fechaInicioCita = new Date(cita.fecha_hora_inicio);
      const fechaFinCita = new Date(cita.fecha_hora_fin);
      
      // Verificar si la cita se solapa con el slot de tiempo
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
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
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

          <div className="grid grid-cols-7">
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

                  return (
                    <div
                      key={horaIndex}
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
                        {citasEnSlot.map((cita, citaIndex) => (
                          <CitaBlock
                            key={cita._id}
                            cita={cita}
                            onClick={() => onCitaClick(cita)}
                          />
                        ))}
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
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

