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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-all"
                    aria-label="Volver"
                  >
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                )}
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Endodoncia: Planificación
                    </h1>
                    <p className="text-gray-600">
                      Planificación de tratamientos de conducto radicular
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {pacienteId && tratamientoId && diente && onRegistroEndodoncia && (
                  <button
                    onClick={() => onRegistroEndodoncia(tratamientoId, pacienteId, diente)}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  >
                    <ClipboardList size={20} />
                    Registro de Conductos
                  </button>
                )}
                {pacienteId && (
                  <button
                    onClick={() => setMostrarHistorial(!mostrarHistorial)}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70 bg-slate-100"
                  >
                    {mostrarHistorial ? 'Nuevo Plan' : 'Historial'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
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

