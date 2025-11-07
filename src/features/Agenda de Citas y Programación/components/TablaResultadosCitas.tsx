import { useState } from 'react';
import { CheckSquare, Square, Calendar, Clock, User, MapPin } from 'lucide-react';
import { Cita } from '../api/citasApi';

interface TablaResultadosCitasProps {
  citas: Cita[];
  citasSeleccionadas: string[];
  onSeleccionarCita: (citaId: string) => void;
  onSeleccionarTodas: () => void;
  loading?: boolean;
}

export default function TablaResultadosCitas({
  citas,
  citasSeleccionadas,
  onSeleccionarCita,
  onSeleccionarTodas,
  loading = false,
}: TablaResultadosCitasProps) {
  const todasSeleccionadas = citas.length > 0 && citas.every((cita) => citasSeleccionadas.includes(cita._id || ''));

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatearHora = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      programada: 'bg-yellow-100 text-yellow-800',
      confirmada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
      realizada: 'bg-blue-100 text-blue-800',
      'no-asistio': 'bg-gray-100 text-gray-800',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando citas...</p>
      </div>
    );
  }

  if (citas.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-8 text-center">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron citas</h3>
        <p className="text-gray-600 mb-4">No se encontraron citas con los filtros seleccionados</p>
        <p className="text-sm text-gray-500">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onSeleccionarTodas}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
          >
            {todasSeleccionadas ? (
              <CheckSquare size={20} className="text-blue-600" />
            ) : (
              <Square size={20} />
            )}
            <span>
              {todasSeleccionadas ? 'Deseleccionar todas' : 'Seleccionar todas'}
            </span>
          </button>
        </div>
        <div className="text-sm text-slate-600">
          <span className="font-semibold">{citasSeleccionadas.length}</span> de{' '}
          <span className="font-semibold">{citas.length}</span> citas seleccionadas
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-12">
                <span className="sr-only">Seleccionar</span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Profesional
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Sede
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Duración
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {citas.map((cita) => {
              const estaSeleccionada = citasSeleccionadas.includes(cita._id || '');
              return (
                <tr
                  key={cita._id}
                  className={`hover:bg-slate-50 transition-colors ${estaSeleccionada ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onSeleccionarCita(cita._id || '')}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {estaSeleccionada ? (
                        <CheckSquare size={20} className="text-blue-600" />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={16} className="text-slate-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cita.paciente.nombre} {cita.paciente.apellidos}
                        </div>
                        {cita.paciente.telefono && (
                          <div className="text-sm text-slate-600">{cita.paciente.telefono}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {cita.profesional.nombre} {cita.profesional.apellidos}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatearFecha(cita.fecha_hora_inicio)}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock size={14} className="mr-1" />
                          {formatearHora(cita.fecha_hora_inicio)} - {formatearHora(cita.fecha_hora_fin)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-slate-400 mr-2" />
                      <span className="text-sm text-gray-900">{cita.sede.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                        cita.estado
                      )}`}
                    >
                      {cita.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {cita.duracion_minutos} min
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}



