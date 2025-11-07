import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, AlertCircle, Loader2, Save, FileText, Boxes3D, X } from 'lucide-react';
import {
  PlanificacionImplantologia3D,
  ImplanteVirtual,
  DatosPlanificacion,
  crearPlanificacion,
  obtenerPlanificacionesPorPaciente,
  obtenerPlanificacionPorId,
  actualizarPlanificacion,
} from '../api/planificacion3DApi';
import VisorDicom3D from '../components/VisorDicom3D';
import PanelHerramientasPlanificacion from '../components/PanelHerramientasPlanificacion';
import SelectorImplantesVirtuales from '../components/SelectorImplantesVirtuales';
import GestorCapasVisualizacion from '../components/GestorCapasVisualizacion';

interface PlanificacionImplantologia3DPageProps {
  pacienteId?: string;
  planificacionId?: string;
  onVolver: () => void;
}

export default function PlanificacionImplantologia3DPage({
  pacienteId: pacienteIdProp,
  planificacionId: planificacionIdProp,
  onVolver,
}: PlanificacionImplantologia3DPageProps) {
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [planificacionActual, setPlanificacionActual] = useState<PlanificacionImplantologia3D | null>(null);
  const [planificaciones, setPlanificaciones] = useState<PlanificacionImplantologia3D[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [archivosDicom, setArchivosDicom] = useState<File[]>([]);
  const [mostrarUpload, setMostrarUpload] = useState(false);
  const [herramientaActiva, setHerramientaActiva] = useState<'medir' | 'trazar' | 'seleccionar' | null>(null);
  const [implanteSeleccionado, setImplanteSeleccionado] = useState<ImplanteVirtual | null>(null);
  const [datosPlanificacion, setDatosPlanificacion] = useState<DatosPlanificacion>({
    implantes: [],
    mediciones: [],
    trazadoNervios: [],
    notas: '',
  });
  const [visibilidadCapas, setVisibilidadCapas] = useState({
    hueso: true,
    nervios: true,
    implantes: true,
    mediciones: true,
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (planificacionIdProp) {
      cargarPlanificacion(planificacionIdProp);
    } else if (pacienteId) {
      cargarPlanificaciones();
    }
  }, [planificacionIdProp, pacienteId]);

  const cargarPlanificaciones = async () => {
    if (!pacienteId) return;
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerPlanificacionesPorPaciente(pacienteId);
      setPlanificaciones(data);
      if (data.length > 0 && !planificacionActual) {
        setPlanificacionActual(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar planificaciones');
    } finally {
      setCargando(false);
    }
  };

  const cargarPlanificacion = async (id: string) => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerPlanificacionPorId(id);
      setPlanificacionActual(data);
      if (data.datosPlanificacion) {
        setDatosPlanificacion(data.datosPlanificacion);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar planificación');
    } finally {
      setCargando(false);
    }
  };

  const handleSubirArchivos = async () => {
    if (!pacienteId || archivosDicom.length === 0) {
      setError('Debe seleccionar un paciente y al menos un archivo DICOM');
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const nuevaPlanificacion = await crearPlanificacion(
        pacienteId,
        'Nueva planificación 3D',
        archivosDicom
      );
      setPlanificacionActual(nuevaPlanificacion);
      setArchivosDicom([]);
      setMostrarUpload(false);
      await cargarPlanificaciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir archivos');
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async () => {
    if (!planificacionActual?._id) {
      setError('No hay una planificación activa para guardar');
      return;
    }

    setGuardando(true);
    setError(null);
    try {
      const actualizada = await actualizarPlanificacion(
        planificacionActual._id,
        datosPlanificacion
      );
      setPlanificacionActual(actualizada);
      // Mostrar mensaje de éxito
      alert('Planificación guardada correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar planificación');
    } finally {
      setGuardando(false);
    }
  };

  const handleToggleCapa = (capa: 'hueso' | 'nervios' | 'implantes' | 'mediciones') => {
    setVisibilidadCapas((prev) => ({
      ...prev,
      [capa]: !prev[capa],
    }));
  };

  const capasVisualizacion = [
    { id: 'hueso', nombre: 'Hueso', visible: visibilidadCapas.hueso, opacidad: 1 },
    { id: 'nervios', nombre: 'Nervios', visible: visibilidadCapas.nervios, opacidad: 0.8 },
    { id: 'implantes', nombre: 'Implantes', visible: visibilidadCapas.implantes, opacidad: 1 },
    { id: 'mediciones', nombre: 'Mediciones', visible: visibilidadCapas.mediciones, opacidad: 1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center">
                  {/* Icono con contenedor */}
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Boxes3D size={24} className="text-blue-600" />
                  </div>
                  
                  {/* Título y descripción */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Planificación 3D de Implantología
                    </h1>
                    <p className="text-gray-600">
                      Planificación precisa de implantes dentales mediante CBCT
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {planificacionActual && (
                  <button
                    onClick={handleGuardar}
                    disabled={guardando}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {guardando ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Guardar
                  </button>
                )}
                {!planificacionActual && (
                  <button
                    onClick={() => setMostrarUpload(true)}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload className="w-4 h-4" />
                    Subir DICOM
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Panel izquierdo - Herramientas y controles */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <PanelHerramientasPlanificacion
              onHerramientaSeleccionada={setHerramientaActiva}
              herramientaActiva={herramientaActiva}
              mediciones={datosPlanificacion.mediciones}
              trazadosNervios={datosPlanificacion.trazadoNervios}
              onToggleCapa={handleToggleCapa}
              visibilidadCapas={visibilidadCapas}
              onGuardar={handleGuardar}
              onReset={() => {
                setDatosPlanificacion({
                  implantes: [],
                  mediciones: [],
                  trazadoNervios: [],
                  notas: '',
                });
              }}
            />

            <SelectorImplantesVirtuales
              onImplanteSeleccionado={setImplanteSeleccionado}
              implanteSeleccionado={implanteSeleccionado}
            />

            <GestorCapasVisualizacion
              capas={capasVisualizacion}
              onToggleVisibilidad={(id) => {
                const capa = capasVisualizacion.find((c) => c.id === id);
                if (capa) {
                  handleToggleCapa(id as 'hueso' | 'nervios' | 'implantes' | 'mediciones');
                }
              }}
              onCambiarOpacidad={(id, opacidad) => {
                // TODO: Implementar cambio de opacidad
                console.log(`Cambiar opacidad de ${id} a ${opacidad}`);
              }}
            />
          </div>

          {/* Panel central - Visor 3D */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {planificacionActual ? (
                <VisorDicom3D
                  modeloProcesadoPath={planificacionActual.modeloProcesadoPath}
                  archivosDicomPaths={planificacionActual.archivosDicomPaths}
                  estadoProcesamiento={planificacionActual.estadoProcesamiento}
                  onModeloCargado={() => {
                    console.log('Modelo 3D cargado');
                  }}
                />
              ) : (
                <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay planificación activa</h3>
                  <p className="text-gray-600 mb-4">
                    Sube archivos DICOM para comenzar una nueva planificación
                  </p>
                  <button
                    onClick={() => setMostrarUpload(true)}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload className="w-4 h-4" />
                    Subir Archivos DICOM
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de subida de archivos */}
      {mostrarUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Subir Archivos DICOM</h3>
              <button
                onClick={() => {
                  setMostrarUpload(false);
                  setArchivosDicom([]);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {!pacienteId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID del Paciente
                  </label>
                  <input
                    type="text"
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    placeholder="Ingrese el ID del paciente"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seleccionar archivos DICOM
                </label>
                <input
                  type="file"
                  multiple
                  accept=".dcm,.dicom"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setArchivosDicom(files);
                  }}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
                {archivosDicom.length > 0 && (
                  <p className="text-sm text-slate-600 mt-2">
                    {archivosDicom.length} archivo(s) seleccionado(s)
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubirArchivos}
                disabled={!pacienteId || archivosDicom.length === 0 || cargando}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Subir Archivos
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setMostrarUpload(false);
                  setArchivosDicom([]);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



