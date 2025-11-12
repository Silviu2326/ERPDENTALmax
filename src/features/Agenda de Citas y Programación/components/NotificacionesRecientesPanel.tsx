import { useState, useEffect } from 'react';
import { X, Bell, Calendar, Clock, User, AlertCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Cita } from '../api/citasApi';

export interface NotificacionReciente {
  id: string;
  tipo: 'asignada' | 'reprogramada' | 'cancelada' | 'confirmada' | 'cancelada_paciente';
  citaId: string;
  cita?: Cita;
  mensaje: string;
  timestamp: string;
  leida: boolean;
  profesionalId?: string;
  canalConfirmacion?: 'email' | 'sms' | 'whatsapp';
}

interface NotificacionesRecientesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notificaciones: NotificacionReciente[];
  onNotificacionClick?: (notificacion: NotificacionReciente) => void;
  onMarcarLeida?: (id: string) => void;
  onLimpiarTodas?: () => void;
}

const MAX_NOTIFICACIONES = 20;

export default function NotificacionesRecientesPanel({
  isOpen,
  onClose,
  notificaciones,
  onNotificacionClick,
  onMarcarLeida,
  onLimpiarTodas,
}: NotificacionesRecientesPanelProps) {
  const [notificacionesOrdenadas, setNotificacionesOrdenadas] = useState<NotificacionReciente[]>([]);

  useEffect(() => {
    // Ordenar por timestamp descendente y limitar a MAX_NOTIFICACIONES
    const ordenadas = [...notificaciones]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, MAX_NOTIFICACIONES);
    setNotificacionesOrdenadas(ordenadas);
  }, [notificaciones]);

  const getIcon = (tipo: NotificacionReciente['tipo']) => {
    switch (tipo) {
      case 'asignada':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'reprogramada':
        return <RotateCcw className="w-5 h-5 text-yellow-600" />;
      case 'cancelada':
      case 'cancelada_paciente':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'confirmada':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCanalBadge = (canal?: 'email' | 'sms' | 'whatsapp') => {
    if (!canal) return null;
    
    const estilos = {
      email: 'bg-blue-100 text-blue-700 border-blue-300',
      sms: 'bg-purple-100 text-purple-700 border-purple-300',
      whatsapp: 'bg-green-100 text-green-700 border-green-300',
    };

    const iconos = {
      email: '📧',
      sms: '💬',
      whatsapp: '💚',
    };

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${estilos[canal]}`}>
        {iconos[canal]} {canal.toUpperCase()}
      </span>
    );
  };

  const formatearTiempo = (timestamp: string) => {
    const ahora = new Date();
    const fecha = new Date(timestamp);
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md h-full bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Notificaciones Recientes</h2>
              {noLeidas > 0 && (
                <p className="text-sm text-gray-600">
                  {noLeidas} {noLeidas === 1 ? 'no leída' : 'no leídas'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onLimpiarTodas && notificaciones.length > 0 && (
              <button
                onClick={onLimpiarTodas}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Limpiar todas"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="flex-1 overflow-y-auto">
          {notificacionesOrdenadas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No hay notificaciones</p>
              <p className="text-sm text-gray-400 mt-2">
                Las notificaciones sobre citas aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notificacionesOrdenadas.map((notificacion) => (
                <div
                  key={notificacion.id}
                  onClick={() => {
                    if (onNotificacionClick) {
                      onNotificacionClick(notificacion);
                    }
                    if (onMarcarLeida && !notificacion.leida) {
                      onMarcarLeida(notificacion.id);
                    }
                  }}
                  className={`
                    p-4 hover:bg-gray-50 transition-colors cursor-pointer
                    ${!notificacion.leida ? 'bg-blue-50/50' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notificacion.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {notificacion.mensaje}
                        </p>
                        {!notificacion.leida && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      
                      {notificacion.cita && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(notificacion.cita.fecha_hora_inicio).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>
                              {notificacion.cita.paciente.nombre} {notificacion.cita.paciente.apellidos}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        {getCanalBadge(notificacion.canalConfirmacion)}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatearTiempo(notificacion.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notificaciones.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Mostrando {notificacionesOrdenadas.length} de {notificaciones.length} notificaciones
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

