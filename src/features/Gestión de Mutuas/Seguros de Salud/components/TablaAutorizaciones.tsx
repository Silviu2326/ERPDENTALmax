import { Eye, Edit, FileText, Calendar, User, Building2 } from 'lucide-react';
import { Autorizacion } from '../api/autorizacionesApi';
import SelectorEstadoAutorizacion from './SelectorEstadoAutorizacion';

interface TablaAutorizacionesProps {
  autorizaciones: Autorizacion[];
  loading?: boolean;
  onVerDetalle?: (autorizacion: Autorizacion) => void;
  onEditar?: (autorizacion: Autorizacion) => void;
  onEstadoChange?: (autorizacionId: string, nuevoEstado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Requiere Información Adicional') => void;
}

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'Aprobada':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Rechazada':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Requiere Información Adicional':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  }
};

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function TablaAutorizaciones({
  autorizaciones,
  loading = false,
  onVerDetalle,
  onEditar,
  onEstadoChange,
}: TablaAutorizacionesProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (autorizaciones.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay autorizaciones registradas</p>
          <p className="text-sm">Comienza creando una nueva autorización de tratamiento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código Solicitud
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tratamiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mutua/Seguro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Solicitud
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documentos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {autorizaciones.map((autorizacion) => (
              <tr key={autorizacion._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {autorizacion.codigoSolicitud}
                      </div>
                      {autorizacion.codigoAutorizacion && (
                        <div className="text-xs text-green-600 font-medium">
                          Auth: {autorizacion.codigoAutorizacion}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div className="text-sm text-gray-900">
                      {autorizacion.paciente.nombre} {autorizacion.paciente.apellidos}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {autorizacion.tratamientoPlanificado.nombre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <div className="text-sm text-gray-900">
                      {autorizacion.mutua.nombreComercial}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {onEstadoChange ? (
                    <SelectorEstadoAutorizacion
                      estado={autorizacion.estado}
                      onEstadoChange={(nuevoEstado) =>
                        onEstadoChange(autorizacion._id!, nuevoEstado)
                      }
                    />
                  ) : (
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getEstadoColor(autorizacion.estado)}`}
                    >
                      {autorizacion.estado}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div className="text-sm text-gray-900">
                      {formatearFecha(autorizacion.fechaSolicitud)}
                    </div>
                  </div>
                  {autorizacion.fechaRespuesta && (
                    <div className="text-xs text-gray-500 mt-1">
                      Respuesta: {formatearFecha(autorizacion.fechaRespuesta)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {autorizacion.documentos.length}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(autorizacion)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    {onEditar && (
                      <button
                        onClick={() => onEditar(autorizacion)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


