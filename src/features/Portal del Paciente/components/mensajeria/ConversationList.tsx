import { Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { Conversacion } from '../../api/mensajeriaApi';

interface ConversationListProps {
  conversaciones: Conversacion[];
  conversacionSeleccionadaId?: string;
  onSeleccionarConversacion: (conversacionId: string) => void;
  isLoading?: boolean;
}

export default function ConversationList({
  conversaciones,
  conversacionSeleccionadaId,
  onSeleccionarConversacion,
  isLoading = false,
}: ConversationListProps) {
  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fechaObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} h`;
    if (diffDias < 7) return `Hace ${diffDias} días`;
    return fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Cargando conversaciones...</div>
      </div>
    );
  }

  if (conversaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No hay conversaciones</p>
        <p className="text-sm text-center">
          Inicia una conversación con la clínica para comenzar a comunicarte de forma segura.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-2">
        {conversaciones.map((conversacion) => {
          const estaSeleccionada = conversacion._id === conversacionSeleccionadaId;
          const tieneMensajesNoLeidos = (conversacion.mensajesNoLeidos || 0) > 0;

          return (
            <button
              key={conversacion._id}
              onClick={() => onSeleccionarConversacion(conversacion._id)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                estaSeleccionada
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3
                  className={`font-semibold text-sm truncate flex-1 ${
                    estaSeleccionada ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {conversacion.asunto}
                </h3>
                {tieneMensajesNoLeidos && !estaSeleccionada && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                    {conversacion.mensajesNoLeidos}
                  </span>
                )}
              </div>
              {conversacion.ultimoMensajePreview && (
                <p
                  className={`text-sm mb-2 line-clamp-2 ${
                    estaSeleccionada ? 'text-blue-100' : 'text-gray-600'
                  }`}
                >
                  {conversacion.ultimoMensajePreview}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs">
                  <Clock className={`w-3 h-3 ${estaSeleccionada ? 'text-blue-200' : 'text-gray-400'}`} />
                  <span className={estaSeleccionada ? 'text-blue-200' : 'text-gray-500'}>
                    {formatearFecha(conversacion.ultimoMensaje)}
                  </span>
                </div>
                {conversacion.estado === 'cerrada' && (
                  <CheckCircle
                    className={`w-4 h-4 ${estaSeleccionada ? 'text-blue-200' : 'text-gray-400'}`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


