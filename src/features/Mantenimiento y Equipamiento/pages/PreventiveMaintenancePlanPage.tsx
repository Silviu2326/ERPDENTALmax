import { useState, useEffect } from 'react';
import { Plus, Calendar, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import {
  MaintenancePlan,
  obtenerMaintenancePlans,
  eliminarMaintenancePlan,
  FiltrosMaintenancePlans,
} from '../api/maintenanceApi';
import MaintenancePlanList from '../components/MaintenancePlanList';
import MaintenanceTaskCalendar from '../components/MaintenanceTaskCalendar';

interface PreventiveMaintenancePlanPageProps {
  onNuevoPlan?: () => void;
  onVerDetalle?: (plan: MaintenancePlan) => void;
  onEditar?: (plan: MaintenancePlan) => void;
}

export default function PreventiveMaintenancePlanPage({
  onNuevoPlan,
  onVerDetalle,
  onEditar,
}: PreventiveMaintenancePlanPageProps = {}) {
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosMaintenancePlans>({
    page: 1,
    limit: 20,
    status: 'active',
  });
  const [vista, setVista] = useState<'lista' | 'calendario'>('lista');

  useEffect(() => {
    cargarPlans();
  }, [filtros]);

  const cargarPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerMaintenancePlans(filtros);
      setPlans(response.data);
    } catch (err) {
      setError('Error al cargar los planes de mantenimiento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (plan: MaintenancePlan) => {
    if (!plan._id) return;

    if (!window.confirm(`¿Está seguro de eliminar el plan "${plan.name}"?`)) {
      return;
    }

    try {
      await eliminarMaintenancePlan(plan._id);
      cargarPlans();
    } catch (err) {
      alert('Error al eliminar el plan de mantenimiento');
      console.error(err);
    }
  };

  const handleVerDetalle = (plan: MaintenancePlan) => {
    if (onVerDetalle) {
      onVerDetalle(plan);
    }
  };

  const handleEditar = (plan: MaintenancePlan) => {
    if (onEditar) {
      onEditar(plan);
    }
  };

  const handleTaskClick = (plan: MaintenancePlan) => {
    handleVerDetalle(plan);
  };

  const planesVencidos = plans.filter((plan) => {
    if (!plan.isActive) return false;
    const nextDue = new Date(plan.nextDueDate);
    const today = new Date();
    return nextDue < today;
  }).length;

  const planesProximos = plans.filter((plan) => {
    if (!plan.isActive) return false;
    const nextDue = new Date(plan.nextDueDate);
    const today = new Date();
    const diffDays = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const planesAlDia = plans.filter((plan) => {
    if (!plan.isActive) return false;
    const nextDue = new Date(plan.nextDueDate);
    const today = new Date();
    const diffDays = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  }).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan de Mantenimiento Preventivo</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y programa el mantenimiento preventivo de tus equipos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={cargarPlans}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
          {onNuevoPlan && (
            <button
              onClick={onNuevoPlan}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Plan
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{planesVencidos}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Próximos (7 días)</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{planesProximos}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Al Día</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{planesAlDia}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Vista */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filtros:</label>
            <select
              value={filtros.status || 'all'}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  status: e.target.value === 'all' ? undefined : (e.target.value as 'active' | 'inactive'),
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVista('lista')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                vista === 'lista'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setVista('calendario')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                vista === 'calendario'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Calendario
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {vista === 'lista' ? (
        <MaintenancePlanList
          plans={plans}
          loading={loading}
          onVerDetalle={handleVerDetalle}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
      ) : (
        <MaintenanceTaskCalendar plans={plans} onTaskClick={handleTaskClick} />
      )}
    </div>
  );
}


