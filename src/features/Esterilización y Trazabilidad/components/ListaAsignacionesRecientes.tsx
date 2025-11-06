import { useState, useEffect } from 'react';
import { RefreshCw, Clock, Package, User, Calendar } from 'lucide-react';
import { AsignacionBandeja, obtenerAsignacionesRecientes } from '../api/trazabilidadApi';

interface ListaAsignacionesRecientesProps {
  limit?: number;
}

export default function ListaAsignacionesRecientes({ limit = 10 }: ListaAsignacionesRecientesProps) {
  const [asignaciones, setAsignaciones] = useState<AsignacionBandeja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarAsignaciones();
  }, [limit]);

  const cargarAsignaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerAsignacionesRecientes(limit);
      setAsignaciones(datos);
    } catch (err: any) {
      console.error('Error al cargar asignaciones recientes:', err);
      setError(err.message || 'Error al cargar asignaciones recientes');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>Asignaciones Recientes</span>
        </h3>
        <button
          onClick={cargarAsignaciones}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : asignaciones.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No hay asignaciones recientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {asignaciones.map((asignacion) => (
            <div
              key={asignacion._id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <p className="font-semibold text-gray-900">
                      {asignacion.paciente.nombre} {asignacion.paciente.apellidos}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-700">
                      {asignacion.bandeja.nombre} - {asignacion.bandeja.codigoUnico}
                    </p>
                  </div>
                  {asignacion.cita && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-600">
                        Cita: {new Date(asignacion.cita.fecha_hora_inicio).toLocaleDateString('es-ES')}
                        {asignacion.cita.tratamiento && ` - ${asignacion.cita.tratamiento.nombre}`}
                      </p>
                    </div>
                  )}
                  {asignacion.usuarioAsigna && (
                    <p className="text-xs text-gray-500 mt-1">
                      Asignado por: {asignacion.usuarioAsigna.nombre}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {formatearFecha(asignacion.fechaAsignacion)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


