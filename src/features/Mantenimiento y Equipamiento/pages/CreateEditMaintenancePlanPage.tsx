import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import {
  MaintenancePlan,
  NuevoMaintenancePlan,
  obtenerMaintenancePlanPorId,
  crearMaintenancePlan,
  actualizarMaintenancePlan,
} from '../api/maintenanceApi';
import MaintenancePlanForm from '../components/MaintenancePlanForm';

interface CreateEditMaintenancePlanPageProps {
  planId?: string;
  onVolver: () => void;
  onGuardado?: (plan: MaintenancePlan) => void;
}

export default function CreateEditMaintenancePlanPage({
  planId,
  onVolver,
  onGuardado,
}: CreateEditMaintenancePlanPageProps) {
  const [plan, setPlan] = useState<MaintenancePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (planId) {
      cargarPlan();
    }
  }, [planId]);

  const cargarPlan = async () => {
    if (!planId) return;

    setLoadingPlan(true);
    setError(null);
    try {
      const planData = await obtenerMaintenancePlanPorId(planId);
      setPlan(planData);
    } catch (err) {
      setError('Error al cargar el plan de mantenimiento');
      console.error(err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleSubmit = async (planData: NuevoMaintenancePlan) => {
    setLoading(true);
    setError(null);

    try {
      let planGuardado: MaintenancePlan;
      if (planId && plan) {
        planGuardado = await actualizarMaintenancePlan(planId, planData);
      } else {
        planGuardado = await crearMaintenancePlan(planData);
      }

      if (onGuardado) {
        onGuardado(planGuardado);
      }
      onVolver();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el plan de mantenimiento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
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
            <h1 className="text-2xl font-bold text-gray-900">
              {planId ? 'Editar Plan de Mantenimiento' : 'Nuevo Plan de Mantenimiento'}
            </h1>
            <p className="text-gray-600 mt-1">
              {planId
                ? 'Modifica la información del plan de mantenimiento'
                : 'Crea un nuevo plan de mantenimiento preventivo para un equipo'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Formulario */}
      <MaintenancePlanForm
        plan={plan || undefined}
        onSubmit={handleSubmit}
        onCancel={onVolver}
        loading={loading}
      />
    </div>
  );
}


