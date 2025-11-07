import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Plus, Calendar, User, Wrench, AlertCircle, Loader2 } from 'lucide-react';
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
        border: 'ring-red-200',
        label: 'Vencido',
        icon: AlertCircle,
      };
    } else if (diffDays <= 7) {
      return {
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'ring-yellow-200',
        label: `Próximo en ${diffDays} días`,
        icon: AlertCircle,
      };
    } else {
      return {
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'ring-green-200',
        label: 'Al día',
        icon: Calendar,
      };
    }
  };

  if (loading || !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando plan de mantenimiento...</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(plan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Wrench size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {plan.name}
                  </h1>
                  {plan.description && (
                    <p className="text-gray-600">
                      {plan.description}
                    </p>
                  )}
                </div>
              </div>
              {onEditar && (
                <button
                  onClick={() => onEditar(plan)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={20} />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {error && (
            <div className="bg-white shadow-sm rounded-lg p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          )}

          {/* Información del Plan */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Equipo</label>
                <p className="text-gray-900">
                  {plan.equipment.nombre} - {plan.equipment.marca} {plan.equipment.modelo}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Frecuencia</label>
                <p className="text-gray-900">
                  {getFrequencyLabel(plan.frequencyType, plan.frequencyValue)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Próximo Mantenimiento</label>
                <div className={`px-3 py-2 rounded-xl ring-1 ${statusInfo.bg} ${statusInfo.border}`}>
                  <div className="flex items-center gap-2">
                    <statusInfo.icon className={`w-4 h-4 ${statusInfo.color}`} />
                    <span className={`font-medium ${statusInfo.color}`}>
                      {formatDate(plan.nextDueDate)} - {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Responsable</label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">
                    {plan.assignedTo.nombre} {plan.assignedTo.apellidos || ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Tareas */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Tareas</label>
              <div className="space-y-2">
                {plan.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl"
                  >
                    <Wrench className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historial de Mantenimientos */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Historial de Mantenimientos</h2>
              {!mostrarFormularioLog && (
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setMostrarFormularioLog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                    Registrar Mantenimiento
                  </button>
                </div>
              )}
            </div>

            {mostrarFormularioLog && (
              <form onSubmit={handleGuardarLog} className="mb-6 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Nuevo Registro de Mantenimiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha de Realización *
                    </label>
                    <input
                      type="date"
                      value={formLog.completionDate}
                      onChange={(e) =>
                        setFormLog({ ...formLog, completionDate: e.target.value })
                      }
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
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
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
                    <textarea
                      value={formLog.notes || ''}
                      onChange={(e) => setFormLog({ ...formLog, notes: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      placeholder="Observaciones, problemas encontrados, acciones realizadas..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
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
                    className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
}

