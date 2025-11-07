import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Plus, X, ClipboardCheck, Loader2, AlertCircle } from 'lucide-react';
import {
  obtenerPlanPorId,
  actualizarPlanTratamiento,
  adjuntarArchivosDiagnostico,
  PlanTratamientoOrtodoncia,
  DiagnosticoOrtodoncico,
  FaseTratamiento,
} from '../api/ortodonciaPlanTratamientoApi';

interface DetallePlanTratamientoOrtodonciaPageProps {
  planId: string;
  onVolver?: () => void;
  onGuardado?: () => void;
}

export default function DetallePlanTratamientoOrtodonciaPage({
  planId,
  onVolver,
  onGuardado,
}: DetallePlanTratamientoOrtodonciaPageProps) {
  const [plan, setPlan] = useState<PlanTratamientoOrtodoncia | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  // Estados del formulario
  const [diagnostico, setDiagnostico] = useState<DiagnosticoOrtodoncico>({
    claseEsqueletal: '',
    patronFacial: '',
    analisisDental: '',
    resumen: '',
  });
  const [objetivos, setObjetivos] = useState<string[]>(['']);
  const [fases, setFases] = useState<FaseTratamiento[]>([]);
  const [notas, setNotas] = useState('');

  useEffect(() => {
    cargarPlan();
  }, [planId]);

  const cargarPlan = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerPlanPorId(planId);
      setPlan(datos);
      setDiagnostico(datos.diagnostico || {
        claseEsqueletal: '',
        patronFacial: '',
        analisisDental: '',
        resumen: '',
      });
      setObjetivos(datos.objetivosTratamiento && datos.objetivosTratamiento.length > 0 
        ? datos.objetivosTratamiento 
        : ['']);
      setFases(datos.fases || []);
      setNotas(datos.notas || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el plan de tratamiento');
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async () => {
    if (!plan) return;

    setGuardando(true);
    setError(null);
    try {
      const objetivosFiltrados = objetivos.filter(obj => obj.trim() !== '');
      await actualizarPlanTratamiento(planId, {
        diagnostico,
        objetivos: objetivosFiltrados,
        fases,
        notas,
      });
      setEditando(false);
      await cargarPlan();
      if (onGuardado) {
        onGuardado();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el plan de tratamiento');
    } finally {
      setGuardando(false);
    }
  };

  const handleAgregarObjetivo = () => {
    setObjetivos([...objetivos, '']);
  };

  const handleEliminarObjetivo = (index: number) => {
    setObjetivos(objetivos.filter((_, i) => i !== index));
  };

  const handleObjetivoChange = (index: number, valor: string) => {
    const nuevosObjetivos = [...objetivos];
    nuevosObjetivos[index] = valor;
    setObjetivos(nuevosObjetivos);
  };

  const handleAgregarFase = () => {
    setFases([
      ...fases,
      {
        nombre: '',
        descripcion: '',
        aparatologia: '',
        duracionEstimadaMeses: 0,
        citasRequeridas: 0,
      },
    ]);
  };

  const handleEliminarFase = (index: number) => {
    setFases(fases.filter((_, i) => i !== index));
  };

  const handleFaseChange = (index: number, campo: keyof FaseTratamiento, valor: any) => {
    const nuevasFases = [...fases];
    nuevasFases[index] = { ...nuevasFases[index], [campo]: valor };
    setFases(nuevasFases);
  };

  const handleSubirArchivos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!plan || !event.target.files || event.target.files.length === 0) return;

    const archivos = Array.from(event.target.files);
    try {
      await adjuntarArchivosDiagnostico(planId, archivos, 'fotos');
      await cargarPlan();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al subir archivos');
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft size={20} />
                Volver
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!plan) return null;

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
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    aria-label="Volver"
                  >
                    <ArrowLeft size={20} className="text-gray-700" />
                  </button>
                )}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ClipboardCheck size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Plan de Tratamiento de Ortodoncia
                  </h1>
                  <p className="text-gray-600">
                    Plan #{plan._id?.substring(0, 8)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {editando ? (
                  <>
                    <button
                      onClick={() => {
                        setEditando(false);
                        cargarPlan();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-lg hover:bg-gray-50 transition-all ring-1 ring-slate-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleGuardar}
                      disabled={guardando}
                      className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <Save size={20} />
                      {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditando(true)}
                    className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagnóstico */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Diagnóstico</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Clase Esqueletal
                  </label>
                  <input
                    type="text"
                    value={diagnostico.claseEsqueletal}
                    onChange={(e) => setDiagnostico({ ...diagnostico, claseEsqueletal: e.target.value })}
                    disabled={!editando}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Patrón Facial
                  </label>
                  <input
                    type="text"
                    value={diagnostico.patronFacial}
                    onChange={(e) => setDiagnostico({ ...diagnostico, patronFacial: e.target.value })}
                    disabled={!editando}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Análisis Dental
                  </label>
                  <textarea
                    value={diagnostico.analisisDental}
                    onChange={(e) => setDiagnostico({ ...diagnostico, analisisDental: e.target.value })}
                    disabled={!editando}
                    rows={3}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Resumen
                  </label>
                  <textarea
                    value={diagnostico.resumen}
                    onChange={(e) => setDiagnostico({ ...diagnostico, resumen: e.target.value })}
                    disabled={!editando}
                    rows={4}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Objetivos de Tratamiento */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Objetivos de Tratamiento</h2>
                {editando && (
                  <button
                    onClick={handleAgregarObjetivo}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Plus size={16} />
                    Agregar
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {objetivos.map((objetivo, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={objetivo}
                      onChange={(e) => handleObjetivoChange(index, e.target.value)}
                      disabled={!editando}
                      placeholder="Escriba un objetivo..."
                      className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
                    />
                    {editando && objetivos.length > 1 && (
                      <button
                        onClick={() => handleEliminarObjetivo(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Eliminar objetivo"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Fases del Tratamiento */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Fases del Tratamiento</h2>
                {editando && (
                  <button
                    onClick={handleAgregarFase}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Plus size={16} />
                    Agregar Fase
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {fases.map((fase, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 ring-1 ring-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Fase {index + 1}</h3>
                      {editando && (
                        <button
                          onClick={() => handleEliminarFase(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Eliminar fase"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={fase.nombre}
                          onChange={(e) => handleFaseChange(index, 'nombre', e.target.value)}
                          disabled={!editando}
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Aparatología
                        </label>
                        <input
                          type="text"
                          value={fase.aparatologia}
                          onChange={(e) => handleFaseChange(index, 'aparatologia', e.target.value)}
                          disabled={!editando}
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Duración (meses)
                        </label>
                        <input
                          type="number"
                          value={fase.duracionEstimadaMeses}
                          onChange={(e) => handleFaseChange(index, 'duracionEstimadaMeses', parseInt(e.target.value) || 0)}
                          disabled={!editando}
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Citas Requeridas
                        </label>
                        <input
                          type="number"
                          value={fase.citasRequeridas}
                          onChange={(e) => handleFaseChange(index, 'citasRequeridas', parseInt(e.target.value) || 0)}
                          disabled={!editando}
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Descripción
                        </label>
                        <textarea
                          value={fase.descripcion}
                          onChange={(e) => handleFaseChange(index, 'descripcion', e.target.value)}
                          disabled={!editando}
                          rows={2}
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {fases.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No hay fases definidas. {editando && 'Agregue una fase para comenzar.'}
                  </p>
                )}
              </div>
            </div>

            {/* Notas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Notas</h2>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                disabled={!editando}
                rows={5}
                placeholder="Notas adicionales sobre el plan de tratamiento..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:bg-gray-100 disabled:text-slate-500"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información General */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información General</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-600">Estado:</span>
                  <span className="ml-2 font-semibold text-gray-900">{plan.estado}</span>
                </div>
                <div>
                  <span className="text-slate-600">Fecha de Creación:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {plan.fechaCreacion
                      ? new Date(plan.fechaCreacion).toLocaleDateString('es-ES')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Estudios */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Estudios</h2>
                {editando && (
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer">
                    <Upload size={16} />
                    Subir
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleSubirArchivos}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-600">Fotos:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {plan.estudios?.fotos?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Radiografías:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {plan.estudios?.radiografias?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Medidas Cefalométricas:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {plan.estudios?.cefalometria?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



