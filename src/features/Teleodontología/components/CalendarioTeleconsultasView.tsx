import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Video, Calendar as CalendarIcon } from 'lucide-react';
import { Teleconsulta, FiltrosTeleconsultas } from '../api/teleconsultasApi';
import TarjetaDetalleTeleconsulta from './TarjetaDetalleTeleconsulta';

interface CalendarioTeleconsultasViewProps {
  teleconsultas: Teleconsulta[];
  fechaSeleccionada: Date;
  onFechaChange: (fecha: Date) => void;
  onTeleconsultaClick?: (teleconsulta: Teleconsulta) => void;
  onIniciarVideollamada?: (teleconsulta: Teleconsulta) => void;
  loading?: boolean;
}

export default function CalendarioTeleconsultasView({
  teleconsultas,
  fechaSeleccionada,
  onFechaChange,
  onTeleconsultaClick,
  onIniciarVideollamada,
  loading = false,
}: CalendarioTeleconsultasViewProps) {
  const [viewMode, setViewMode] = useState<'dia' | 'semana' | 'mes'>('semana');

  const getDiasSemana = () => {
    const inicioSemana = new Date(fechaSeleccionada);
    const dia = inicioSemana.getDay();
    const diff = inicioSemana.getDate() - dia + (dia === 0 ? -6 : 1); // Lunes como primer día
    inicioSemana.setDate(diff);
    inicioSemana.setHours(0, 0, 0, 0);

    const dias = [];
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + i);
      dias.push(fecha);
    }
    return dias;
  };

  const getTeleconsultasDelDia = (fecha: Date) => {
    return teleconsultas.filter((tc) => {
      const fechaTC = new Date(tc.fechaHoraInicio);
      return (
        fechaTC.getDate() === fecha.getDate() &&
        fechaTC.getMonth() === fecha.getMonth() &&
        fechaTC.getFullYear() === fecha.getFullYear()
      );
    });
  };

  const navegarSemana = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + (direccion === 'siguiente' ? 7 : -7));
    onFechaChange(nuevaFecha);
  };

  const esHoy = (fecha: Date) => {
    const hoy = new Date();
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  };

  const diasSemana = getDiasSemana();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navegarSemana('anterior')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {fechaSeleccionada.toLocaleDateString('es-ES', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <button
            onClick={() => navegarSemana('siguiente')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Semana siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFechaChange(new Date())}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Hoy
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('dia')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'dia'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Día
          </button>
          <button
            onClick={() => setViewMode('semana')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'semana'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewMode('mes')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'mes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mes
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando teleconsultas...</p>
        </div>
      )}

      {!loading && viewMode === 'semana' && (
        <div className="grid grid-cols-7 gap-4">
          {diasSemana.map((dia, index) => {
            const teleconsultasDia = getTeleconsultasDelDia(dia);
            const esHoyDia = esHoy(dia);

            return (
              <div
                key={index}
                className={`border rounded-lg p-3 min-h-[200px] ${
                  esHoyDia ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    {dia.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      esHoyDia ? 'text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {dia.getDate()}
                  </p>
                </div>
                <div className="space-y-2">
                  {teleconsultasDia.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">Sin teleconsultas</p>
                  )}
                  {teleconsultasDia.map((tc) => {
                    const fechaTC = new Date(tc.fechaHoraInicio);
                    const hora = fechaTC.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={tc._id}
                        onClick={() => onTeleconsultaClick?.(tc)}
                        className={`p-2 rounded cursor-pointer hover:bg-blue-100 transition-colors ${
                          tc.estado === 'En Curso'
                            ? 'bg-purple-100 border border-purple-300'
                            : tc.estado === 'Confirmada'
                            ? 'bg-green-100 border border-green-300'
                            : 'bg-gray-100 border border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Video className="w-3 h-3" />
                          <span className="text-xs font-semibold">{hora}</span>
                        </div>
                        <p className="text-xs text-gray-700 truncate">
                          {tc.paciente?.nombre} {tc.paciente?.apellidos}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{tc.motivoConsulta || 'Sin motivo'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && viewMode === 'dia' && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {fechaSeleccionada.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
          </div>
          <div className="space-y-3">
            {getTeleconsultasDelDia(fechaSeleccionada).length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay teleconsultas programadas para este día</p>
            ) : (
              getTeleconsultasDelDia(fechaSeleccionada).map((tc) => (
                <TarjetaDetalleTeleconsulta
                  key={tc._id}
                  teleconsulta={tc}
                  onIniciarVideollamada={onIniciarVideollamada}
                  onEditar={() => onTeleconsultaClick?.(tc)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {!loading && viewMode === 'mes' && (
        <div className="text-center py-8 text-gray-500">
          Vista mensual en desarrollo. Por favor, use la vista semanal o diaria.
        </div>
      )}
    </div>
  );
}



