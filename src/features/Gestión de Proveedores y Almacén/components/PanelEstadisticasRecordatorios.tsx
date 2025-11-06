import { TrendingUp, CheckCircle, XCircle, Send, Clock, MessageSquare } from 'lucide-react';

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
  const cards = [
    {
      titulo: 'Total Enviados',
      valor: estadisticas.totalEnviados,
      icono: Send,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      titulo: 'Confirmados',
      valor: estadisticas.totalConfirmados,
      icono: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      titulo: 'Tasa de Confirmación',
      valor: `${estadisticas.tasaConfirmacion.toFixed(1)}%`,
      icono: TrendingUp,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      titulo: 'Fallidos',
      valor: estadisticas.totalFallidos,
      icono: XCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Estadísticas de Recordatorios</h3>
          <p className="text-sm text-gray-500 mt-1">{periodo}</p>
        </div>
      </div>

      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icono;
          return (
            <div
              key={card.titulo}
              className={`${card.bgColor} rounded-lg border border-gray-200 p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.titulo}</p>
                  <p className={`text-2xl font-bold ${card.textColor} mt-2`}>{card.valor}</p>
                </div>
                <div className={`${card.textColor} bg-white p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Distribución por canal */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Distribución por Canal</h4>
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
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{canal}</span>
                  </div>
                  <div className="text-sm text-gray-600">
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Distribución por Estado</h4>
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
                className={`${config.color} rounded-lg p-4 text-center border`}
              >
                <Icon className="w-5 h-5 mx-auto mb-2" />
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


