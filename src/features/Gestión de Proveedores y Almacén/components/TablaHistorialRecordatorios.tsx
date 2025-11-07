import { RecordatorioHistorial } from '../api/recordatoriosApi';
import { CheckCircle, Clock, XCircle, Send, MessageSquare, Calendar, User, Loader2 } from 'lucide-react';

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
        className: 'bg-gray-100 text-gray-800 ring-gray-200',
        icon: Clock,
      },
      Enviado: {
        label: 'Enviado',
        className: 'bg-blue-100 text-blue-800 ring-blue-200',
        icon: Send,
      },
      Entregado: {
        label: 'Entregado',
        className: 'bg-green-100 text-green-800 ring-green-200',
        icon: CheckCircle,
      },
      Fallido: {
        label: 'Fallido',
        className: 'bg-red-100 text-red-800 ring-red-200',
        icon: XCircle,
      },
      Confirmado: {
        label: 'Confirmado',
        className: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
        icon: CheckCircle,
      },
      Cancelado: {
        label: 'Cancelado',
        className: 'bg-gray-100 text-gray-800 ring-gray-200',
        icon: XCircle,
      },
    };

    const config = estadoConfig[estado];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${config.className}`}
      >
        <Icon size={12} />
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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (historial.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay recordatorios</h3>
        <p className="text-gray-600">No se encontraron recordatorios en el historial</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Fecha Envío
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Paciente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Fecha Cita
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Canal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Plantilla
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
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
                className="hover:bg-slate-50 cursor-pointer transition-all"
                onClick={() => onVerDetalle?.(recordatorio)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    {formatFecha(recordatorio.fecha_envio)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    {recordatorio.paciente.nombre} {recordatorio.paciente.apellidos}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {formatFecha(recordatorio.cita.fecha_hora_inicio)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <CanalIcon size={16} className={canalInfo.className} />
                    <span className="font-medium text-slate-700">{recordatorio.canal}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {recordatorio.plantilla.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoBadge(recordatorio.estado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {recordatorio.respuesta_paciente ? (
                    <span className="text-green-600 font-medium">{recordatorio.respuesta_paciente}</span>
                  ) : (
                    <span className="text-slate-400">-</span>
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



