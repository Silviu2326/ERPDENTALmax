import { useState } from 'react';
import { Eye, Edit, Trash2, AlertCircle, FileText, Shield, User, Package } from 'lucide-react';
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
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<string | null>(null);

  const getTipoIcon = (tipo: Incidencia['tipo']) => {
    switch (tipo) {
      case 'No Conformidad Producto':
        return <Package className="w-4 h-4" />;
      case 'Incidencia Clínica':
        return <AlertCircle className="w-4 h-4" />;
      case 'Queja Paciente':
        return <User className="w-4 h-4" />;
      case 'Incidente Seguridad':
        return <Shield className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getEstadoBadge = (estado: Incidencia['estado']) => {
    const estilos = {
      Abierta: 'bg-red-100 text-red-800 border-red-300',
      'En Investigación': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Resuelta: 'bg-blue-100 text-blue-800 border-blue-300',
      Cerrada: 'bg-green-100 text-green-800 border-green-300',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${estilos[estado] || 'bg-gray-100 text-gray-800 border-gray-300'}`}
      >
        {estado}
      </span>
    );
  };

  const getTipoBadge = (tipo: Incidencia['tipo']) => {
    const estilos = {
      'No Conformidad Producto': 'bg-purple-100 text-purple-800 border-purple-300',
      'Incidencia Clínica': 'bg-orange-100 text-orange-800 border-orange-300',
      'Queja Paciente': 'bg-pink-100 text-pink-800 border-pink-300',
      'Incidente Seguridad': 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${estilos[tipo] || 'bg-gray-100 text-gray-800 border-gray-300'}`}
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando incidencias...</p>
        </div>
      </div>
    );
  }

  if (incidencias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <FileText className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-600 font-medium mb-2">No hay incidencias registradas</p>
        <p className="text-gray-500 text-sm">Comienza creando una nueva incidencia</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Folio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Detección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reportado por
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {incidencias.map((incidencia) => (
              <tr
                key={incidencia._id}
                className="hover:bg-gray-50 transition-colors"
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatFecha(incidencia.fecha_deteccion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {incidencia.reportado_por?.nombre} {incidencia.reportado_por?.apellidos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onVerDetalle(incidencia)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {onEditar && (
                      <button
                        onClick={() => onEditar(incidencia)}
                        className="text-yellow-600 hover:text-yellow-900 p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
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
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
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

