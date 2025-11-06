import { Eye, Clock, User, Activity, MapPin, Globe } from 'lucide-react';
import { AccesoLog } from '../api/accesosApi';

interface TablaRegistroAccesosProps {
  logs: AccesoLog[];
  loading?: boolean;
  onVerDetalle: (log: AccesoLog) => void;
}

export default function TablaRegistroAccesos({
  logs,
  loading = false,
  onVerDetalle,
}: TablaRegistroAccesosProps) {
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const obtenerColorTipoAccion = (tipoAccion: string) => {
    if (tipoAccion.includes('LOGIN')) return 'bg-green-100 text-green-800';
    if (tipoAccion.includes('FAILED') || tipoAccion.includes('DENIED')) return 'bg-red-100 text-red-800';
    if (tipoAccion.includes('CREATE')) return 'bg-blue-100 text-blue-800';
    if (tipoAccion.includes('UPDATE')) return 'bg-yellow-100 text-yellow-800';
    if (tipoAccion.includes('DELETE')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const obtenerEtiquetaTipoAccion = (tipoAccion: string) => {
    const etiquetas: Record<string, string> = {
      LOGIN_SUCCESS: 'Login Exitoso',
      LOGIN_FAILED: 'Login Fallido',
      LOGOUT: 'Cierre Sesión',
      VIEW_PATIENT: 'Ver Paciente',
      CREATE_PATIENT: 'Crear Paciente',
      UPDATE_PATIENT: 'Modificar Paciente',
      DELETE_PATIENT: 'Eliminar Paciente',
      VIEW_CITA: 'Ver Cita',
      CREATE_CITA: 'Crear Cita',
      UPDATE_CITA: 'Modificar Cita',
      DELETE_CITA: 'Eliminar Cita',
      VIEW_FACTURA: 'Ver Factura',
      CREATE_FACTURA: 'Crear Factura',
      UPDATE_FACTURA: 'Modificar Factura',
      DELETE_FACTURA: 'Eliminar Factura',
      VIEW_PRESUPUESTO: 'Ver Presupuesto',
      CREATE_PRESUPUESTO: 'Crear Presupuesto',
      UPDATE_PRESUPUESTO: 'Modificar Presupuesto',
      DELETE_PRESUPUESTO: 'Eliminar Presupuesto',
      VIEW_HISTORIA_CLINICA: 'Ver Historia Clínica',
      UPDATE_HISTORIA_CLINICA: 'Modificar Historia Clínica',
      EXPORT_DATA: 'Exportar Datos',
      ACCESS_DENIED: 'Acceso Denegado',
    };
    return etiquetas[tipoAccion] || tipoAccion;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando registros de acceso...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No se encontraron registros de acceso</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recurso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sede
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {formatearFecha(log.timestamp)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {log.nombreUsuario}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                    {log.rolUsuario}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerColorTipoAccion(log.tipoAccion)}`}
                  >
                    {obtenerEtiquetaTipoAccion(log.tipoAccion)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.recursoAfectado || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.sedeId ? (
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {log.sedeId.nombre}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.ipAddress ? (
                    <div className="flex items-center text-sm text-gray-700">
                      <Globe className="w-4 h-4 mr-1 text-gray-400" />
                      {log.ipAddress}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onVerDetalle(log)}
                    className="text-blue-600 hover:text-blue-900 flex items-center justify-end ml-auto"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


