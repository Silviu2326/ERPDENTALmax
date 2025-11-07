import { Eye, Edit, Trash2, AlertCircle, Clock, CheckCircle, XCircle, Loader2, Package } from 'lucide-react';
import { ParteAveria, EstadoParteAveria, PrioridadParteAveria } from '../api/partesAveriaApi';

interface TablaPartesAveriaProps {
  partes: ParteAveria[];
  loading?: boolean;
  onVerDetalle: (parte: ParteAveria) => void;
  onEditar?: (parte: ParteAveria) => void;
  onEliminar?: (parte: ParteAveria) => void;
}

export default function TablaPartesAveria({
  partes,
  loading = false,
  onVerDetalle,
  onEditar,
  onEliminar,
}: TablaPartesAveriaProps) {
  const getEstadoBadgeClass = (estado: EstadoParteAveria) => {
    switch (estado) {
      case 'Abierto':
        return 'bg-yellow-100 text-yellow-800';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800';
      case 'Resuelto':
        return 'bg-green-100 text-green-800';
      case 'Cerrado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadBadgeClass = (prioridad: PrioridadParteAveria) => {
    switch (prioridad) {
      case 'Baja':
        return 'bg-green-100 text-green-800';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alta':
        return 'bg-orange-100 text-orange-800';
      case 'Crítica':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: EstadoParteAveria) => {
    switch (estado) {
      case 'Abierto':
        return <AlertCircle className="w-4 h-4" />;
      case 'En Progreso':
        return <Clock className="w-4 h-4" />;
      case 'Resuelto':
        return <CheckCircle className="w-4 h-4" />;
      case 'Cerrado':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return fecha;
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (partes.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron partes de avería</h3>
        <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Avería
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Técnico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coste Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partes.map((parte) => (
              <tr key={parte._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {parte.equipo?.nombre || 'N/A'}
                  </div>
                  {parte.equipo?.marca && parte.equipo?.modelo && (
                    <div className="text-xs text-gray-500">
                      {parte.equipo.marca} {parte.equipo.modelo}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {parte.descripcionProblema}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatearFecha(parte.fechaAveria)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadgeClass(
                      parte.estado
                    )}`}
                  >
                    {getEstadoIcon(parte.estado)}
                    {parte.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadBadgeClass(
                      parte.prioridad
                    )}`}
                  >
                    {parte.prioridad}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {parte.tecnicoAsignado || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {parte.costeTotal ? `€${parte.costeTotal.toFixed(2)}` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onVerDetalle(parte)}
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded-xl hover:bg-blue-50 transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {onEditar && (
                      <button
                        onClick={() => onEditar(parte)}
                        className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-xl hover:bg-indigo-50 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    {onEliminar && (
                      <button
                        onClick={() => onEliminar(parte)}
                        className="text-red-600 hover:text-red-900 p-1.5 rounded-xl hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
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



