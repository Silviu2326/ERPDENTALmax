import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Profesional, Tratamiento, SlotDisponibilidad, obtenerDisponibilidad } from '../api/citasApi';

interface CalendarioDisponibilidadProps {
  profesional: Profesional | null;
  tratamiento: Tratamiento | null;
  onSlotSeleccionado: (slot: SlotDisponibilidad) => void;
}

export default function CalendarioDisponibilidad({
  profesional,
  tratamiento,
  onSlotSeleccionado,
}: CalendarioDisponibilidadProps) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());
  const [slotsDisponibles, setSlotsDisponibles] = useState<SlotDisponibilidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular rango de fechas (7 días desde la fecha seleccionada)
  const getRangoFechas = () => {
    const inicio = new Date(fechaSeleccionada);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 7);
    fin.setHours(23, 59, 59, 999);
    return { inicio, fin };
  };

  useEffect(() => {
    const cargarDisponibilidad = async () => {
      if (!profesional || !tratamiento) {
        setSlotsDisponibles([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { inicio, fin } = getRangoFechas();
        const slots = await obtenerDisponibilidad(
          profesional._id,
          inicio.toISOString(),
          fin.toISOString(),
          tratamiento.duracionEstimadaMinutos
        );
        setSlotsDisponibles(slots);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al obtener disponibilidad');
        setSlotsDisponibles([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDisponibilidad();
  }, [profesional, tratamiento, fechaSeleccionada]);

  const navegarSemana = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + (direccion === 'siguiente' ? 7 : -7));
    setFechaSeleccionada(nuevaFecha);
  };

  const irHoy = () => {
    setFechaSeleccionada(new Date());
  };

  // Agrupar slots por día
  const slotsPorDia = slotsDisponibles.reduce((acc, slot) => {
    const fecha = new Date(slot.start);
    const fechaStr = fecha.toISOString().split('T')[0];
    if (!acc[fechaStr]) {
      acc[fechaStr] = [];
    }
    acc[fechaStr].push(slot);
    return acc;
  }, {} as Record<string, SlotDisponibilidad[]>);

  // Obtener los días de la semana
  const getDiasSemana = () => {
    const dias: Date[] = [];
    const lunes = new Date(fechaSeleccionada);
    const diaSemana = lunes.getDay();
    lunes.setDate(lunes.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
    
    for (let i = 0; i < 7; i++) {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  const formatHora = (isoDate: string) => {
    const fecha = new Date(isoDate);
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const nombreDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  if (!profesional || !tratamiento) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          Selecciona un profesional y un tratamiento para ver la disponibilidad
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navegarSemana('anterior')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-800">
            Disponibilidad - {formatFecha(fechaSeleccionada)}
          </h3>
          <button
            onClick={() => navegarSemana('siguiente')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={irHoy}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Hoy
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Cargando disponibilidad...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 mb-4">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-7 gap-2">
          {getDiasSemana().map((dia, index) => {
            const fechaStr = dia.toISOString().split('T')[0];
            const slotsDelDia = slotsPorDia[fechaStr] || [];
            const esHoy = dia.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`border rounded-lg p-2 min-h-[200px] ${
                  esHoy ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="text-center mb-2">
                  <div className="text-xs text-gray-500 uppercase">{nombreDias[dia.getDay()]}</div>
                  <div className={`text-lg font-semibold ${esHoy ? 'text-blue-700' : 'text-gray-700'}`}>
                    {dia.getDate()}
                  </div>
                </div>
                <div className="space-y-1 max-h-[160px] overflow-y-auto">
                  {slotsDelDia.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">Sin disponibilidad</p>
                  ) : (
                    slotsDelDia.map((slot, slotIndex) => (
                      <button
                        key={slotIndex}
                        onClick={() => onSlotSeleccionado(slot)}
                        className="w-full text-left px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                      >
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatHora(slot.start)}
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



