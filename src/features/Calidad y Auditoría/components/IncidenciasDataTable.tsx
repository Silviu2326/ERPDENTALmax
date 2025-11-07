import { Eye, Edit, Trash2, AlertCircle, FileText, Shield, User, Package, Loader2 } from 'lucide-react';
import { Incidencia } from '../api/incidenciasApi';

interface IncidenciasDataTableProps {
  incidencias: Incidencia[];
  loading?: boolean;
  onVerDetalle: (incidencia: Incidencia) => void;
  onEditar?: (incidencia: Incidencia) => void;
  onEliminar?: (id: string) => void;
}

export default function IncidenciasDataTable({
  incidencias,
  loading = false,
  onVerDetalle,
  onEditar,
  onEliminar,
}: IncidenciasDataTableProps) {

  const getTipoIcon = (tipo: Incidencia['tipo']) => {
    switch (tipo) {
      case 'No Conformidad Producto':
        return <Package size={12} />;
      case 'Incidencia Clínica':
        return <AlertCircle size={12} />;
      case 'Queja Paciente':
        return <User size={12} />;
      case 'Incidente Seguridad':
        return <Shield size={12} />;
      default:
        return <FileText size={12} />;
    }
  };

  const getEstadoBadge = (estado: Incidencia['estado']) => {
    const estilos = {
      Abierta: 'bg-red-100 text-red-800',
      'En Investigación': 'bg-yellow-100 text-yellow-800',
      Resuelta: 'bg-blue-100 text-blue-800',
      Cerrada: 'bg-green-100 text-green-800',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${estilos[estado] || 'bg-gray-100 text-gray-800'}`}
      >
        {estado}
      </span>
    );
  };

  const getTipoBadge = (tipo: Incidencia['tipo']) => {
    const estilos = {
      'No Conformidad Producto': 'bg-purple-100 text-purple-800',
      'Incidencia Clínica': 'bg-orange-100 text-orange-800',
      'Queja Paciente': 'bg-pink-100 text-pink-800',
      'Incidente Seguridad': 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${estilos[tipo] || 'bg-gray-100 text-gray-800'}`}
      >
        {getTipoIcon(tipo)}
        {tipo}
      </span>
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando incidencias...</p>
      </div>
    );
  }

  if (incidencias.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay incidencias registradas</h3>
        <p className="text-gray-600 mb-4">Comienza creando una nueva incidencia</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Folio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Fecha Detección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Reportado por
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {incidencias.map((incidencia) => (
              <tr
                key={incidencia._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{incidencia.folio}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTipoBadge(incidencia.tipo)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-md truncate" title={incidencia.descripcion_detallada}>
                    {incidencia.descripcion_detallada}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoBadge(incidencia.estado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatFecha(incidencia.fecha_deteccion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {incidencia.reportado_por?.nombre} {incidencia.reportado_por?.apellidos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onVerDetalle(incidencia)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-all"
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </button>
                    {onEditar && (
                      <button
                        onClick={() => onEditar(incidencia)}
                        className="text-yellow-600 hover:text-yellow-900 p-2 rounded-lg hover:bg-yellow-50 transition-all"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {onEliminar && (
                      <button
                        onClick={() => {
                          if (incidencia._id) {
                            if (confirm('¿Está seguro de eliminar esta incidencia?')) {
                              onEliminar(incidencia._id);
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
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

