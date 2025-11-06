import { Eye, Edit, Trash2, FileText } from 'lucide-react';
import { Capa } from '../api/capasApi';

interface TablaCapasProps {
  capas: Capa[];
  onVerDetalle: (capaId: string) => void;
  onEditar?: (capaId: string) => void;
  onEliminar?: (capaId: string) => void;
  loading?: boolean;
}

const estadoBadgeClass = {
  Abierta: 'bg-yellow-100 text-yellow-800',
  'En Investigación': 'bg-blue-100 text-blue-800',
  'Acciones Definidas': 'bg-purple-100 text-purple-800',
  'En Implementación': 'bg-orange-100 text-orange-800',
  'Pendiente de Verificación': 'bg-indigo-100 text-indigo-800',
  Cerrada: 'bg-green-100 text-green-800',
};

const fuenteBadgeClass = {
  'Auditoría Interna': 'bg-blue-50 text-blue-700',
  'Queja de Paciente': 'bg-red-50 text-red-700',
  'Revisión de Equipo': 'bg-green-50 text-green-700',
  'Otro': 'bg-gray-50 text-gray-700',
};

export default function TablaCapas({
  capas,
  onVerDetalle,
  onEditar,
  onEliminar,
  loading = false,
}: TablaCapasProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando CAPAs...</p>
      </div>
    );
  }

  if (capas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg mb-2">No se encontraron CAPAs</p>
        <p className="text-gray-500 text-sm">
          Intenta ajustar los filtros o crea una nueva CAPA
        </p>
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
                ID CAPA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fuente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Detección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clínica
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {capas.map((capa) => (
              <tr key={capa._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-900">
                    {capa.id_capa}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                    {capa.titulo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      fuenteBadgeClass[capa.fuente]
                    }`}
                  >
                    {capa.fuente}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(capa.fecha_deteccion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      estadoBadgeClass[capa.estado]
                    }`}
                  >
                    {capa.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {capa.clinica?.nombre || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {capa.responsable_investigacion
                    ? `${capa.responsable_investigacion.nombre} ${capa.responsable_investigacion.apellidos || ''}`
                    : 'Sin asignar'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onVerDetalle(capa._id!)}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {onEditar && (
                      <button
                        onClick={() => onEditar(capa._id!)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    {onEliminar && (
                      <button
                        onClick={() => onEliminar(capa._id!)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
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


