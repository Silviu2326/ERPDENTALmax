import { PlanDeAccion } from '../api/revisionDireccionApi';
import { CheckCircle2, Clock, AlertCircle, Calendar, User, Edit2, Loader2 } from 'lucide-react';

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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando planes de acción...</p>
      </div>
    );
  }

  if (planes.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin planes de acción</h3>
        <p className="text-gray-600">No hay planes de acción registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Planes de Acción</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Fecha Límite
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {planes.map((plan) => (
              <tr key={plan._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                    <div className="text-sm text-slate-600 truncate max-w-xs">
                      {plan.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
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
                          : 'text-slate-400'
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
                        className="px-3 py-1 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
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

