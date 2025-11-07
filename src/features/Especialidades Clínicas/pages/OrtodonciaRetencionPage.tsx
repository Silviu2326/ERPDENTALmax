import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Calendar, Save, Upload, AlertCircle, Loader2, Package } from 'lucide-react';
import FormularioPlanRetencion from '../components/FormularioPlanRetencion';
import TablaSeguimientoRetencion from '../components/TablaSeguimientoRetencion';
import PanelIndicadoresRetencion from '../components/PanelIndicadoresRetencion';
import {
  obtenerPlanRetencion,
  crearPlanRetencion,
  actualizarPlanRetencion,
  agregarSeguimiento,
  actualizarSeguimiento,
  subirFotoSeguimiento,
  PlanRetencion,
  SeguimientoRetencion,
  CrearPlanRetencionRequest,
  CrearSeguimientoRequest,
} from '../api/retencionApi';

interface OrtodonciaRetencionPageProps {
  pacienteId?: string;
  tratamientoId?: string;
  onVolver?: () => void;
}

export default function OrtodonciaRetencionPage({
  pacienteId: pacienteIdProp,
  tratamientoId: tratamientoIdProp,
  onVolver,
}: OrtodonciaRetencionPageProps) {
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [tratamientoId, setTratamientoId] = useState<string>(tratamientoIdProp || '');
  const [plan, setPlan] = useState<PlanRetencion | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioSeguimiento, setMostrarFormularioSeguimiento] = useState(false);
  const [seguimientoEditando, setSeguimientoEditando] = useState<SeguimientoRetencion | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nuevaFechaSeguimiento, setNuevaFechaSeguimiento] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [nuevasObservacionesSeguimiento, setNuevasObservacionesSeguimiento] = useState('');
  const [subiendoFoto, setSubiendoFoto] = useState<string | null>(null);

  useEffect(() => {
    if (pacienteId) {
      cargarPlan();
    }
  }, [pacienteId]);

  const cargarPlan = async () => {
    if (!pacienteId) return;

    setCargando(true);
    setError(null);
    try {
      const planRetencion = await obtenerPlanRetencion(pacienteId);
      setPlan(planRetencion);
      setMostrarFormulario(false);
    } catch (err: any) {
      console.error('Error al cargar plan:', err);
      setError(err.message || 'Error al cargar el plan de retención');
      // Si no existe plan, mostrar formulario para crear uno
      if (err.message?.includes('404') || err.message?.includes('No hay plan')) {
        setPlan(null);
        setMostrarFormulario(true);
      }
    } finally {
      setCargando(false);
    }
  };

  const handleCrearPlan = async (datos: {
    fechaInicio: string;
    retenedores: any[];
    notasGenerales?: string;
  }) => {
    if (!pacienteId || !tratamientoId) {
      setError('Debe seleccionar un paciente y tratamiento');
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const request: CrearPlanRetencionRequest = {
        pacienteId,
        tratamientoId,
        fechaInicio: datos.fechaInicio,
        retenedores: datos.retenedores,
        notasGenerales: datos.notasGenerales,
      };
      const nuevoPlan = await crearPlanRetencion(request);
      setPlan(nuevoPlan);
      setMostrarFormulario(false);

      // Sugerir calendario de seguimientos
      sugerirCalendarioSeguimientos(nuevoPlan);
    } catch (err: any) {
      console.error('Error al crear plan:', err);
      setError(err.message || 'Error al crear el plan de retención');
    } finally {
      setCargando(false);
    }
  };

  const sugerirCalendarioSeguimientos = (planCreado: PlanRetencion) => {
    // Sugerir citas a 1, 3, 6 y 12 meses
    const fechaInicio = new Date(planCreado.fechaInicio);
    const sugerencias = [
      { meses: 1, label: '1 mes' },
      { meses: 3, label: '3 meses' },
      { meses: 6, label: '6 meses' },
      { meses: 12, label: '12 meses' },
    ];

    const mensaje = `¿Desea crear automáticamente las citas de seguimiento sugeridas?\n\n${sugerencias
      .map((s) => {
        const fecha = new Date(fechaInicio);
        fecha.setMonth(fecha.getMonth() + s.meses);
        return `- ${s.label}: ${fecha.toLocaleDateString('es-ES')}`;
      })
      .join('\n')}`;

    if (confirm(mensaje)) {
      // Crear seguimientos sugeridos
      sugerencias.forEach((sugerencia) => {
        const fecha = new Date(fechaInicio);
        fecha.setMonth(fecha.getMonth() + sugerencia.meses);
        agregarSeguimiento({
          planId: planCreado._id!,
          fechaCita: fecha.toISOString().split('T')[0],
          observaciones: `Control de seguimiento a ${sugerencia.label}`,
        });
      });
      // Recargar plan después de un momento
      setTimeout(() => cargarPlan(), 1000);
    }
  };

  const handleActualizarPlan = async (datos: { estado?: string; notasGenerales?: string }) => {
    if (!plan?._id) return;

    setCargando(true);
    setError(null);
    try {
      const planActualizado = await actualizarPlanRetencion(plan._id, datos);
      setPlan(planActualizado);
    } catch (err: any) {
      console.error('Error al actualizar plan:', err);
      setError(err.message || 'Error al actualizar el plan de retención');
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarSeguimiento = async () => {
    if (!plan?._id) return;

    setCargando(true);
    setError(null);
    try {
      const request: CrearSeguimientoRequest = {
        planId: plan._id,
        fechaCita: nuevaFechaSeguimiento,
        observaciones: nuevasObservacionesSeguimiento || undefined,
      };
      const planActualizado = await agregarSeguimiento(request);
      setPlan(planActualizado);
      setMostrarFormularioSeguimiento(false);
      setNuevaFechaSeguimiento(new Date().toISOString().split('T')[0]);
      setNuevasObservacionesSeguimiento('');
    } catch (err: any) {
      console.error('Error al agregar seguimiento:', err);
      setError(err.message || 'Error al agregar seguimiento');
    } finally {
      setCargando(false);
    }
  };

  const handleEditarSeguimiento = (seguimiento: SeguimientoRetencion) => {
    setSeguimientoEditando(seguimiento);
    setNuevaFechaSeguimiento(seguimiento.fechaCita.split('T')[0]);
    setNuevasObservacionesSeguimiento(seguimiento.observaciones);
    setMostrarFormularioSeguimiento(true);
  };

  const handleGuardarSeguimientoEditado = async () => {
    if (!seguimientoEditando?._id) return;

    setCargando(true);
    setError(null);
    try {
      await actualizarSeguimiento(seguimientoEditando._id, {
        observaciones: nuevasObservacionesSeguimiento,
      });
      await cargarPlan();
      setSeguimientoEditando(null);
      setMostrarFormularioSeguimiento(false);
      setNuevaFechaSeguimiento(new Date().toISOString().split('T')[0]);
      setNuevasObservacionesSeguimiento('');
    } catch (err: any) {
      console.error('Error al actualizar seguimiento:', err);
      setError(err.message || 'Error al actualizar seguimiento');
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarFoto = async (seguimientoId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setSubiendoFoto(seguimientoId);
      setError(null);
      try {
        const urlFoto = await subirFotoSeguimiento(seguimientoId, file);
        await cargarPlan();
        setSubiendoFoto(null);
      } catch (err: any) {
        console.error('Error al subir foto:', err);
        setError(err.message || 'Error al subir la foto');
        setSubiendoFoto(null);
      }
    };
    input.click();
  };

  if (cargando && !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-xl p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando plan de retención...</p>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                  >
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                )}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Calendar size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Ortodoncia: Retención y Contención
                  </h1>
                  <p className="text-gray-600">
                    Gestión de planes de retención post-ortodoncia
                  </p>
                </div>
              </div>
              {plan && (
                <button
                  onClick={() => setMostrarFormularioSeguimiento(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  <Plus size={20} className="mr-0" />
                  Nuevo Seguimiento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {!plan && !mostrarFormulario ? (
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay plan de retención activo
            </h3>
            <p className="text-gray-600 mb-4">
              Cree un nuevo plan de retención para este paciente
            </p>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <Plus size={20} className="mr-0" />
              Iniciar Nuevo Plan de Retención
            </button>
          </div>
        ) : mostrarFormulario ? (
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Crear Plan de Retención
            </h2>
            <FormularioPlanRetencion
              onSubmit={handleCrearPlan}
              onCancel={() => {
                setMostrarFormulario(false);
                if (plan) {
                  // Si ya hay un plan, no cancelar
                }
              }}
              loading={cargando}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Panel de indicadores */}
            <PanelIndicadoresRetencion plan={plan} />

            {/* Información del plan */}
            <div className="bg-white shadow-sm rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Información del Plan</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const nuevoEstado = plan.estado === 'Activo' ? 'Finalizado' : 'Activo';
                      handleActualizarPlan({ estado: nuevoEstado });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {plan.estado === 'Activo' ? 'Finalizar Plan' : 'Reactivar Plan'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <p className="text-gray-900">
                    {new Date(plan.fechaInicio).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                      plan.estado === 'Activo'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}
                  >
                    {plan.estado}
                  </span>
                </div>
              </div>

              {plan.notasGenerales && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notas Generales
                  </label>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {plan.notasGenerales}
                  </p>
                </div>
              )}
            </div>

            {/* Retenedores */}
            <div className="bg-white shadow-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Retenedores</h2>
              <div className="space-y-4">
                {plan.retenedores?.map((retenedor, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 bg-white ring-1 ring-slate-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Tipo
                        </label>
                        <p className="text-gray-900">{retenedor.tipo}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Arcada
                        </label>
                        <p className="text-gray-900">{retenedor.arcada}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Material
                        </label>
                        <p className="text-gray-900">{retenedor.material}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Fecha de Colocación
                        </label>
                        <p className="text-gray-900">
                          {new Date(retenedor.fechaColocacion).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Instrucciones
                        </label>
                        <p className="text-gray-900">{retenedor.instrucciones}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seguimientos */}
            <div className="bg-white shadow-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Seguimientos</h2>
              <TablaSeguimientoRetencion
                seguimientos={plan.seguimientos || []}
                onVerDetalle={(seguimiento) => {
                  // El modal se maneja dentro de TablaSeguimientoRetencion
                }}
                onEditar={handleEditarSeguimiento}
                onAgregarFoto={handleAgregarFoto}
              />
            </div>
          </div>
        )}

        {/* Modal de nuevo/editar seguimiento */}
        {mostrarFormularioSeguimiento && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {seguimientoEditando ? 'Editar Seguimiento' : 'Nuevo Seguimiento'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Cita *
                  </label>
                  <input
                    type="date"
                    value={nuevaFechaSeguimiento}
                    onChange={(e) => setNuevaFechaSeguimiento(e.target.value)}
                    required
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={nuevasObservacionesSeguimiento}
                    onChange={(e) => setNuevasObservacionesSeguimiento(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="Registre observaciones sobre la retención, estado de los retenedores, etc."
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setMostrarFormularioSeguimiento(false);
                    setSeguimientoEditando(null);
                    setNuevaFechaSeguimiento(new Date().toISOString().split('T')[0]);
                    setNuevasObservacionesSeguimiento('');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={seguimientoEditando ? handleGuardarSeguimientoEditado : handleAgregarSeguimiento}
                  disabled={cargando}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save size={20} className="mr-0" />
                  {cargando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

