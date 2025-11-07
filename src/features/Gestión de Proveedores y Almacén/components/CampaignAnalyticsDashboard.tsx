import { TrendingUp, Mail, MousePointerClick, UserX, AlertCircle } from 'lucide-react';
import { CampaignReport } from '../api/campaignsApi';

interface CampaignAnalyticsDashboardProps {
  report: CampaignReport;
}

export default function CampaignAnalyticsDashboard({
  report,
}: CampaignAnalyticsDashboardProps) {
  const openRate = report.openRate || 0;
  const clickRate = report.clickRate || 0;
  const bounceRate = report.bounceRate || 0;
  const unsubscribeRate = report.unsubscribeRate || 0;

  const metrics = [
    {
      label: 'Total Destinatarios',
      value: report.totalRecipients.toLocaleString(),
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Aperturas',
      value: report.opens.toLocaleString(),
      subtitle: `${openRate.toFixed(2)}% tasa`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Clics',
      value: report.clicks.toLocaleString(),
      subtitle: `${clickRate.toFixed(2)}% tasa`,
      icon: MousePointerClick,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Rebotes',
      value: report.bounces.toLocaleString(),
      subtitle: `${bounceRate.toFixed(2)}% tasa`,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Bajas',
      value: report.unsubscribes.toLocaleString(),
      subtitle: `${unsubscribeRate.toFixed(2)}% tasa`,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Métricas de Rendimiento</h3>
        <p className="text-sm text-gray-600">
          Enviada el {new Date(report.sentAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.bgColor} ring-1 ring-gray-200/50`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{metric.label}</p>
                {metric.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráfico de barras simple */}
      <div className="bg-white rounded-lg ring-1 ring-gray-200 p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Tasas de Rendimiento</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-700 font-medium">Tasa de Apertura</span>
              <span className="font-medium text-gray-900">{openRate.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all"
                style={{ width: `${Math.min(openRate, 100)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-700 font-medium">Tasa de Clics</span>
              <span className="font-medium text-gray-900">{clickRate.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-purple-500 h-2.5 rounded-full transition-all"
                style={{ width: `${Math.min(clickRate, 100)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-700 font-medium">Tasa de Rebotes</span>
              <span className="font-medium text-gray-900">{bounceRate.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full transition-all"
                style={{ width: `${Math.min(bounceRate, 100)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-700 font-medium">Tasa de Bajas</span>
              <span className="font-medium text-gray-900">{unsubscribeRate.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-red-500 h-2.5 rounded-full transition-all"
                style={{ width: `${Math.min(unsubscribeRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



