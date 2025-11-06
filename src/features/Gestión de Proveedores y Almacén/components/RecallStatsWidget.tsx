import { TrendingUp, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import { RecallStats } from '../api/recallsApi';

interface RecallStatsWidgetProps {
  stats: RecallStats;
}

export default function RecallStatsWidget({ stats }: RecallStatsWidgetProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">Circuitos Activos</p>
            <p className="text-3xl font-bold text-blue-900">{stats.activeCircuits}</p>
            <p className="text-xs text-blue-600 mt-1">de {stats.totalCircuits} totales</p>
          </div>
          <div className="bg-blue-200 rounded-full p-3">
            <TrendingUp className="w-6 h-6 text-blue-700" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">Mensajes Enviados</p>
            <p className="text-3xl font-bold text-green-900">{stats.totalMessagesSent.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">Total acumulado</p>
          </div>
          <div className="bg-green-200 rounded-full p-3">
            <Mail className="w-6 h-6 text-green-700" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 mb-1">Citas Agendadas</p>
            <p className="text-3xl font-bold text-purple-900">{stats.appointmentsBooked.toLocaleString()}</p>
            <p className="text-xs text-purple-600 mt-1">A través de recalls</p>
          </div>
          <div className="bg-purple-200 rounded-full p-3">
            <CheckCircle2 className="w-6 h-6 text-purple-700" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600 mb-1">Tasa de Conversión</p>
            <p className="text-3xl font-bold text-orange-900">{stats.conversionRate.toFixed(1)}%</p>
            <p className="text-xs text-orange-600 mt-1">
              {stats.totalMessagesSent > 0 
                ? `${((stats.appointmentsBooked / stats.totalMessagesSent) * 100).toFixed(1)}%`
                : '0%'}
            </p>
          </div>
          <div className="bg-orange-200 rounded-full p-3">
            <MessageSquare className="w-6 h-6 text-orange-700" />
          </div>
        </div>
      </div>

      {/* Desglose por canal */}
      <div className="md:col-span-2 lg:col-span-4 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensajes por Canal</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.messagesByChannel.email.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Email</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.messagesByChannel.sms.toLocaleString()}</p>
            <p className="text-sm text-gray-600">SMS</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.messagesByChannel.whatsapp.toLocaleString()}</p>
            <p className="text-sm text-gray-600">WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
}


