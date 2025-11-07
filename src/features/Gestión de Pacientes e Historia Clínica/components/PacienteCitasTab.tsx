import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle, FileText, DollarSign } from 'lucide-react';
import { PerfilCompletoPaciente } from '../api/pacienteApi';

interface PacienteCitasTabProps {
  paciente: PerfilCompletoPaciente;
}

export default function PacienteCitasTab({ paciente }: PacienteCitasTabProps) {
  const citas = paciente.citas || [];

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { color: string; icon: any; label: string }> = {
      programada: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Programada' },
      confirmada: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmada' },
      realizada: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Realizada' },
      cancelada: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelada' },
      'no-asistio': { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'No asistió' },
      completada: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completada' },
    };

    const estadoInfo = estados[estado] || estados.programada;
    const Icon = estadoInfo.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${estadoInfo.color}`}>
        <Icon className="w-4 h-4" />
        {estadoInfo.label}
      </span>
    );
  };

  // Calcular duración de la cita
  const calcularDuracion = (inicio: string, fin: string) => {
    const inicioDate = new Date(inicio);
    const finDate = new Date(fin);
    const diffMs = finDate.getTime() - inicioDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return diffMins;
  };

  // Ordenar citas por fecha (más recientes primero)
  const citasOrdenadas = [...citas].sort((a, b) => {
    return new Date(b.fecha_hora_inicio).getTime() - new Date(a.fecha_hora_inicio).getTime();
  });

  // Calcular estadísticas
  const citasProgramadas = citasOrdenadas.filter(c => c.estado === 'programada' || c.estado === 'confirmada');
  const citasRealizadas = citasOrdenadas.filter(c => c.estado === 'realizada' || c.estado === 'completada');
  const citasCanceladas = citasOrdenadas.filter(c => c.estado === 'cancelada');
  const citasNoAsistio = citasOrdenadas.filter(c => c.estado === 'no-asistio');
  const proximaCita = citasProgramadas.length > 0 ? citasProgramadas[0] : null;
  
  // Calcular estadísticas adicionales
  const totalHorasTratamiento = citasRealizadas.reduce((total, cita) => {
    return total + calcularDuracion(cita.fecha_hora_inicio, cita.fecha_hora_fin) / 60;
  }, 0);
  
  const profesionalesUnicos = new Set(citasOrdenadas.map(c => `${c.profesional?.nombre} ${c.profesional?.apellidos}`));
  
  const totalIngresos = citasRealizadas.reduce((total, cita) => {
    return total + ((cita as any).costo || 0);
  }, 0);
  
  const citasEsteMes = citasOrdenadas.filter(c => {
    const fecha = new Date(c.fecha_hora_inicio);
    const ahora = new Date();
    return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
  }).length;
  
  // Calcular estadísticas de frecuencia
  const frecuenciaPromedio = citasRealizadas.length > 0 
    ? Math.round((new Date().getTime() - new Date(citasRealizadas[citasRealizadas.length - 1].fecha_hora_inicio).getTime()) / (1000 * 60 * 60 * 24) / citasRealizadas.length)
    : 0;
  
  // Calcular tasa de asistencia
  const totalCitasProgramadas = citasRealizadas.length + citasCanceladas.length + citasNoAsistio.length;
  const tasaAsistencia = totalCitasProgramadas > 0 
    ? Math.round((citasRealizadas.length / totalCitasProgramadas) * 100)
    : 100;
  
  // Calcular tiempo promedio de cita
  const tiempoPromedio = citasRealizadas.length > 0
    ? Math.round(citasRealizadas.reduce((sum, c) => sum + calcularDuracion(c.fecha_hora_inicio, c.fecha_hora_fin), 0) / citasRealizadas.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Historial de Citas
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {citas.length} {citas.length === 1 ? 'cita registrada' : 'citas registradas'}
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md">
          <Calendar className="w-4 h-4" />
          Nueva Cita
        </button>
      </div>

      {/* Próxima cita destacada */}
      {proximaCita && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">Próxima Cita</h4>
              </div>
              <p className="text-gray-700 font-medium mb-1">
                {new Date(proximaCita.fecha_hora_inicio).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(proximaCita.fecha_hora_inicio).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {proximaCita.profesional?.nombre} {proximaCita.profesional?.apellidos}
                </span>
                {proximaCita.tratamiento && (
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {proximaCita.tratamiento.nombre}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getEstadoBadge(proximaCita.estado)}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de citas */}
      {citasOrdenadas.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Programadas</p>
                  <p className="text-2xl font-bold text-blue-600">{citasProgramadas.length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Realizadas</p>
                  <p className="text-2xl font-bold text-green-600">{citasRealizadas.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Canceladas</p>
                  <p className="text-2xl font-bold text-red-600">{citasCanceladas.length}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Horas Totales</p>
                  <p className="text-2xl font-bold text-purple-600">{totalHorasTratamiento.toFixed(1)}h</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </div>
          </div>
          
          {/* Estadísticas adicionales */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ingresos</p>
                <p className="text-xl font-bold text-indigo-600">{totalIngresos.toFixed(2)} €</p>
              </div>
              <DollarSign className="w-6 h-6 text-indigo-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Citas Este Mes</p>
                <p className="text-xl font-bold text-teal-600">{citasEsteMes}</p>
              </div>
              <Calendar className="w-6 h-6 text-teal-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profesionales</p>
                <p className="text-xl font-bold text-pink-600">{profesionalesUnicos.size}</p>
              </div>
              <User className="w-6 h-6 text-pink-500 opacity-50" />
            </div>
          </div>
        </div>
        
        {/* Estadísticas avanzadas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Frecuencia Promedio</p>
                <p className="text-xl font-bold text-cyan-600">{frecuenciaPromedio} días</p>
                <p className="text-xs text-gray-500 mt-1">Entre visitas</p>
              </div>
              <Calendar className="w-6 h-6 text-cyan-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa de Asistencia</p>
                <p className="text-xl font-bold text-emerald-600">{tasaAsistencia}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {citasRealizadas.length} de {totalCitasProgramadas} citas
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <p className="text-xl font-bold text-amber-600">{tiempoPromedio} min</p>
                <p className="text-xs text-gray-500 mt-1">Por cita</p>
              </div>
              <Clock className="w-6 h-6 text-amber-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-rose-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">No Asistió</p>
                <p className="text-xl font-bold text-rose-600">{citasNoAsistio.length}</p>
                <p className="text-xs text-gray-500 mt-1">Citas perdidas</p>
              </div>
              <XCircle className="w-6 h-6 text-rose-500 opacity-50" />
            </div>
          </div>
        </div>
        </>
      )}

      {citasOrdenadas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">No hay citas registradas para este paciente</p>
          <p className="text-sm text-gray-500 mb-4">
            Las citas programadas y realizadas aparecerán aquí
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Programar Primera Cita
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {citasOrdenadas.map((cita) => {
            const duracion = calcularDuracion(cita.fecha_hora_inicio, cita.fecha_hora_fin);
            const esPasada = new Date(cita.fecha_hora_inicio) < new Date();
            const esHoy = new Date(cita.fecha_hora_inicio).toDateString() === new Date().toDateString();

            return (
              <div
                key={cita._id}
                className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${
                  cita.estado === 'realizada' || cita.estado === 'completada' ? 'border-green-500' :
                  cita.estado === 'cancelada' ? 'border-red-500' :
                  cita.estado === 'no-asistio' ? 'border-gray-500' :
                  cita.estado === 'confirmada' ? 'border-indigo-500' :
                  esHoy ? 'border-yellow-500' : 'border-blue-500'
                } hover:shadow-xl transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        cita.estado === 'realizada' || cita.estado === 'completada' ? 'bg-green-100' :
                        cita.estado === 'cancelada' ? 'bg-red-100' :
                        cita.estado === 'confirmada' ? 'bg-indigo-100' :
                        esHoy ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <Calendar className={`w-5 h-5 ${
                          cita.estado === 'realizada' || cita.estado === 'completada' ? 'text-green-600' :
                          cita.estado === 'cancelada' ? 'text-red-600' :
                          cita.estado === 'confirmada' ? 'text-indigo-600' :
                          esHoy ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 text-lg">
                            {new Date(cita.fecha_hora_inicio).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          {esHoy && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                              Hoy
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(cita.fecha_hora_inicio).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {' - '}
                            {new Date(cita.fecha_hora_fin).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({duracion} minutos)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-11 space-y-2 mt-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">Profesional:</span>
                        <span className="text-sm">
                          {cita.profesional?.nombre} {cita.profesional?.apellidos}
                        </span>
                      </div>

                      {cita.tratamiento && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Tratamiento:</span>
                          <span className="text-sm">{cita.tratamiento.nombre}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{(cita as any).consultorio || 'Consultorio 1 - Sala A'}</span>
                      </div>

                      {(cita as any).motivoConsulta && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">
                            <span className="font-medium">Motivo:</span> {(cita as any).motivoConsulta}
                          </p>
                        </div>
                      )}
                      {(cita as any).notas && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-1 font-medium">
                            {cita.estado === 'realizada' ? 'Notas de la visita:' : 'Notas:'}
                          </p>
                          <p className="text-sm text-gray-700 italic">
                            "{(cita as any).notas}"
                          </p>
                        </div>
                      )}
                      {cita.estado === 'realizada' && (cita as any).costo && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 font-medium">Costo:</span>
                            <span className="text-sm font-semibold text-green-600">
                              {(cita as any).costo.toFixed(2)} €
                            </span>
                          </div>
                          {(cita as any).metodoPago && (
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-600">Método de pago:</span>
                              <span className="text-xs text-gray-700">{(cita as any).metodoPago}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {cita.estado === 'cancelada' && (cita as any).motivoCancelacion && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-red-600 mb-1 font-medium">Motivo de cancelación:</p>
                          <p className="text-sm text-gray-700">
                            {(cita as any).motivoCancelacion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-end gap-2">
                    {getEstadoBadge(cita.estado)}
                    {(cita.estado === 'programada' || cita.estado === 'confirmada') && (
                      <div className="flex flex-col gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors whitespace-nowrap">
                          Ver Detalles
                        </button>
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 transition-colors whitespace-nowrap">
                          Reprogramar
                        </button>
                        <button className="px-3 py-1 bg-red-200 text-red-700 rounded text-xs hover:bg-red-300 transition-colors whitespace-nowrap">
                          Cancelar
                        </button>
                      </div>
                    )}
                    {cita.estado === 'realizada' && (
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors whitespace-nowrap">
                        Ver Historial
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

