import { X, Clock, User, Activity, MapPin, Globe, FileText, Shield } from 'lucide-react';
import { AccesoLog } from '../api/accesosApi';

interface ModalDetalleAccesoProps {
  log: AccesoLog | null;
  onClose: () => void;
}

export default function ModalDetalleAcceso({ log, onClose }: ModalDetalleAccesoProps) {
  if (!log) return null;

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const obtenerColorTipoAccion = (tipoAccion: string) => {
    if (tipoAccion.includes('LOGIN')) return 'bg-green-100 text-green-800 border-green-300';
    if (tipoAccion.includes('FAILED') || tipoAccion.includes('DENIED')) return 'bg-red-100 text-red-800 border-red-300';
    if (tipoAccion.includes('CREATE')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (tipoAccion.includes('UPDATE')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (tipoAccion.includes('DELETE')) return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const obtenerEtiquetaTipoAccion = (tipoAccion: string) => {
    const etiquetas: Record<string, string> = {
      LOGIN_SUCCESS: 'Login Exitoso',
      LOGIN_FAILED: 'Login Fallido',
      LOGOUT: 'Cierre Sesión',
      VIEW_PATIENT: 'Visualización de Paciente',
      CREATE_PATIENT: 'Creación de Paciente',
      UPDATE_PATIENT: 'Modificación de Paciente',
      DELETE_PATIENT: 'Eliminación de Paciente',
      VIEW_CITA: 'Visualización de Cita',
      CREATE_CITA: 'Creación de Cita',
      UPDATE_CITA: 'Modificación de Cita',
      DELETE_CITA: 'Eliminación de Cita',
      VIEW_FACTURA: 'Visualización de Factura',
      CREATE_FACTURA: 'Creación de Factura',
      UPDATE_FACTURA: 'Modificación de Factura',
      DELETE_FACTURA: 'Eliminación de Factura',
      VIEW_PRESUPUESTO: 'Visualización de Presupuesto',
      CREATE_PRESUPUESTO: 'Creación de Presupuesto',
      UPDATE_PRESUPUESTO: 'Modificación de Presupuesto',
      DELETE_PRESUPUESTO: 'Eliminación de Presupuesto',
      VIEW_HISTORIA_CLINICA: 'Visualización de Historia Clínica',
      UPDATE_HISTORIA_CLINICA: 'Modificación de Historia Clínica',
      EXPORT_DATA: 'Exportación de Datos',
      ACCESS_DENIED: 'Acceso Denegado',
    };
    return etiquetas[tipoAccion] || tipoAccion;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detalle del Registro de Acceso</h2>
              <p className="text-sm text-gray-500">Información completa del evento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-700">Fecha y Hora</h3>
              </div>
              <p className="text-gray-900">{formatearFecha(log.timestamp)}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-700">Tipo de Acción</h3>
              </div>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-lg border ${obtenerColorTipoAccion(log.tipoAccion)}`}
              >
                {obtenerEtiquetaTipoAccion(log.tipoAccion)}
              </span>
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Información del Usuario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                <p className="text-gray-900">{log.nombreUsuario}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Rol</label>
                <p className="text-gray-900">{log.rolUsuario}</p>
              </div>
              {log.usuarioId && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">ID de Usuario</label>
                  <p className="text-gray-900 font-mono text-sm">{log.usuarioId._id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de la Acción */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Detalles de la Acción
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {log.recursoAfectado && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Recurso Afectado</label>
                  <p className="text-gray-900">{log.recursoAfectado}</p>
                </div>
              )}
              {log.recursoId && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">ID del Recurso</label>
                  <p className="text-gray-900 font-mono text-sm">{log.recursoId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de Red y Ubicación */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Información de Red
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {log.ipAddress && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Dirección IP</label>
                  <p className="text-gray-900 font-mono">{log.ipAddress}</p>
                </div>
              )}
              {log.userAgent && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">User Agent</label>
                  <p className="text-gray-900 text-sm break-all">{log.userAgent}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de Sede */}
          {log.sedeId && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Sede
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                <p className="text-gray-900">{log.sedeId.nombre}</p>
              </div>
            </div>
          )}

          {/* Detalles Adicionales */}
          {log.detalles && Object.keys(log.detalles).length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles Adicionales</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(log.detalles, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


