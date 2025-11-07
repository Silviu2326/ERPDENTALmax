import { TrendingUp, CheckCircle, XCircle, Send, Clock, MessageSquare } from 'lucide-react';
import MetricCards from './MetricCards';

interface EstadisticasRecordatorios {
  totalEnviados: number;
  totalConfirmados: number;
  totalFallidos: number;
  tasaConfirmacion: number;
  tasaEntrega: number;
  porCanal: {
    SMS: { enviados: number; confirmados: number };
    Email: { enviados: number; confirmados: number };
    WhatsApp: { enviados: number; confirmados: number };
  };
  porEstado: {
    Pendiente: number;
    Enviado: number;
    Entregado: number;
    Confirmado: number;
    Fallido: number;
  };
}

interface PanelEstadisticasRecordatoriosProps {
  estadisticas: EstadisticasRecordatorios;
  periodo?: string;
}

export default function PanelEstadisticasRecordatorios({
  estadisticas,
  periodo = 'Últimos 30 días',
}: PanelEstadisticasRecordatoriosProps) {
  return (
    <div className="space-y-6">
      {/* Tarjetas de métricas principales usando MetricCards */}
      <MetricCards
        data={[
          {
            id: 'total-enviados',
            title: 'Total Enviados',
            value: estadisticas.totalEnviados,
            color: 'info',
          },
          {
            id: 'confirmados',
            title: 'Confirmados',
            value: estadisticas.totalConfirmados,
            color: 'success',
          },
          {
            id: 'tasa-confirmacion',
            title: 'Tasa de Confirmación',
            value: `${estadisticas.tasaConfirmacion.toFixed(1)}%`,
            color: 'success',
          },
          {
            id: 'fallidos',
            title: 'Fallidos',
            value: estadisticas.totalFallidos,
            color: 'danger',
          },
        ]}
      />

      {/* Distribución por canal */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Canal</h4>
        <div className="space-y-4">
          {Object.entries(estadisticas.porCanal).map(([canal, datos]) => {
            const porcentaje =
              estadisticas.totalEnviados > 0
                ? ((datos.enviados / estadisticas.totalEnviados) * 100).toFixed(1)
                : '0';
            return (
              <div key={canal}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{canal}</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    {datos.enviados} enviados · {datos.confirmados} confirmados
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribución por estado */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(estadisticas.porEstado).map(([estado, cantidad]) => {
            const estadoConfig: Record<string, { color: string; icon: any }> = {
              Pendiente: { color: 'bg-gray-100 text-gray-800', icon: Clock },
              Enviado: { color: 'bg-blue-100 text-blue-800', icon: Send },
              Entregado: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
              Confirmado: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
              Fallido: { color: 'bg-red-100 text-red-800', icon: XCircle },
            };
            const config = estadoConfig[estado] || estadoConfig.Pendiente;
            const Icon = config.icon;

            return (
              <div
                key={estado}
                className={`${config.color} rounded-xl p-4 text-center ring-1 ring-slate-200`}
              >
                <Icon size={20} className="mx-auto mb-2" />
                <p className="text-2xl font-bold">{cantidad}</p>
                <p className="text-xs font-medium mt-1">{estado}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



