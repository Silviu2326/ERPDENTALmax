import { useState, useEffect } from 'react';
import { ClipboardList, Eye, Edit, Trash2 } from 'lucide-react';
import { PerfilCompletoPaciente, PlanTratamiento, obtenerPerfilCompletoPaciente } from '../../api/pacienteApi';

interface TablaPlanesTratamientoProps {
  pacienteId: string;
}

export default function TablaPlanesTratamiento({ pacienteId }: TablaPlanesTratamientoProps) {
  const [planes, setPlanes] = useState<PlanTratamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarPlanes = async () => {
      setLoading(true);
      setError(null);
      try {
        const perfil: PerfilCompletoPaciente = await obtenerPerfilCompletoPaciente(pacienteId);
        setPlanes(perfil.planesTratamiento || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los planes de tratamiento');
      } finally {
        setLoading(false);
      }
    };

    if (pacienteId) {
      cargarPlanes();
    }
  }, [pacienteId]);

  const getEstadoBadge = (estado?: string) => {
    const estados: Record<string, { color: string; label: string }> = {
      borrador: { color: 'bg-gray-100 text-gray-800', label: 'Borrador' },
      aprobado: { color: 'bg-blue-100 text-blue-800', label: 'Aprobado' },
      en_proceso: { color: 'bg-yellow-100 text-yellow-800', label: 'En Proceso' },
      completado: { color: 'bg-green-100 text-green-800', label: 'Completado' },
      cancelado: { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
    };
    const estadoInfo = estados[estado || 'borrador'] || estados.borrador;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
        {estadoInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  // Calcular estadísticas
  const totalPlanes = planes.length;
  const planesActivos = planes.filter(p => p.estado === 'activo' || p.estado === 'en_proceso').length;
  const planesCompletados = planes.filter(p => p.estado === 'completado').length;
  const totalTratamientos = planes.reduce((sum, plan) => sum + (plan.tratamientos?.length || 0), 0);
  const tratamientosCompletados = planes.reduce((sum, plan) => {
    return sum + (plan.tratamientos?.filter((t: any) => t.estado === 'completado').length || 0);
  }, 0);
  const totalInvertido = planes.reduce((sum, plan) => {
    if (!plan.tratamientos) return sum;
    return sum + plan.tratamientos.reduce((s: number, t: any) => {
      return s + ((t.estado === 'completado' || t.estado === 'en-proceso') ? (t.costo || 0) : 0);
    }, 0);
  }, 0);
  const totalPresupuestado = planes.reduce((sum, plan) => {
    if (!plan.tratamientos) return sum;
    return sum + plan.tratamientos.reduce((s: number, t: any) => s + (t.costo || 0), 0);
  }, 0);
  const porcentajeProgreso = totalTratamientos > 0 ? Math.round((tratamientosCompletados / totalTratamientos) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-blue-600" />
          Planes de Tratamiento
        </h3>
      </div>

      {/* Estadísticas de planes */}
      {planes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Planes</p>
                <p className="text-2xl font-bold text-blue-600">{totalPlanes}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-yellow-600">{planesActivos}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-green-600">{planesCompletados}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tratamientos</p>
                <p className="text-2xl font-bold text-purple-600">{totalTratamientos}</p>
                <p className="text-xs text-gray-500 mt-1">{tratamientosCompletados} completados</p>
              </div>
              <ClipboardList className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progreso</p>
                <p className="text-2xl font-bold text-indigo-600">{porcentajeProgreso}%</p>
                <p className="text-xs text-gray-500 mt-1">General</p>
              </div>
              <ClipboardList className="w-8 h-8 text-indigo-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-rose-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Invertido</p>
                <p className="text-xl font-bold text-rose-600">{totalInvertido.toFixed(0)}€</p>
                <p className="text-xs text-gray-500 mt-1">de {totalPresupuestado.toFixed(0)}€</p>
              </div>
              <ClipboardList className="w-8 h-8 text-rose-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Barra de progreso general */}
      {planes.length > 0 && totalTratamientos > 0 && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso General de Todos los Planes</span>
            <span className="text-sm text-gray-600">{porcentajeProgreso}% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${porcentajeProgreso}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{tratamientosCompletados} de {totalTratamientos} tratamientos completados</span>
            <span>{totalInvertido.toFixed(2)} € de {totalPresupuestado.toFixed(2)} € invertido</span>
          </div>
        </div>
      )}

      {planes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay planes de tratamiento registrados para este paciente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {planes.map((plan) => {
            const totalPlan = plan.tratamientos?.reduce((sum: number, t: any) => sum + (t.costo || 0), 0) || 0;
            const completados = plan.tratamientos?.filter((t: any) => t.estado === 'completado').length || 0;
            const totalTratamientosPlan = plan.tratamientos?.length || 0;
            const porcentajePlan = totalTratamientosPlan > 0 ? (completados / totalTratamientosPlan) * 100 : 0;
            
            return (
              <div key={plan._id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {plan.nombre || 'Plan de Tratamiento'}
                      </h4>
                      {getEstadoBadge(plan.estado)}
                      {(plan as any).prioridad && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          (plan as any).prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                          (plan as any).prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          Prioridad: {(plan as any).prioridad}
                        </span>
                      )}
                    </div>
                    {plan.descripcion && (
                      <p className="text-gray-700 mb-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {plan.descripcion}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {plan.fechaCreacion && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Creado:</span>
                          {new Date(plan.fechaCreacion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                      {(plan as any).fechaInicio && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Inicio:</span>
                          {new Date((plan as any).fechaInicio).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                      {(plan as any).fechaFinEstimada && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Fin estimado:</span>
                          {new Date((plan as any).fechaFinEstimada).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Barra de progreso del plan */}
                {totalTratamientosPlan > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progreso del Plan</span>
                      <span className="text-sm text-gray-600">
                        {completados} de {totalTratamientosPlan} tratamientos completados ({porcentajePlan.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${porcentajePlan}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Resumen de tratamientos */}
                {plan.tratamientos && plan.tratamientos.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Tratamientos ({totalTratamientosPlan}):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plan.tratamientos.slice(0, 4).map((tratamiento: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {tratamiento.nombre || `Tratamiento ${index + 1}`}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                tratamiento.estado === 'completado' ? 'bg-green-100 text-green-800' :
                                tratamiento.estado === 'en-proceso' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {tratamiento.estado === 'en-proceso' ? 'En Proceso' : tratamiento.estado || 'Pendiente'}
                              </span>
                              {tratamiento.costo && (
                                <span className="text-xs text-gray-600">{tratamiento.costo.toFixed(2)} €</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {plan.tratamientos.length > 4 && (
                        <div className="p-2 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
                          <p className="text-sm text-gray-600">
                            +{plan.tratamientos.length - 4} tratamientos más
                          </p>
                        </div>
                      )}
                    </div>
                    {totalPlan > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">Total del Plan:</span>
                        <span className="text-lg font-bold text-blue-600">
                          {totalPlan.toFixed(2)} €
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notas del plan */}
                {(plan as any).notas && (
                  <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-900 mb-1">Notas del Plan:</p>
                    <p className="text-sm text-blue-800">{(plan as any).notas}</p>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


