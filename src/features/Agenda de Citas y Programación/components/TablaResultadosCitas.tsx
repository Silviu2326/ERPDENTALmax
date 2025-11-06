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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando citas...</p>
      </div>
    );
  }

  if (citas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No se encontraron citas con los filtros seleccionados</p>
        <p className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onSeleccionarTodas}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            {todasSeleccionadas ? (
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className="w-5 h-5" />
            )}
            <span className="font-medium">
              {todasSeleccionadas ? 'Deseleccionar todas' : 'Seleccionar todas'}
            </span>
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-semibold">{citasSeleccionadas.length}</span> de{' '}
          <span className="font-semibold">{citas.length}</span> citas seleccionadas
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <span className="sr-only">Seleccionar</span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profesional
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sede
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {citas.map((cita) => {
              const estaSeleccionada = citasSeleccionadas.includes(cita._id || '');
              return (
                <tr
                  key={cita._id}
                  className={`hover:bg-gray-50 transition-colors ${estaSeleccionada ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onSeleccionarCita(cita._id || '')}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {estaSeleccionada ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cita.paciente.nombre} {cita.paciente.apellidos}
                        </div>
                        {cita.paciente.telefono && (
                          <div className="text-sm text-gray-500">{cita.paciente.telefono}</div>
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
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatearFecha(cita.fecha_hora_inicio)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatearHora(cita.fecha_hora_inicio)} - {formatearHora(cita.fecha_hora_fin)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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


