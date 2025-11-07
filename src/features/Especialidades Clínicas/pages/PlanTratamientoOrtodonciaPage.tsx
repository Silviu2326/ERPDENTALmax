import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, Calendar, CheckCircle, XCircle, Clock, Edit, Trash2, Eye, Loader2, AlertCircle, Package } from 'lucide-react';
import {
  obtenerPlanesPorPaciente,
  eliminarPlanTratamiento,
  PlanTratamientoOrtodoncia,
} from '../api/ortodonciaPlanTratamientoApi';

interface PlanTratamientoOrtodonciaPageProps {
  pacienteId?: string;
  onVolver?: () => void;
  onVerDetalle?: (planId: string) => void;
  onCrearNuevo?: () => void;
  onEditar?: (planId: string) => void;
}

const estadosConfig = {
  'Propuesto': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
  'Aceptado': { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle },
  'En Progreso': { color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: Clock },
  'Finalizado': { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
  'Rechazado': { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
};

export default function PlanTratamientoOrtodonciaPage({
  pacienteId: pacienteIdProp,
  onVolver,
  onVerDetalle,
  onCrearNuevo,
  onEditar,
}: PlanTratamientoOrtodonciaPageProps) {
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [planes, setPlanes] = useState<PlanTratamientoOrtodoncia[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pacienteId) {
      cargarPlanes();
    }
  }, [pacienteId]);

  const cargarPlanes = async () => {
    if (!pacienteId) return;

    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerPlanesPorPaciente(pacienteId);
      setPlanes(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los planes de tratamiento');
      setPlanes([]);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (planId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este plan de tratamiento?')) {
      return;
    }

    try {
      await eliminarPlanTratamiento(planId);
      await cargarPlanes();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el plan de tratamiento');
    }
  };

  const handleVerDetalle = (planId: string) => {
    if (onVerDetalle) {
      onVerDetalle(planId);
    }
  };

  const handleEditar = (planId: string) => {
    if (onEditar) {
      onEditar(planId);
    }
  };

  const handleCrearNuevo = () => {
    if (onCrearNuevo) {
      onCrearNuevo();
    }
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
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Volver"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Planes de Tratamiento de Ortodoncia
                    </h1>
                    <p className="text-gray-600">
                      Gestión integral de planes de tratamiento ortodóncicos
                    </p>
                  </div>
                </div>
              </div>
              {pacienteId && (
                <div className="flex items-center justify-end">
                  <button
                    onClick={handleCrearNuevo}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                  >
                    <Plus size={20} className="mr-2" />
                    Nuevo Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">

        {/* Selector de paciente si no se proporciona */}
        {!pacienteId && (
          <div className="bg-white shadow-sm rounded-2xl p-6 mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ID del Paciente
            </label>
            <input
              type="text"
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              placeholder="Ingrese el ID del paciente"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            />
            <button
              onClick={cargarPlanes}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              Cargar Planes
            </button>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-white shadow-sm rounded-2xl p-8 text-center mb-6">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        )}

        {/* Lista de planes */}
        <div className="space-y-6">
          {cargando ? (
            <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </div>
          ) : planes.length === 0 && pacienteId ? (
            <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay planes de tratamiento</h3>
              <p className="text-gray-600 mb-4">Cree un nuevo plan de tratamiento para comenzar</p>
              <button
                onClick={handleCrearNuevo}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                <Plus size={20} className="mr-2" />
                Crear Primer Plan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
            {planes.map((plan) => {
              const estadoInfo = estadosConfig[plan.estado];
              const EstadoIcon = estadoInfo.icon;
              const fechaCreacion = plan.fechaCreacion
                ? new Date(plan.fechaCreacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Fecha no disponible';

              return (
                <div
                  key={plan._id}
                  className="bg-white shadow-sm rounded-2xl transition-shadow overflow-hidden hover:shadow-md h-full flex flex-col"
                >
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Plan de Tratamiento #{plan._id?.substring(0, 8)}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${estadoInfo.color}`}
                          >
                            <EstadoIcon className="w-3.5 h-3.5" />
                            {plan.estado}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="opacity-70" />
                            <span>{fechaCreacion}</span>
                          </div>
                        </div>
                        {plan.diagnostico?.resumen && (
                          <p className="text-gray-700 mb-3 line-clamp-2">
                            {plan.diagnostico.resumen}
                          </p>
                        )}
                        {plan.objetivosTratamiento && plan.objetivosTratamiento.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-slate-700 mb-1">Objetivos:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {plan.objetivosTratamiento.slice(0, 3).map((objetivo, idx) => (
                                <li key={idx}>{objetivo}</li>
                              ))}
                              {plan.objetivosTratamiento.length > 3 && (
                                <li className="text-gray-500">
                                  +{plan.objetivosTratamiento.length - 3} más
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                        {plan.fases && plan.fases.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-slate-700 mb-1">
                              Fases: {plan.fases.length}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {plan.fases.map((fase, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                                >
                                  {fase.nombre}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleVerDetalle(plan._id!)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all"
                      >
                        <Eye size={16} />
                        <span>Ver Detalle</span>
                      </button>
                      <button
                        onClick={() => handleEditar(plan._id!)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all"
                      >
                        <Edit size={16} />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleEliminar(plan._id!)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={16} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



