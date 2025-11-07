import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { PlanRetencion } from '../api/retencionApi';

interface PanelIndicadoresRetencionProps {
  plan: PlanRetencion;
}

export default function PanelIndicadoresRetencion({ plan }: PanelIndicadoresRetencionProps) {
  const seguimientosProgramados = plan.seguimientos?.filter(
    (s) => s.estado === 'Programada'
  ).length || 0;
  const seguimientosRealizados = plan.seguimientos?.filter(
    (s) => s.estado === 'Realizada'
  ).length || 0;
  const seguimientosCancelados = plan.seguimientos?.filter(
    (s) => s.estado === 'Cancelada'
  ).length || 0;
  const totalSeguimientos = plan.seguimientos?.length || 0;
  const totalFotos = plan.seguimientos?.reduce(
    (acc, s) => acc + (s.fotos?.length || 0),
    0
  ) || 0;

  const calcularDiasDesdeInicio = () => {
    const inicio = new Date(plan.fechaInicio);
    const hoy = new Date();
    const diffTime = Math.abs(hoy.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calcularProximoSeguimiento = () => {
    const proximos = plan.seguimientos?.filter(
      (s) => s.estado === 'Programada' && new Date(s.fechaCita) >= new Date()
    );
    if (!proximos || proximos.length === 0) return null;
    return proximos.sort(
      (a, b) => new Date(a.fechaCita).getTime() - new Date(b.fechaCita).getTime()
    )[0];
  };

  const proximoSeguimiento = calcularProximoSeguimiento();

  const indicadores = [
    {
      titulo: 'Días en Retención',
      valor: calcularDiasDesdeInicio(),
      unidad: 'días',
      icono: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      titulo: 'Seguimientos Realizados',
      valor: seguimientosRealizados,
      unidad: `de ${totalSeguimientos}`,
      icono: CheckCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      titulo: 'Seguimientos Programados',
      valor: seguimientosProgramados,
      unidad: 'pendientes',
      icono: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      titulo: 'Fotos Registradas',
      valor: totalFotos,
      unidad: 'fotos',
      icono: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <TrendingUp size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Indicadores de Retención</h3>
          <p className="text-sm text-gray-600">Resumen del plan de retención</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {indicadores.map((indicador, index) => {
          const Icono = indicador.icono;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-gray-200 ring-1 ring-slate-200"
            >
              <div className={`bg-gradient-to-br ${indicador.color} p-2 rounded-lg w-fit mb-2`}>
                <Icono size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{indicador.valor}</p>
              <p className="text-xs text-gray-600 mt-1">{indicador.titulo}</p>
              <p className="text-xs text-gray-500">{indicador.unidad}</p>
            </div>
          );
        })}
      </div>

      {/* Estado del plan */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Estado del Plan</p>
            <span
              className={`inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-medium border ${
                plan.estado === 'Activo'
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
            >
              {plan.estado}
            </span>
          </div>
          {proximoSeguimiento && (
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">Próximo Seguimiento</p>
              <p className="text-sm text-blue-600 font-semibold mt-1">
                {new Date(proximoSeguimiento.fechaCita).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alertas */}
      {seguimientosCancelados > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              {seguimientosCancelados} seguimiento(s) cancelado(s)
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Revise los seguimientos cancelados para determinar si requieren reprogramación
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



