import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Plus, Calendar, User, Wrench, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  MaintenancePlan,
  MaintenanceLog,
  obtenerMaintenancePlanPorId,
  obtenerMaintenanceLogs,
  crearMaintenanceLog,
  NuevoMaintenanceLog,
} from '../api/maintenanceApi';
import MaintenanceLogTable from '../components/MaintenanceLogTable';

interface MaintenancePlanDetailPageProps {
  planId: string;
  onVolver: () => void;
  onEditar?: (plan: MaintenancePlan) => void;
}

export default function MaintenancePlanDetailPage({
  planId,
  onVolver,
  onEditar,
}: MaintenancePlanDetailPageProps) {
  const { user } = useAuth();
  const [plan, setPlan] = useState<MaintenancePlan | null>(null);
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormularioLog, setMostrarFormularioLog] = useState(false);
  const [formLog, setFormLog] = useState<NuevoMaintenanceLog>({
    maintenancePlan: planId,
    equipment: '',
    completionDate: new Date().toISOString().split('T')[0],
    performedBy: user?.id || '',
    notes: '',
    cost: undefined,
  });

  useEffect(() => {
    cargarPlan();
    cargarLogs();
  }, [planId]);

  const cargarPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const planData = await obtenerMaintenancePlanPorId(planId);
      setPlan(planData);
      setFormLog((prev) => ({
        ...prev,
        equipment: planData.equipment._id,
        performedBy: user?.id || prev.performedBy,
      }));
    } catch (err) {
      setError('Error al cargar el plan de mantenimiento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarLogs = async () => {
    setLoadingLogs(true);
    try {
      const logsData = await obtenerMaintenanceLogs(planId);
      setLogs(logsData);
    } catch (err) {
      console.error('Error al cargar los logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleGuardarLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    setLoadingLogs(true);
    try {
      await crearMaintenanceLog({
        ...formLog,
        maintenancePlan: planId,
        equipment: plan.equipment._id,
      });
      setMostrarFormularioLog(false);
      cargarLogs();
      // Recargar plan para actualizar nextDueDate
      cargarPlan();
    } catch (err) {
      alert('Error al guardar el registro de mantenimiento');
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
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

  const getStatusInfo = (plan: MaintenancePlan) => {
    const nextDue = new Date(plan.nextDueDate);
    const today = new Date();
    const diffDays = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        label: 'Vencido',
        icon: AlertCircle,
      };
    } else if (diffDays <= 7) {
      return {
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        label: `Próximo en ${diffDays} días`,
        icon: AlertCircle,
      };
    } else {
      return {
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        label: 'Al día',
        icon: Calendar,
      };
    }
  };

  if (loading || !plan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(plan);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onVolver}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
            {plan.description && (
              <p className="text-gray-600 mt-1">{plan.description}</p>
            )}
          </div>
        </div>
        {onEditar && (
          <button
            onClick={() => onEditar(plan)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Información del Plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Equipo</label>
            <p className="text-gray-900 mt-1">
              {plan.equipment.nombre} - {plan.equipment.marca} {plan.equipment.modelo}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Frecuencia</label>
            <p className="text-gray-900 mt-1">
              {getFrequencyLabel(plan.frequencyType, plan.frequencyValue)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Próximo Mantenimiento</label>
            <div className={`mt-1 px-3 py-2 rounded-lg border ${statusInfo.bg} ${statusInfo.border}`}>
              <div className="flex items-center gap-2">
                <statusInfo.icon className={`w-4 h-4 ${statusInfo.color}`} />
                <span className={`font-medium ${statusInfo.color}`}>
                  {formatDate(plan.nextDueDate)} - {statusInfo.label}
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Responsable</label>
            <div className="flex items-center gap-2 mt-1">
              <User className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900">
                {plan.assignedTo.nombre} {plan.assignedTo.apellidos || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Tareas */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-500 mb-2 block">Tareas</label>
          <div className="space-y-2">
            {plan.tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
              >
                <Wrench className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historial de Mantenimientos */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Historial de Mantenimientos</h2>
          {!mostrarFormularioLog && (
            <button
              onClick={() => setMostrarFormularioLog(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Registrar Mantenimiento
            </button>
          )}
        </div>

        {mostrarFormularioLog && (
          <form onSubmit={handleGuardarLog} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">Nuevo Registro de Mantenimiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Realización *
                </label>
                <input
                  type="date"
                  value={formLog.completionDate}
                  onChange={(e) =>
                    setFormLog({ ...formLog, completionDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formLog.cost || ''}
                  onChange={(e) =>
                    setFormLog({
                      ...formLog,
                      cost: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                <textarea
                  value={formLog.notes || ''}
                  onChange={(e) => setFormLog({ ...formLog, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Observaciones, problemas encontrados, acciones realizadas..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setMostrarFormularioLog(false);
                  setFormLog({
                    maintenancePlan: planId,
                    equipment: plan.equipment._id,
                    completionDate: new Date().toISOString().split('T')[0],
                    performedBy: user?.id || '',
                    notes: '',
                    cost: undefined,
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loadingLogs}
              >
                {loadingLogs ? 'Guardando...' : 'Guardar Registro'}
              </button>
            </div>
          </form>
        )}

        <MaintenanceLogTable logs={logs} loading={loadingLogs} />
      </div>
    </div>
  );
}

