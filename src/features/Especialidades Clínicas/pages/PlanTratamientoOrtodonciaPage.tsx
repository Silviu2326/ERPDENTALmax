import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, Calendar, CheckCircle, XCircle, Clock, Edit, Trash2, Eye } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onVolver && (
              <button
                onClick={onVolver}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-violet-600 p-3 rounded-xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Planes de Tratamiento de Ortodoncia
                </h1>
                <p className="text-gray-600 mt-1">
                  Gestión integral de planes de tratamiento ortodóncicos
                </p>
              </div>
            </div>
          </div>
          {pacienteId && (
            <button
              onClick={handleCrearNuevo}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Nuevo Plan</span>
            </button>
          )}
        </div>

        {/* Selector de paciente si no se proporciona */}
        {!pacienteId && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID del Paciente
            </label>
            <input
              type="text"
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              placeholder="Ingrese el ID del paciente"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={cargarPlanes}
              className="mt-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Cargar Planes
            </button>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error al cargar los planes</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Lista de planes */}
        {cargando ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : planes.length === 0 && pacienteId ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay planes de tratamiento
            </h3>
            <p className="text-gray-500 mb-6">
              Cree un nuevo plan de tratamiento para comenzar
            </p>
            <button
              onClick={handleCrearNuevo}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Primer Plan</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
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
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
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
                            <Calendar className="w-4 h-4" />
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
                            <p className="text-sm font-semibold text-gray-700 mb-1">Objetivos:</p>
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
                            <p className="text-sm font-semibold text-gray-700 mb-1">
                              Fases: {plan.fases.length}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {plan.fases.map((fase, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md"
                                >
                                  {fase.nombre}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleVerDetalle(plan._id!)}
                        className="flex items-center gap-2 px-4 py-2 text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Ver Detalle</span>
                      </button>
                      <button
                        onClick={() => handleEditar(plan._id!)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm font-medium">Editar</span>
                      </button>
                      <button
                        onClick={() => handleEliminar(plan._id!)}
                        className="flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Eliminar</span>
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
  );
}


