import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { HorarioProfesional, obtenerHorarios, FiltrosHorarios } from '../api/horariosApi';

interface CalendarioHorariosProfesionalProps {
  profesionalId?: string;
  sedeId?: string;
  vista: 'semana' | 'mes';
  onHorarioClick?: (horario: HorarioProfesional) => void;
  onSlotClick?: (fecha: Date) => void;
}

export default function CalendarioHorariosProfesional({
  profesionalId,
  sedeId,
  vista = 'semana',
  onHorarioClick,
  onSlotClick,
}: CalendarioHorariosProfesionalProps) {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [horarios, setHorarios] = useState<HorarioProfesional[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarHorarios();
  }, [fechaActual, profesionalId, sedeId, vista]);

  const cargarHorarios = async () => {
    setLoading(true);
    try {
      const fechaInicio = new Date(fechaActual);
      const fechaFin = new Date(fechaActual);

      if (vista === 'semana') {
        const diaSemana = fechaInicio.getDay();
        fechaInicio.setDate(fechaInicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
        fechaFin.setDate(fechaInicio.getDate() + 6);
      } else {
        fechaInicio.setDate(1);
        const ultimoDia = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, 0);
        fechaFin.setDate(ultimoDia.getDate());
      }

      const filtros: FiltrosHorarios = {
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
      };

      if (profesionalId) filtros.profesionalId = profesionalId;
      if (sedeId) filtros.sedeId = sedeId;

      const datos = await obtenerHorarios(filtros);
      setHorarios(datos);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const navegarFecha = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    if (vista === 'semana') {
      nuevaFecha.setDate(nuevaFecha.getDate() + (direccion === 'siguiente' ? 7 : -7));
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + (direccion === 'siguiente' ? 1 : -1));
    }
    setFechaActual(nuevaFecha);
  };

  const irHoy = () => {
    setFechaActual(new Date());
  };

  const getDiasVista = () => {
    const dias: Date[] = [];
    const inicio = new Date(fechaActual);

    if (vista === 'semana') {
      const diaSemana = inicio.getDay();
      const lunes = new Date(inicio);
      lunes.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

      for (let i = 0; i < 7; i++) {
        const dia = new Date(lunes);
        dia.setDate(lunes.getDate() + i);
        dias.push(dia);
      }
    } else {
      const primerDia = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
      const ultimoDia = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0);

      const diaSemanaInicio = primerDia.getDay();
      const primerLunes = new Date(primerDia);
      primerLunes.setDate(primerDia.getDate() - (diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1));

      let fechaActual = new Date(primerLunes);
      while (fechaActual <= ultimoDia || fechaActual.getMonth() === inicio.getMonth()) {
        dias.push(new Date(fechaActual));
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    }

    return dias;
  };

  const getHorariosPorDia = (dia: Date) => {
    return horarios.filter((horario) => {
      const fechaInicio = new Date(horario.fechaInicio);
      const fechaFin = new Date(horario.fechaFin);
      return fechaInicio <= dia && fechaFin >= dia;
    });
  };

  const getColorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'trabajo':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'ausencia_justificada':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'vacaciones':
        return 'bg-green-500 hover:bg-green-600';
      case 'bloqueo':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getLabelPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'trabajo':
        return 'Trabajo';
      case 'ausencia_justificada':
        return 'Ausencia';
      case 'vacaciones':
        return 'Vacaciones';
      case 'bloqueo':
        return 'Bloqueo';
      default:
        return tipo;
    }
  };

  const dias = getDiasVista();
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

  const esHoy = (fecha: Date) => {
    const hoy = new Date();
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  };

  const esMesActual = (fecha: Date) => {
    return fecha.getMonth() === fechaActual.getMonth();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navegarFecha('anterior')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {vista === 'semana'
                ? `Semana del ${dias[0].getDate()} de ${nombreMeses[dias[0].getMonth()]}`
                : `${nombreMeses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`}
            </h3>
          </div>
          <button
            onClick={() => navegarFecha('siguiente')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={irHoy}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Hoy
        </button>
      </div>

      {/* Calendario */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Encabezados de días */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {nombreDias.map((dia, index) => (
                <div key={index} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {dia}
                </div>
              ))}
            </div>

            {/* Celdas del calendario */}
            <div className="grid grid-cols-7 gap-2">
              {dias.map((dia, index) => {
                const horariosDia = getHorariosPorDia(dia);
                const esHoyDia = esHoy(dia);
                const esMesActualDia = vista === 'semana' || esMesActual(dia);

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] border rounded-lg p-2 ${
                      esHoyDia
                        ? 'bg-blue-50 border-blue-300'
                        : esMesActualDia
                        ? 'bg-white border-gray-200'
                        : 'bg-gray-50 border-gray-100'
                    } ${onSlotClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={() => onSlotClick && onSlotClick(dia)}
                  >
                    <div
                      className={`text-sm font-medium mb-2 ${
                        esHoyDia ? 'text-blue-700' : esMesActualDia ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {dia.getDate()}
                    </div>
                    <div className="space-y-1">
                      {horariosDia.map((horario) => (
                        <div
                          key={horario._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onHorarioClick && onHorarioClick(horario);
                          }}
                          className={`${getColorPorTipo(horario.tipo)} text-white text-xs px-2 py-1 rounded cursor-pointer transition-colors`}
                          title={`${getLabelPorTipo(horario.tipo)} - ${horario.profesional.nombre} ${horario.profesional.apellidos}`}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="truncate">{getLabelPorTipo(horario.tipo)}</span>
                          </div>
                          {horario.notas && (
                            <div className="text-[10px] opacity-90 truncate mt-0.5">{horario.notas}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap gap-4 items-center justify-center pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Trabajo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm text-gray-600">Ausencia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Vacaciones</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Bloqueo</span>
        </div>
      </div>
    </div>
  );
}


