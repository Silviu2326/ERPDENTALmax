import { useState, useEffect } from 'react';
import { Check, X, Calendar, User, Clock, FileText, AlertCircle } from 'lucide-react';
import {
  SolicitudAusencia,
  obtenerSolicitudesAusencia,
  gestionarSolicitudAusencia,
} from '../api/horariosApi';

interface PanelSolicitudesAusenciaProps {
  soloPendientes?: boolean;
}

export default function PanelSolicitudesAusencia({
  soloPendientes = false,
}: PanelSolicitudesAusenciaProps) {
  const [solicitudes, setSolicitudes] = useState<SolicitudAusencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<'pendiente' | 'aprobada' | 'rechazada' | 'todos'>(
    soloPendientes ? 'pendiente' : 'todos'
  );

  useEffect(() => {
    cargarSolicitudes();
  }, [filtroEstado]);

  const cargarSolicitudes = async () => {
    setLoading(true);
    setError(null);
    try {
      const filtros: any = {};
      if (filtroEstado !== 'todos') {
        filtros.estado = filtroEstado;
      }
      const datos = await obtenerSolicitudesAusencia(filtros);
      setSolicitudes(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleGestionar = async (solicitudId: string, accion: 'aprobada' | 'rechazada') => {
    try {
      await gestionarSolicitudAusencia(solicitudId, accion);
      cargarSolicitudes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al gestionar la solicitud');
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'aprobada':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rechazada':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLabelEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'aprobada':
        return 'Aprobada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return estado;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calcularDias = (fechaInicio: string, fechaFin: string) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diferencia;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Solicitudes de Ausencia</h3>
            <p className="text-sm text-gray-600">Gestiona las solicitudes de ausencia del personal</p>
          </div>
        </div>

        {!soloPendientes && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filtrar:</label>
            <select
              value={filtroEstado}
              onChange={(e) =>
                setFiltroEstado(
                  e.target.value as 'pendiente' | 'aprobada' | 'rechazada' | 'todos'
                )
              }
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="todos">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobada">Aprobadas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : solicitudes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-lg font-medium">No hay solicitudes</p>
          <p className="text-sm">No se encontraron solicitudes de ausencia con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((solicitud) => (
            <div
              key={solicitud._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {solicitud.profesional.nombre} {solicitud.profesional.apellidos}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatearFecha(solicitud.fechaInicio)} - {formatearFecha(solicitud.fechaFin)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {calcularDias(solicitud.fechaInicio, solicitud.fechaFin)} días
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getColorEstado(
                        solicitud.estado
                      )}`}
                    >
                      {getLabelEstado(solicitud.estado)}
                    </span>
                  </div>

                  {solicitud.motivo && (
                    <div className="ml-14 mb-3">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{solicitud.motivo}</p>
                      </div>
                    </div>
                  )}

                  {solicitud.gestionadoPor && (
                    <div className="ml-14 text-xs text-gray-500">
                      {solicitud.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'} por{' '}
                      {solicitud.gestionadoPor.nombre}
                      {solicitud.fechaGestion &&
                        ` el ${new Date(solicitud.fechaGestion).toLocaleDateString('es-ES')}`}
                    </div>
                  )}
                </div>

                {solicitud.estado === 'pendiente' && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleGestionar(solicitud._id!, 'aprobada')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Check className="w-4 h-4" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleGestionar(solicitud._id!, 'rechazada')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


