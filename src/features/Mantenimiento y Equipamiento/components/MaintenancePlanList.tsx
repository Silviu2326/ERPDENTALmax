import { useState } from 'react';
import { Eye, Edit, Trash2, Calendar, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { MaintenancePlan } from '../api/maintenanceApi';

interface MaintenancePlanListProps {
  plans: MaintenancePlan[];
  loading?: boolean;
  onVerDetalle?: (plan: MaintenancePlan) => void;
  onEditar?: (plan: MaintenancePlan) => void;
  onEliminar?: (plan: MaintenancePlan) => void;
}

export default function MaintenancePlanList({
  plans,
  loading = false,
  onVerDetalle,
  onEditar,
  onEliminar,
}: MaintenancePlanListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFrequencyLabel = (type: string, value: number) => {
    const labels: Record<string, string> = {
      DIARIO: 'Diario',
      SEMANAL: 'Semanal',
      MENSUAL: 'Mensual',
      TRIMESTRAL: 'Trimestral',
      ANUAL: 'Anual',
    };
    return `${labels[type] || type} (cada ${value})`;
  };

  const getStatusBadge = (plan: MaintenancePlan) => {
    const nextDue = new Date(plan.nextDueDate);
    const today = new Date();
    const diffDays = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (!plan.isActive) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 ring-1 ring-gray-300">
          Inactivo
        </span>
      );
    }

    if (diffDays < 0) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 ring-1 ring-red-300 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Vencido
        </span>
      );
    } else if (diffDays <= 7) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Próximo ({diffDays} días)
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 ring-1 ring-green-300 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Al día
        </span>
      );
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

  if (plans.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay planes de mantenimiento</h3>
        <p className="text-gray-600">Crea tu primer plan para comenzar</p>
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
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Equipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Frecuencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Próximo Mantenimiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plans.map((plan) => (
              <tr key={plan._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                    {plan.description && (
                      <div className="text-sm text-gray-600 mt-1">{plan.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {plan.equipment.nombre}
                  </div>
                  <div className="text-sm text-gray-600">
                    {plan.equipment.marca} {plan.equipment.modelo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {getFrequencyLabel(plan.frequencyType, plan.frequencyValue)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(plan.nextDueDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {plan.assignedTo.nombre} {plan.assignedTo.apellidos || ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(plan)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(plan)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-xl hover:bg-blue-50 transition-all"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEditar && (
                      <button
                        onClick={() => onEditar(plan)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-xl hover:bg-blue-50 transition-all"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onEliminar && (
                      <button
                        onClick={() => onEliminar(plan)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-xl hover:bg-red-50 transition-all"
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



