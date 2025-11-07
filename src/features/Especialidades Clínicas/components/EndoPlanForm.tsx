import { useState, useEffect } from 'react';
import { Save, User, Search, AlertCircle, Loader2 } from 'lucide-react';
import DienteEndoSelector from './DienteEndoSelector';
import ConductometriaInputGroup from './ConductometriaInputGroup';
import { crearPlanEndodoncia, actualizarPlanEndodoncia, obtenerPlanPorId, PlanEndodoncia, Conductometria } from '../api/planEndodonciaApi';
import { useAuth } from '../../../contexts/AuthContext';

interface EndoPlanFormProps {
  pacienteId?: string;
  tratamientoId?: string;
  diente?: number;
  planId?: string | null;
  onPlanGuardado: (plan: PlanEndodoncia) => void;
  onCambiarPaciente: (pacienteId: string) => void;
}

export default function EndoPlanForm({
  pacienteId: pacienteIdProp,
  tratamientoId: tratamientoIdProp,
  diente: dienteProp,
  planId,
  onPlanGuardado,
  onCambiarPaciente,
}: EndoPlanFormProps) {
  const { user } = useAuth();
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [tratamientoId, setTratamientoId] = useState<string>(tratamientoIdProp || '');
  const [dienteSeleccionado, setDienteSeleccionado] = useState<number | undefined>(dienteProp);
  const [diagnosticoPulpar, setDiagnosticoPulpar] = useState('');
  const [diagnosticoPeriapical, setDiagnosticoPeriapical] = useState('');
  const [conductometria, setConductometria] = useState<Conductometria[]>([]);
  const [tecnicaInstrumentacion, setTecnicaInstrumentacion] = useState('');
  const [tecnicaObturacion, setTecnicaObturacion] = useState('');
  const [medicacionIntraconducto, setMedicacionIntraconducto] = useState('');
  const [notas, setNotas] = useState('');
  const [estado, setEstado] = useState<'Planificado' | 'En Progreso' | 'Finalizado'>('Planificado');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (planId) {
      cargarPlan();
    }
  }, [planId]);

  const cargarPlan = async () => {
    if (!planId) return;
    
    setCargando(true);
    try {
      const plan = await obtenerPlanPorId(planId);
      setPacienteId(plan.pacienteId);
      setTratamientoId(plan.tratamientoId || '');
      setDienteSeleccionado(plan.diente);
      setDiagnosticoPulpar(plan.diagnosticoPulpar || '');
      setDiagnosticoPeriapical(plan.diagnosticoPeriapical || '');
      setConductometria(plan.conductometria || []);
      setTecnicaInstrumentacion(plan.tecnicaInstrumentacion || '');
      setTecnicaObturacion(plan.tecnicaObturacion || '');
      setMedicacionIntraconducto(plan.medicacionIntraconducto || '');
      setNotas(plan.notas || '');
      setEstado(plan.estado || 'Planificado');
    } catch (error) {
      console.error('Error al cargar plan:', error);
      setError('Error al cargar el plan de endodoncia');
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async () => {
    if (!pacienteId || !dienteSeleccionado) {
      setError('Debe seleccionar un paciente y un diente');
      return;
    }

    if (!user?._id) {
      setError('No se pudo identificar al odontólogo');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const planData: Partial<PlanEndodoncia> = {
        pacienteId,
        odontologoId: user._id,
        tratamientoId: tratamientoId || undefined,
        diente: dienteSeleccionado,
        diagnosticoPulpar,
        diagnosticoPeriapical,
        conductometria,
        tecnicaInstrumentacion,
        tecnicaObturacion,
        medicacionIntraconducto,
        notas,
        estado,
      };

      let plan: PlanEndodoncia;
      if (planId) {
        plan = await actualizarPlanEndodoncia(planId, planData);
      } else {
        plan = await crearPlanEndodoncia(planData as any);
      }

      onPlanGuardado(plan);
    } catch (error: any) {
      console.error('Error al guardar plan:', error);
      setError(error.message || 'Error al guardar el plan de endodoncia');
    } finally {
      setGuardando(false);
    }
  };

  const handleAgregarConducto = () => {
    setConductometria([
      ...conductometria,
      {
        nombreCanal: '',
        longitudTentativa: 0,
        limaReferencia: 0,
        longitudRealTrabajo: 0,
        instrumentoApicalMaestro: 0,
      },
    ]);
  };

  const handleEliminarConducto = (index: number) => {
    setConductometria(conductometria.filter((_, i) => i !== index));
  };

  const handleActualizarConducto = (index: number, datos: Conductometria) => {
    const nuevaConductometria = [...conductometria];
    nuevaConductometria[index] = datos;
    setConductometria(nuevaConductometria);
  };

  const handleBuscarPaciente = () => {
    const id = prompt('Ingrese el ID del paciente:');
    if (id) {
      setPacienteId(id);
      onCambiarPaciente(id);
    }
  };

  if (cargando) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando plan de endodoncia...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 ring-1 ring-red-200 rounded-xl flex items-center gap-2 text-red-700">
          <AlertCircle size={20} className="text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Selección de paciente */}
      <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User size={20} className="text-slate-600" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Paciente
              </label>
              {pacienteId ? (
                <span className="text-gray-900 font-medium">ID: {pacienteId}</span>
              ) : (
                <span className="text-slate-500 text-sm">No seleccionado</span>
              )}
            </div>
          </div>
          <button
            onClick={handleBuscarPaciente}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Search size={20} />
            <span>Buscar Paciente</span>
          </button>
        </div>
      </div>

      {/* Selector de diente */}
      <div>
        <DienteEndoSelector
          dienteSeleccionado={dienteSeleccionado}
          onDienteSeleccionado={setDienteSeleccionado}
        />
      </div>

      {/* Diagnósticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Diagnóstico Pulpar
          </label>
          <input
            type="text"
            value={diagnosticoPulpar}
            onChange={(e) => setDiagnosticoPulpar(e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
            placeholder="Ej: Pulpitis irreversible"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Diagnóstico Periapical
          </label>
          <input
            type="text"
            value={diagnosticoPeriapical}
            onChange={(e) => setDiagnosticoPeriapical(e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
            placeholder="Ej: Periodontitis apical aguda"
          />
        </div>
      </div>

      {/* Conductometría */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Conductometría</h3>
          <button
            onClick={handleAgregarConducto}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-green-600 text-white hover:bg-green-700 shadow-sm"
          >
            + Agregar Conducto
          </button>
        </div>
        {conductometria.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl ring-1 ring-slate-200 border-2 border-dashed border-slate-300">
            <p className="text-slate-600">No hay conductos agregados. Haga clic en "Agregar Conducto" para comenzar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conductometria.map((conducto, index) => (
              <ConductometriaInputGroup
                key={index}
                conducto={conducto}
                index={index}
                onActualizar={(datos) => handleActualizarConducto(index, datos)}
                onEliminar={() => handleEliminarConducto(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Técnicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Técnica de Instrumentación
          </label>
          <select
            value={tecnicaInstrumentacion}
            onChange={(e) => setTecnicaInstrumentacion(e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
          >
            <option value="">Seleccione una técnica</option>
            <option value="manual">Manual</option>
            <option value="rotatoria">Rotatoria</option>
            <option value="reciprocante">Reciprocante</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Técnica de Obturación
          </label>
          <select
            value={tecnicaObturacion}
            onChange={(e) => setTecnicaObturacion(e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
          >
            <option value="">Seleccione una técnica</option>
            <option value="condensacion-lateral">Condensación Lateral</option>
            <option value="condensacion-vertical">Condensación Vertical</option>
            <option value="gutta-percha">Gutta Percha</option>
          </select>
        </div>
      </div>

      {/* Medicación */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Medicación Intraconducto
        </label>
        <input
          type="text"
          value={medicacionIntraconducto}
          onChange={(e) => setMedicacionIntraconducto(e.target.value)}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
          placeholder="Ej: Hidróxido de calcio"
        />
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Estado del Plan
        </label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as any)}
          className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
        >
          <option value="Planificado">Planificado</option>
          <option value="En Progreso">En Progreso</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Notas Clínicas
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={4}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
          placeholder="Ingrese notas adicionales sobre el tratamiento..."
        />
      </div>

      {/* Botón guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleGuardar}
          disabled={guardando || !pacienteId || !dienteSeleccionado}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          <span>{guardando ? 'Guardando...' : planId ? 'Actualizar Plan' : 'Guardar Plan'}</span>
        </button>
      </div>
    </div>
  );
}



