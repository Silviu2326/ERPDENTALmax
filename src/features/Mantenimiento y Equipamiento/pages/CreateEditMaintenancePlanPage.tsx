import { useState, useEffect } from 'react';
import { ArrowLeft, Wrench, Loader2, AlertCircle } from 'lucide-react';
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

    if (planId) {
      cargarPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando plan de mantenimiento...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Botón volver */}
              <button
                onClick={onVolver}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all mr-4"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Wrench size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {planId ? 'Editar Plan de Mantenimiento' : 'Nuevo Plan de Mantenimiento'}
                </h1>
                <p className="text-gray-600">
                  {planId
                    ? 'Modifica la información del plan de mantenimiento'
                    : 'Crea un nuevo plan de mantenimiento preventivo para un equipo'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Mensaje de error */}
          {error && (
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 flex-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  ×
                </button>
              </div>
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
      </div>
    </div>
  );
}



