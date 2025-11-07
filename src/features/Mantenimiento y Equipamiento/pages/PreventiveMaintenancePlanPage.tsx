import { useState, useEffect } from 'react';
import { Plus, Calendar, AlertCircle, RefreshCw, Loader2, Wrench } from 'lucide-react';
import {
  MaintenancePlan,
  obtenerMaintenancePlans,
  eliminarMaintenancePlan,
  FiltrosMaintenancePlans,
} from '../api/maintenanceApi';
import MaintenancePlanList from '../components/MaintenancePlanList';
import MaintenanceTaskCalendar from '../components/MaintenanceTaskCalendar';
import MetricCards from '../components/MetricCards';

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

  const totalPlanes = plans.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Wrench size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Plan de Mantenimiento Preventivo
                </h1>
                <p className="text-gray-600">
                  Gestión y seguimiento de planes de mantenimiento preventivo para equipos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={cargarPlans}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Actualizar
              </button>
              {onNuevoPlan && (
                <button
                  onClick={onNuevoPlan}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  <Plus size={20} />
                  Nuevo Plan
                </button>
              )}
            </div>
          </div>

          {/* KPIs/Métricas */}
          <MetricCards
            data={[
              {
                id: 'vencidos',
                title: 'Vencidos',
                value: planesVencidos,
                color: 'danger',
              },
              {
                id: 'proximos',
                title: 'Próximos (7 días)',
                value: planesProximos,
                color: 'warning',
              },
              {
                id: 'al-dia',
                title: 'Al Día',
                value: planesAlDia,
                color: 'success',
              },
              {
                id: 'total',
                title: 'Total Planes',
                value: totalPlanes,
                color: 'info',
              },
            ]}
          />

          {/* Controles de Vista y Filtros */}
          <div className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Filtros:</label>
                <select
                  value={filtros.status || 'all'}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      status: e.target.value === 'all' ? undefined : (e.target.value as 'active' | 'inactive'),
                    })
                  }
                  className="px-4 py-2 text-sm rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Vista:</span>
                <div className="flex ring-1 ring-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setVista('lista')}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                      vista === 'lista'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Lista
                  </button>
                  <button
                    onClick={() => setVista('calendario')}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                      vista === 'calendario'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar size={16} />
                    Calendario
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido */}
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={cargarPlans}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-sm"
              >
                Reintentar
              </button>
            </div>
          )}

          {loading && !error ? (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando planes de mantenimiento...</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}



