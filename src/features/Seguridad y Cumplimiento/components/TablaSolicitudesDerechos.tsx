import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import {
  obtenerSolicitudesDerechos,
  actualizarSolicitudDerechos,
  SolicitudDerechos,
  FiltrosSolicitudes,
} from '../api/rgpdApi';
import ModalDetalleSolicitud from './ModalDetalleSolicitud';

interface TablaSolicitudesDerechosProps {
  onNuevaSolicitud?: () => void;
}

export default function TablaSolicitudesDerechos({ onNuevaSolicitud }: TablaSolicitudesDerechosProps) {
  const [solicitudes, setSolicitudes] = useState<SolicitudDerechos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosSolicitudes>({
    page: 1,
    limit: 20,
  });
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudDerechos | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    cargarSolicitudes();
  }, [filtros]);

  const cargarSolicitudes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await obtenerSolicitudesDerechos(filtros);
      setSolicitudes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las solicitudes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerDetalle = (solicitud: SolicitudDerechos) => {
    setSolicitudSeleccionada(solicitud);
    setIsModalOpen(true);
  };

  const handleActualizarEstado = async (
    solicitudId: string,
    nuevoEstado: SolicitudDerechos['estado'],
    notas?: string
  ) => {
    try {
      await actualizarSolicitudDerechos(solicitudId, {
        estado: nuevoEstado,
        notasResolucion: notas,
      });
      await cargarSolicitudes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la solicitud');
    }
  };

  const getTipoDerechoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      ACCESO: 'Acceso',
      RECTIFICACION: 'Rectificación',
      SUPRESION: 'Supresión',
      LIMITACION: 'Limitación',
      PORTABILIDAD: 'Portabilidad',
      OPOSICION: 'Oposición',
    };
    return labels[tipo] || tipo;
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { color: string; icon: React.ReactNode }> = {
      PENDIENTE: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-3 h-3" />,
      },
      EN_PROCESO: {
        color: 'bg-blue-100 text-blue-800',
        icon: <AlertCircle className="w-3 h-3" />,
      },
      COMPLETADA: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-3 h-3" />,
      },
      RECHAZADA: {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    const badge = badges[estado] || badges.PENDIENTE;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
      >
        {badge.icon}
        <span className="ml-1">{estado.replace('_', ' ')}</span>
      </span>
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filtros.status || ''}
              onChange={(e) =>
                setFiltros({ ...filtros, status: e.target.value as any, page: 1 })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="COMPLETADA">Completada</option>
              <option value="RECHAZADA">Rechazada</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Derecho</label>
            <select
              value={filtros.type || ''}
              onChange={(e) => setFiltros({ ...filtros, type: e.target.value as any, page: 1 })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="ACCESO">Acceso</option>
              <option value="RECTIFICACION">Rectificación</option>
              <option value="SUPRESION">Supresión</option>
              <option value="LIMITACION">Limitación</option>
              <option value="PORTABILIDAD">Portabilidad</option>
              <option value="OPOSICION">Oposición</option>
            </select>
          </div>
          <div className="flex items-end">
            {onNuevaSolicitud && (
              <button
                onClick={onNuevaSolicitud}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Nueva Solicitud
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Solicitudes de Derechos</h3>
          <p className="text-sm text-gray-500 mt-1">
            Gestión de solicitudes de derechos ARCO-POL de los pacientes
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {solicitudes.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No se encontraron solicitudes con los filtros aplicados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Derecho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Solicitud
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {solicitud.paciente
                          ? `${solicitud.paciente.nombre} ${solicitud.paciente.apellidos}`
                          : `ID: ${solicitud.pacienteId}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getTipoDerechoLabel(solicitud.tipoDerecho)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getEstadoBadge(solicitud.estado)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatFecha(solicitud.fechaSolicitud)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleVerDetalle(solicitud)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Ver Detalle</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {isModalOpen && solicitudSeleccionada && (
        <ModalDetalleSolicitud
          solicitud={solicitudSeleccionada}
          onClose={() => {
            setIsModalOpen(false);
            setSolicitudSeleccionada(null);
          }}
          onActualizarEstado={handleActualizarEstado}
        />
      )}
    </div>
  );
}



