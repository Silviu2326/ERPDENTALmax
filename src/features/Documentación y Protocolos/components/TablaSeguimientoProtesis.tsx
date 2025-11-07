import { Eye, Edit, Loader2, Package } from 'lucide-react';
import { Protesis, EstadoProtesis } from '../api/protesisApi';

interface TablaSeguimientoProtesisProps {
  protesis: Protesis[];
  onVerDetalle: (protesisId: string) => void;
  onEditar?: (protesisId: string) => void;
  loading?: boolean;
}

function getEstadoBadgeColor(estado: EstadoProtesis): string {
  switch (estado) {
    case 'Prescrita':
      return 'bg-blue-100 text-blue-800';
    case 'Enviada a Laboratorio':
      return 'bg-purple-100 text-purple-800';
    case 'Recibida de Laboratorio':
      return 'bg-yellow-100 text-yellow-800';
    case 'Prueba en Paciente':
      return 'bg-orange-100 text-orange-800';
    case 'Ajustes en Laboratorio':
      return 'bg-amber-100 text-amber-800';
    case 'Instalada':
      return 'bg-green-100 text-green-800';
    case 'Cancelada':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function TablaSeguimientoProtesis({
  protesis,
  onVerDetalle,
  onEditar,
  loading = false,
}: TablaSeguimientoProtesisProps) {
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando órdenes de prótesis...</p>
      </div>
    );
  }

  if (protesis.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron órdenes de prótesis</h3>
        <p className="text-gray-600">No hay órdenes de prótesis que coincidan con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Prótesis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material / Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Laboratorio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Prevista
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {protesis.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.paciente.nombre} {item.paciente.apellidos}
                  </div>
                  {item.paciente.dni && (
                    <div className="text-sm text-gray-500">DNI: {item.paciente.dni}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.tipoProtesis}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.material}</div>
                  <div className="text-sm text-gray-500">Color: {item.color}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.laboratorio.nombre}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadgeColor(
                      item.estado
                    )}`}
                  >
                    {item.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.fechaCreacion).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.fechaPrevistaEntrega
                    ? new Date(item.fechaPrevistaEntrega).toLocaleDateString('es-ES')
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => item._id && onVerDetalle(item._id)}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-all"
                      title="Ver detalle"
                    >
                      <Eye size={20} />
                    </button>
                    {onEditar && (
                      <button
                        onClick={() => item._id && onEditar(item._id)}
                        className="text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit size={20} />
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



