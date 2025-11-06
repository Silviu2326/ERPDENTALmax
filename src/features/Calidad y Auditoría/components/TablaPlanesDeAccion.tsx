import { PlanDeAccion } from '../api/revisionDireccionApi';
import { CheckCircle2, Clock, AlertCircle, Calendar, User, Edit2 } from 'lucide-react';

// Función auxiliar para formatear fechas
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

interface TablaPlanesDeAccionProps {
  planes: PlanDeAccion[];
  loading?: boolean;
  onActualizarPlan?: (planId: string, actualizacion: { status?: PlanDeAccion['status'] }) => void;
  onVerDetalle?: (plan: PlanDeAccion) => void;
}

export default function TablaPlanesDeAccion({
  planes,
  loading = false,
  onActualizarPlan,
  onVerDetalle,
}: TablaPlanesDeAccionProps) {
  const getStatusBadge = (status: PlanDeAccion['status']) => {
    const styles = {
      Pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'En Progreso': 'bg-blue-100 text-blue-800 border-blue-300',
      Completado: 'bg-green-100 text-green-800 border-green-300',
    };

    const icons = {
      Pendiente: Clock,
      'En Progreso': AlertCircle,
      Completado: CheckCircle2,
    };

    const Icon = icons[status];

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const isVencido = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando planes de acción...</p>
          </div>
        </div>
      </div>
    );
  }

  if (planes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay planes de acción registrados</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Planes de Acción</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Límite
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {planes.map((plan) => (
              <tr key={plan._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {plan.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {plan.responsibleUserName || 'Sin asignar'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar
                      className={`w-4 h-4 ${
                        isVencido(plan.dueDate) && plan.status !== 'Completado'
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isVencido(plan.dueDate) && plan.status !== 'Completado'
                          ? 'text-red-600 font-semibold'
                          : 'text-gray-900'
                      }`}
                    >
                      {formatDate(plan.dueDate)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(plan.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {onActualizarPlan && (
                      <select
                        value={plan.status}
                        onChange={(e) =>
                          onActualizarPlan(plan._id!, {
                            status: e.target.value as PlanDeAccion['status'],
                          })
                        }
                        className="px-3 py-1 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Completado">Completado</option>
                      </select>
                    )}
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(plan)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Ver detalles"
                      >
                        <Edit2 className="w-4 h-4" />
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

