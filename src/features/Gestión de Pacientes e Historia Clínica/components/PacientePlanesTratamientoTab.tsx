import { FileText, Calendar, CheckCircle, Clock, XCircle, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { PerfilCompletoPaciente } from '../api/pacienteApi';

interface PacientePlanesTratamientoTabProps {
  paciente: PerfilCompletoPaciente;
}

export default function PacientePlanesTratamientoTab({ paciente }: PacientePlanesTratamientoTabProps) {
  const planes = paciente.planesTratamiento || [];

  const getEstadoBadge = (estado?: string) => {
    const estados: Record<string, { color: string; icon: any }> = {
      activo: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      completado: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelado: { color: 'bg-red-100 text-red-800', icon: XCircle },
      'en-proceso': { color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp },
    };

    const estadoInfo = estados[estado || 'activo'] || estados.activo;
    const Icon = estadoInfo.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${estadoInfo.color}`}>
        <Icon className="w-4 h-4" />
        {estado === 'en-proceso' ? 'En Proceso' : estado || 'Activo'}
      </span>
    );
  };

  const getEstadoTratamientoBadge = (estado?: string) => {
    const estados: Record<string, { color: string; label: string }> = {
      completado: { color: 'bg-green-100 text-green-800', label: 'Completado' },
      'en-proceso': { color: 'bg-yellow-100 text-yellow-800', label: 'En Proceso' },
      pendiente: { color: 'bg-gray-100 text-gray-800', label: 'Pendiente' },
    };

    const estadoInfo = estados[estado || 'pendiente'] || estados.pendiente;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${estadoInfo.color}`}>
        {estadoInfo.label}
      </span>
    );
  };

  // Calcular estadísticas generales
  const totalPlanes = planes.length;
  const planesActivos = planes.filter(p => p.estado === 'activo').length;
  const planesCompletados = planes.filter(p => p.estado === 'completado').length;
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
  
  const tratamientosPendientes = planes.reduce((sum, plan) => {
    if (!plan.tratamientos) return sum;
    return sum + plan.tratamientos.filter((t: any) => t.estado === 'pendiente').length;
  }, 0);
  
  const tratamientosCompletados = planes.reduce((sum, plan) => {
    if (!plan.tratamientos) return sum;
    return sum + plan.tratamientos.filter((t: any) => t.estado === 'completado').length;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Planes de Tratamiento
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {totalPlanes} {totalPlanes === 1 ? 'plan registrado' : 'planes registrados'}
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md">
          <FileText className="w-4 h-4" />
          Nuevo Plan
        </button>
      </div>

      {/* Estadísticas rápidas */}
      {planes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Planes</p>
                <p className="text-2xl font-bold text-gray-900">{totalPlanes}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{planesActivos}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{planesCompletados}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Invertido</p>
                <p className="text-2xl font-bold text-gray-900">{totalInvertido.toFixed(0)}€</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>
        
        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Presupuestado</p>
                <p className="text-xl font-bold text-indigo-600">{totalPresupuestado.toFixed(2)} €</p>
              </div>
              <FileText className="w-6 h-6 text-indigo-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tratamientos Completados</p>
                <p className="text-xl font-bold text-green-600">{tratamientosCompletados}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tratamientos Pendientes</p>
                <p className="text-xl font-bold text-yellow-600">{tratamientosPendientes}</p>
              </div>
              <Clock className="w-6 h-6 text-yellow-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {planes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">No hay planes de tratamiento registrados</p>
          <p className="text-sm text-gray-500 mb-4">
            Los planes de tratamiento ayudan a organizar y seguir el progreso de los tratamientos del paciente
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Crear Primer Plan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {planes.map((plan) => {
            const totalPlan = plan.tratamientos?.reduce((sum: number, t: any) => sum + (t.costo || 0), 0) || 0;
            const completados = plan.tratamientos?.filter((t: any) => t.estado === 'completado').length || 0;
            const totalTratamientos = plan.tratamientos?.length || 0;
            const porcentajeProgreso = totalTratamientos > 0 ? (completados / totalTratamientos) * 100 : 0;

            return (
              <div key={plan._id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {plan.nombre || 'Plan de Tratamiento'}
                      </h4>
                      {getEstadoBadge(plan.estado)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {plan.fechaCreacion && (
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Creado:{' '}
                          {new Date(plan.fechaCreacion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                      {(plan as any).fechaInicio && (
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Inicio:{' '}
                          {new Date((plan as any).fechaInicio).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                      {(plan as any).fechaFinEstimada && (
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Fin estimado:{' '}
                          {new Date((plan as any).fechaFinEstimada).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
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
                  </div>
                </div>

                {plan.descripcion && (
                  <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {plan.descripcion}
                  </p>
                )}

                {(plan as any).notas && (
                  <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-900 mb-1">Notas del Plan:</p>
                    <p className="text-sm text-blue-800">{(plan as any).notas}</p>
                  </div>
                )}

                {/* Barra de progreso */}
                {totalTratamientos > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progreso del Plan</span>
                      <span className="text-sm text-gray-600">
                        {completados} de {totalTratamientos} tratamientos completados
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${porcentajeProgreso}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {plan.tratamientos && plan.tratamientos.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Tratamientos incluidos ({totalTratamientos}):
                    </h5>
                    <div className="space-y-2">
                      {plan.tratamientos.map((tratamiento: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {tratamiento.nombre || `Tratamiento ${index + 1}`}
                              </p>
                              {getEstadoTratamientoBadge(tratamiento.estado)}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              {tratamiento.costo && (
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  Costo: {tratamiento.costo.toFixed(2)} €
                                </p>
                              )}
                              {tratamiento.fechaCompletado && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Completado: {new Date(tratamiento.fechaCompletado).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </p>
                              )}
                              {tratamiento.progreso !== undefined && (
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                                      style={{ width: `${tratamiento.progreso}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-600">{tratamiento.progreso}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {totalPlan > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-700">Total del Plan:</span>
                          <span className="text-xl font-bold text-blue-600">
                            {totalPlan.toFixed(2)} €
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                          <span>Pagado: {(totalPlan * (porcentajeProgreso / 100)).toFixed(2)} €</span>
                          <span>Pendiente: {(totalPlan * (1 - porcentajeProgreso / 100)).toFixed(2)} €</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Progreso financiero:</span>
                            <span className="font-semibold text-blue-600">{porcentajeProgreso.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2 flex-wrap">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Ver Detalles
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    Editar Plan
                  </button>
                  {plan.estado === 'activo' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Completar
                    </button>
                  )}
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Generar Presupuesto
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

