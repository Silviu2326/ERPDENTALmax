import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Loader2, AlertCircle, X } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Planes de Financiación</h1>
              <p className="text-sm text-gray-600 mt-1">
                Crea y gestiona las plantillas de planes de financiación para tus pacientes
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={cargarPlanes}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              {!mostrarFormulario && (
                <button
                  onClick={handleNuevoPlan}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nuevo Plan</span>
                </button>
              )}
            </div>
          </div>
        </div>

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
  );
}

