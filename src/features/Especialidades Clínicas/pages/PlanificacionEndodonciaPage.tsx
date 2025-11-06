import { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, ClipboardList } from 'lucide-react';
import EndoPlanForm from '../components/EndoPlanForm';
import HistorialPlanesEndoPaciente from '../components/HistorialPlanesEndoPaciente';
import { obtenerPlanesPorPaciente, PlanEndodoncia } from '../api/planEndodonciaApi';

interface PlanificacionEndodonciaPageProps {
  pacienteId?: string;
  tratamientoId?: string;
  diente?: number;
  onVolver?: () => void;
  onRegistroEndodoncia?: (tratamientoId: string, pacienteId: string, diente: number) => void;
}

export default function PlanificacionEndodonciaPage({
  pacienteId: pacienteIdProp,
  tratamientoId: tratamientoIdProp,
  diente: dienteProp,
  onVolver,
  onRegistroEndodoncia,
}: PlanificacionEndodonciaPageProps) {
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [tratamientoId, setTratamientoId] = useState<string>(tratamientoIdProp || '');
  const [diente, setDiente] = useState<number | undefined>(dienteProp);
  const [planId, setPlanId] = useState<string | null>(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [planes, setPlanes] = useState<PlanEndodoncia[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (pacienteId) {
      cargarHistorialPlanes();
    }
  }, [pacienteId]);

  const cargarHistorialPlanes = async () => {
    if (!pacienteId) return;
    
    setCargando(true);
    try {
      const planesData = await obtenerPlanesPorPaciente(pacienteId);
      setPlanes(planesData);
    } catch (error) {
      console.error('Error al cargar historial de planes:', error);
    } finally {
      setCargando(false);
    }
  };

  const handlePlanGuardado = (plan: PlanEndodoncia) => {
    setPlanId(plan._id || null);
    cargarHistorialPlanes();
  };

  const handleEditarPlan = (plan: PlanEndodoncia) => {
    setPlanId(plan._id || null);
    setTratamientoId(plan.tratamientoId || '');
    setDiente(plan.diente);
    setMostrarHistorial(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Endodoncia: Planificación</h1>
                  <p className="text-sm text-gray-600">Planificación de tratamientos de conducto radicular</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {pacienteId && tratamientoId && numeroDiente && onRegistroEndodoncia && (
                <button
                  onClick={() => onRegistroEndodoncia(tratamientoId, pacienteId, numeroDiente)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" />
                  Registro de Conductos
                </button>
              )}
              {pacienteId && (
                <button
                  onClick={() => setMostrarHistorial(!mostrarHistorial)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  {mostrarHistorial ? 'Nuevo Plan' : 'Historial'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {mostrarHistorial && pacienteId ? (
          <HistorialPlanesEndoPaciente
            pacienteId={pacienteId}
            planes={planes}
            cargando={cargando}
            onEditarPlan={handleEditarPlan}
            onNuevoPlan={() => {
              setMostrarHistorial(false);
              setPlanId(null);
            }}
          />
        ) : (
          <EndoPlanForm
            pacienteId={pacienteId}
            tratamientoId={tratamientoId}
            diente={diente}
            planId={planId}
            onPlanGuardado={handlePlanGuardado}
            onCambiarPaciente={(id) => {
              setPacienteId(id);
              setPlanId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

