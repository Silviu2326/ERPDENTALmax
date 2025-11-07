import { X, BarChart3, CheckCircle, XCircle, Send, Clock } from 'lucide-react';
import { CampaignStats } from '../api/campanasSmsApi';

interface ModalEstadisticasCampanaProps {
  campanaNombre: string;
  estadisticas: CampaignStats;
  onCerrar: () => void;
}

export default function ModalEstadisticasCampana({
  campanaNombre,
  estadisticas,
  onCerrar,
}: ModalEstadisticasCampanaProps) {
  const metricas = [
    {
      label: 'Total de Destinatarios',
      valor: estadisticas.total,
      icon: Send,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Enviados',
      valor: estadisticas.sent,
      icon: Send,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Entregados',
      valor: estadisticas.delivered,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Fallidos',
      valor: estadisticas.failed,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Estadísticas de Campaña</h2>
              <p className="text-sm text-gray-600">{campanaNombre}</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all"
            aria-label="Cerrar"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricas.map((metrica) => {
              const Icon = metrica.icon;
              return (
                <div
                  key={metrica.label}
                  className={`${metrica.bgColor} rounded-xl p-4 ring-1 ring-gray-200`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={20} className={metrica.color} />
                    <span className="text-sm font-medium text-gray-700">{metrica.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${metrica.color}`}>
                    {metrica.valor.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Tasa de entrega y fallos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-6 ring-1 ring-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-medium text-gray-900">Tasa de Entrega</span>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">
                    {estadisticas.deliveryRate.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-600">
                    ({estadisticas.delivered} de {estadisticas.total})
                  </span>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${estadisticas.deliveryRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-6 ring-1 ring-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={20} className="text-red-600" />
                <span className="font-medium text-gray-900">Tasa de Fallos</span>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600">
                    {estadisticas.failureRate.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-600">
                    ({estadisticas.failed} de {estadisticas.total})
                  </span>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${estadisticas.failureRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gray-50 rounded-xl p-4 ring-1 ring-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">Resumen</span>
            </div>
            <p className="text-sm text-gray-600">
              De {estadisticas.total.toLocaleString()} mensajes enviados,{' '}
              {estadisticas.delivered.toLocaleString()} fueron entregados exitosamente (
              {estadisticas.deliveryRate.toFixed(1)}%) y {estadisticas.failed.toLocaleString()}{' '}
              fallaron ({estadisticas.failureRate.toFixed(1)}%).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200/60 px-6 py-4 flex justify-end">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



