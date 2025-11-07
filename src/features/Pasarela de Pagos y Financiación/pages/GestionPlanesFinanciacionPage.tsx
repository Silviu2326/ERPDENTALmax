import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Loader2, AlertCircle, X, CreditCard } from 'lucide-react';
import {
  PlanFinanciacion,
  obtenerPlanesFinanciacion,
  crearPlanFinanciacion,
  actualizarPlanFinanciacion,
  NuevoPlanFinanciacion,
  PlanFinanciacionActualizado,
} from '../api/financiacionApi';
import FormularioPlanFinanciacion from '../components/FormularioPlanFinanciacion';
import TablaGestionPlanes from '../components/TablaGestionPlanes';

export default function GestionPlanesFinanciacionPage() {
  const [planes, setPlanes] = useState<PlanFinanciacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [planEditando, setPlanEditando] = useState<PlanFinanciacion | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    setLoading(true);
    setError(null);
    try {
      const planesData = await obtenerPlanesFinanciacion();
      setPlanes(planesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los planes de financiación');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoPlan = () => {
    setPlanEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarPlan = (plan: PlanFinanciacion) => {
    setPlanEditando(plan);
    setMostrarFormulario(true);
  };

  const handleGuardarPlan = async (plan: NuevoPlanFinanciacion | PlanFinanciacionActualizado) => {
    setGuardando(true);
    setError(null);

    try {
      if (planEditando) {
        // Actualizar
        await actualizarPlanFinanciacion(planEditando._id!, plan as PlanFinanciacionActualizado);
      } else {
        // Crear
        await crearPlanFinanciacion(plan as NuevoPlanFinanciacion);
      }
      setMostrarFormulario(false);
      setPlanEditando(null);
      await cargarPlanes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el plan');
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setPlanEditando(null);
    setError(null);
  };

  const handleEliminarPlan = async (planId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este plan? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      // Desactivar en lugar de eliminar
      await actualizarPlanFinanciacion(planId, { estado: 'inactivo' });
      await cargarPlanes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el plan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <CreditCard size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Gestión de Planes de Financiación
                  </h1>
                  <p className="text-gray-600">
                    Crea y gestiona las plantillas de planes de financiación para tus pacientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          {!mostrarFormulario && (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={cargarPlanes}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70 border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                <span>Actualizar</span>
              </button>
              <button
                onClick={handleNuevoPlan}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <Plus size={20} />
                <span>Nuevo Plan</span>
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Formulario */}
          {mostrarFormulario && (
            <FormularioPlanFinanciacion
              plan={planEditando || undefined}
              onSubmit={handleGuardarPlan}
              onCancel={handleCancelarFormulario}
              loading={guardando}
            />
          )}

          {/* Tabla de Planes */}
          {!mostrarFormulario && (
            <TablaGestionPlanes
              planes={planes}
              onEditar={handleEditarPlan}
              onEliminar={handleEliminarPlan}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

