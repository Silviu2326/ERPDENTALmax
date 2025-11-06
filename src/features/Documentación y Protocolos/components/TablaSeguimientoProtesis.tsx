import { Eye, Edit, Clock } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Clock className="w-8 h-8 mx-auto mb-2 animate-spin" />
          <p>Cargando órdenes de prótesis...</p>
        </div>
      </div>
    );
  }

  if (protesis.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p>No se encontraron órdenes de prótesis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
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
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => item._id && onVerDetalle(item._id)}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {onEditar && (
                      <button
                        onClick={() => item._id && onEditar(item._id)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
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


