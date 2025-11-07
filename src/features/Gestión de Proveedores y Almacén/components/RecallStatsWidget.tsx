import { Mail, MessageSquare } from 'lucide-react';
import { RecallStats } from '../api/recallsApi';
import MetricCards from './MetricCards';

interface RecallStatsWidgetProps {
  stats: RecallStats;
}

export default function RecallStatsWidget({ stats }: RecallStatsWidgetProps) {
  const metricsData = [
    {
      id: 'circuitos-activos',
      title: 'Circuitos Activos',
      value: `${stats.activeCircuits} de ${stats.totalCircuits}`,
      color: 'info' as const,
    },
    {
      id: 'mensajes-enviados',
      title: 'Mensajes Enviados',
      value: stats.totalMessagesSent.toLocaleString(),
      color: 'success' as const,
    },
    {
      id: 'citas-agendadas',
      title: 'Citas Agendadas',
      value: stats.appointmentsBooked.toLocaleString(),
      color: 'info' as const,
    },
    {
      id: 'tasa-conversion',
      title: 'Tasa de Conversión',
      value: `${stats.conversionRate.toFixed(1)}%`,
      color: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metricsData} />

      {/* Desglose por canal */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensajes por Canal</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
            <Mail className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.messagesByChannel.email.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Email</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
            <MessageSquare className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.messagesByChannel.sms.toLocaleString()}</p>
            <p className="text-sm text-gray-600">SMS</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
            <MessageSquare className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.messagesByChannel.whatsapp.toLocaleString()}</p>
            <p className="text-sm text-gray-600">WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
}



