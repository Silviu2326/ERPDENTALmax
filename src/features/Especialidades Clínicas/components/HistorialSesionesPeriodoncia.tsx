import { useState } from 'react';
import { Eye, Edit, Calendar, User } from 'lucide-react';
import { SesionMantenimientoPeriodontal } from '../api/periodonciaApi';

interface HistorialSesionesPeriodonciaProps {
  sesiones: SesionMantenimientoPeriodontal[];
  onVerSesion?: (sesionId: string) => void;
  onEditarSesion?: (sesionId: string) => void;
}

export default function HistorialSesionesPeriodoncia({
  sesiones,
  onVerSesion,
  onEditarSesion,
}: HistorialSesionesPeriodonciaProps) {
  const [sesionSeleccionada, setSesionSeleccionada] = useState<string | null>(null);

  const formatearFecha = (fecha: Date | string) => {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const obtenerColorIndice = (valor?: number) => {
    if (!valor) return 'text-gray-500';
    if (valor < 20) return 'text-green-600';
    if (valor < 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const obtenerBadgeColor = (valor?: number) => {
    if (!valor) return 'bg-gray-100 text-gray-600';
    if (valor < 20) return 'bg-green-100 text-green-700';
    if (valor < 40) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  if (sesiones.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay sesiones registradas</h3>
        <p className="text-gray-600 mb-4">Las sesiones de mantenimiento aparecerán aquí</p>
      </div>
    );
  }

  // Ordenar sesiones por fecha (más reciente primero)
  const sesionesOrdenadas = [...sesiones].sort((a, b) => {
    const fechaA = new Date(a.fechaSesion).getTime();
    const fechaB = new Date(b.fechaSesion).getTime();
    return fechaB - fechaA;
  });

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Sesiones</h3>
        <p className="text-sm text-gray-600 mt-1">
          {sesiones.length} {sesiones.length === 1 ? 'sesión registrada' : 'sesiones registradas'}
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {sesionesOrdenadas.map((sesion) => {
          const estaSeleccionada = sesionSeleccionada === sesion._id;
          const fecha = formatearFecha(sesion.fechaSesion);

          return (
            <div
              key={sesion._id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                estaSeleccionada ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold text-gray-800">{fecha}</span>
                    </div>
                    {sesion.profesional && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <User className="w-4 h-4" />
                        <span>Profesional ID: {sesion.profesional}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {/* Índice de Placa */}
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Índice de Placa</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${obtenerColorIndice(sesion.indicePlacaGeneral)}`}>
                          {sesion.indicePlacaGeneral?.toFixed(1) || 'N/A'}%
                        </span>
                        {sesion.indicePlacaGeneral !== undefined && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerBadgeColor(sesion.indicePlacaGeneral)}`}>
                            {sesion.indicePlacaGeneral < 20 ? 'Excelente' :
                             sesion.indicePlacaGeneral < 40 ? 'Aceptable' : 'Alto'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Índice de Sangrado */}
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Índice de Sangrado (BOP)</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${obtenerColorIndice(sesion.indiceSangradoGeneral)}`}>
                          {sesion.indiceSangradoGeneral?.toFixed(1) || 'N/A'}%
                        </span>
                        {sesion.indiceSangradoGeneral !== undefined && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerBadgeColor(sesion.indiceSangradoGeneral)}`}>
                            {sesion.indiceSangradoGeneral < 20 ? 'Excelente' :
                             sesion.indiceSangradoGeneral < 40 ? 'Aceptable' : 'Alto'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {sesion.observaciones && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg ring-1 ring-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Observaciones</p>
                      <p className="text-sm text-slate-700">{sesion.observaciones}</p>
                    </div>
                  )}

                  {sesion.planProximaVisita && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg ring-1 ring-blue-200">
                      <p className="text-xs text-blue-600 font-medium mb-1">Plan para próxima visita</p>
                      <p className="text-sm text-blue-800">{sesion.planProximaVisita}</p>
                      {sesion.intervaloRecomendado && (
                        <p className="text-xs text-blue-600 mt-1">
                          Intervalo recomendado: {sesion.intervaloRecomendado} meses
                        </p>
                      )}
                    </div>
                  )}

                  {sesion.mediciones && sesion.mediciones.length > 0 && (
                    <div className="mt-2 text-xs text-slate-500">
                      {sesion.mediciones.length} {sesion.mediciones.length === 1 ? 'diente registrado' : 'dientes registrados'}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {onVerSesion && sesion._id && (
                    <button
                      onClick={() => {
                        setSesionSeleccionada(sesion._id || null);
                        onVerSesion(sesion._id);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                      title="Ver detalles"
                    >
                      <Eye size={20} />
                    </button>
                  )}
                  {onEditarSesion && sesion._id && (
                    <button
                      onClick={() => {
                        setSesionSeleccionada(sesion._id || null);
                        onEditarSesion(sesion._id);
                      }}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-all"
                      title="Editar sesión"
                    >
                      <Edit size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



