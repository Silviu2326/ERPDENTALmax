import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import PlanTratamientoBuilder from '../components/PlanTratamientoBuilder';
import {
  crearPlanTratamiento,
  obtenerPlanPorId,
  actualizarPlanTratamiento,
  PlanTratamiento,
  FaseTratamiento,
} from '../api/planesTratamientoApi';

interface PlanTratamientoBuilderPageProps {
  pacienteId?: string;
  planId?: string; // Para edición
  onVolver?: () => void;
  onGuardado?: (planId: string) => void;
}

export default function PlanTratamientoBuilderPage({
  pacienteId: pacienteIdProp,
  planId,
  onVolver,
  onGuardado,
}: PlanTratamientoBuilderPageProps) {
  const { user } = useAuth();
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [loading, setLoading] = useState(!!planId);
  const [error, setError] = useState<string | null>(null);
  const [planInicial, setPlanInicial] = useState<{
    fases: FaseTratamiento[];
    descuento: number;
    notas?: string;
  } | null>(null);

  // Cargar plan existente si estamos editando
  useEffect(() => {
    if (planId) {
      cargarPlanExistente();
    }
  }, [planId]);

  const cargarPlanExistente = async () => {
    if (!planId) return;

    setLoading(true);
    setError(null);
    try {
      const plan: PlanTratamiento = await obtenerPlanPorId(planId);
      setPacienteId(plan.paciente._id);
      setPlanInicial({
        fases: plan.fases,
        descuento: plan.descuento,
        notas: plan.notas,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el plan de tratamiento');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (plan: {
    pacienteId: string;
    odontologoId: string;
    fases: FaseTratamiento[];
    total: number;
    descuento: number;
    notas?: string;
  }) => {
    if (!pacienteId) {
      setError('Debe seleccionar un paciente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (planId) {
        // Actualizar plan existente
        const planActualizado = await actualizarPlanTratamiento(planId, {
          fases: plan.fases,
          descuento: plan.descuento,
          totalNeto: plan.total,
          notas: plan.notas,
        });
        if (onGuardado) {
          onGuardado(planActualizado._id || planId);
        }
      } else {
        // Crear nuevo plan
        const nuevoPlan = await crearPlanTratamiento({
          pacienteId: plan.pacienteId,
          odontologoId: plan.odontologoId,
          fases: plan.fases.map((fase) => ({
            nombre: fase.nombre,
            descripcion: fase.descripcion,
            procedimientos: fase.procedimientos.map((proc) => ({
              tratamiento: proc.tratamiento._id,
              piezaDental: proc.piezaDental,
              cara: proc.cara,
              precio: proc.precio,
              estadoProcedimiento: proc.estadoProcedimiento,
            })),
          })),
          total: plan.total,
          descuento: plan.descuento,
          notas: plan.notas,
        });
        if (onGuardado) {
          onGuardado(nuevoPlan._id || '');
        }
      }

      // Redirigir o cerrar
      if (onVolver) {
        onVolver();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el plan de tratamiento');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    if (onVolver) {
      onVolver();
    }
  };

  if (loading && planId) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando plan de tratamiento...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>Debe iniciar sesión para crear un plan de tratamiento</p>
        </div>
      </div>
    );
  }

  if (!pacienteId && !pacienteIdProp) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-5 h-5" />
              <span>Debe seleccionar un paciente para crear el plan de tratamiento</span>
            </div>
          </div>
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {planId ? 'Editar Plan de Tratamiento' : 'Nuevo Plan de Tratamiento'}
            </h1>
            <p className="text-gray-600 mt-2">
              {planId
                ? 'Modifica el plan de tratamiento existente'
                : 'Crea un plan de tratamiento completo y estructurado por fases'}
            </p>
          </div>
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Constructor */}
        <PlanTratamientoBuilder
          pacienteId={pacienteId || pacienteIdProp || ''}
          odontologoId={user._id || ''}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
          planInicial={planInicial || undefined}
        />
      </div>
    </div>
  );
}

