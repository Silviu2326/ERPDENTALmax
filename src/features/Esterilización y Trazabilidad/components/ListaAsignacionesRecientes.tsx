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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock size={20} className="text-blue-600" />
          <span>Asignaciones Recientes</span>
        </h3>
        <button
          onClick={cargarAsignaciones}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-slate-600 transition-all rounded-lg disabled:opacity-50"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 ring-1 ring-red-200 rounded-2xl text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : asignaciones.length === 0 ? (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay asignaciones recientes</h3>
          <p className="text-gray-600">No se han encontrado asignaciones recientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {asignaciones.map((asignacion) => (
            <div
              key={asignacion._id}
              className="p-4 ring-1 ring-slate-200 rounded-xl hover:ring-blue-300 hover:bg-blue-50/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-gray-500" />
                    <p className="font-semibold text-gray-900">
                      {asignacion.paciente.nombre} {asignacion.paciente.apellidos}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={16} className="text-gray-500" />
                    <p className="text-sm text-gray-700">
                      {asignacion.bandeja.nombre} - {asignacion.bandeja.codigoUnico}
                    </p>
                  </div>
                  {asignacion.cita && (
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-gray-500" />
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
                  <p className="text-xs text-gray-600">
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



