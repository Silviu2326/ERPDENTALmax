import { RecordatorioHistorial } from '../api/recordatoriosApi';
import { CheckCircle, Clock, XCircle, Send, MessageSquare, Calendar, User } from 'lucide-react';

interface TablaHistorialRecordatoriosProps {
  historial: RecordatorioHistorial[];
  loading?: boolean;
  onVerDetalle?: (recordatorio: RecordatorioHistorial) => void;
}

export default function TablaHistorialRecordatorios({
  historial,
  loading = false,
  onVerDetalle,
}: TablaHistorialRecordatoriosProps) {
  const getEstadoBadge = (estado: RecordatorioHistorial['estado']) => {
    const estadoConfig = {
      Pendiente: {
        label: 'Pendiente',
        className: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: Clock,
      },
      Enviado: {
        label: 'Enviado',
        className: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Send,
      },
      Entregado: {
        label: 'Entregado',
        className: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
      },
      Fallido: {
        label: 'Fallido',
        className: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle,
      },
      Confirmado: {
        label: 'Confirmado',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: CheckCircle,
      },
      Cancelado: {
        label: 'Cancelado',
        className: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: XCircle,
      },
    };

    const config = estadoConfig[estado];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getCanalIcon = (canal: string) => {
    const canalMap: Record<string, { icon: any; className: string }> = {
      SMS: { icon: MessageSquare, className: 'text-blue-600' },
      Email: { icon: MessageSquare, className: 'text-green-600' },
      WhatsApp: { icon: MessageSquare, className: 'text-emerald-600' },
    };
    return canalMap[canal] || { icon: MessageSquare, className: 'text-gray-600' };
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (historial.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No hay recordatorios en el historial</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Envío
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paciente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Cita
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Canal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plantilla
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Respuesta
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {historial.map((recordatorio) => {
            const canalInfo = getCanalIcon(recordatorio.canal);
            const CanalIcon = canalInfo.icon;

            return (
              <tr
                key={recordatorio._id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onVerDetalle?.(recordatorio)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatFecha(recordatorio.fecha_envio)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {recordatorio.paciente.nombre} {recordatorio.paciente.apellidos}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatFecha(recordatorio.cita.fecha_hora_inicio)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <CanalIcon className={`w-4 h-4 ${canalInfo.className}`} />
                    <span className="font-medium">{recordatorio.canal}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {recordatorio.plantilla.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoBadge(recordatorio.estado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {recordatorio.respuesta_paciente ? (
                    <span className="text-green-600 font-medium">{recordatorio.respuesta_paciente}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


