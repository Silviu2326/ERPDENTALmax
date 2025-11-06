import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Mensaje, NuevoMensaje } from '../../api/mensajeriaApi';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import AttachmentViewer from './AttachmentViewer';
import { Adjunto } from '../../api/mensajeriaApi';

interface ChatWindowProps {
  conversacionId?: string;
  mensajes: Mensaje[];
  isLoading?: boolean;
  onEnviarMensaje: (mensaje: NuevoMensaje) => Promise<void>;
  onCargarMas?: () => void;
  tieneMasMensajes?: boolean;
  userId?: string; // ID del usuario actual
}

export default function ChatWindow({
  conversacionId,
  mensajes,
  isLoading = false,
  onEnviarMensaje,
  onCargarMas,
  tieneMasMensajes = false,
  userId,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [adjuntoSeleccionado, setAdjuntoSeleccionado] = useState<Adjunto | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes]);

  // Cargar más mensajes cuando se hace scroll hacia arriba
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !onCargarMas || !tieneMasMensajes) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && !isLoading) {
        const scrollHeightBefore = container.scrollHeight;
        onCargarMas();
        // Restaurar posición del scroll después de cargar
        setTimeout(() => {
          const scrollHeightAfter = container.scrollHeight;
          container.scrollTop = scrollHeightAfter - scrollHeightBefore;
        }, 100);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onCargarMas, tieneMasMensajes, isLoading]);

  const handleEnviar = async (mensaje: NuevoMensaje) => {
    if (enviando) return;
    setEnviando(true);
    try {
      await onEnviarMensaje(mensaje);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setEnviando(false);
    }
  };

  if (!conversacionId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Selecciona una conversación</p>
          <p className="text-sm">Elige una conversación de la lista para comenzar a chatear</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Área de mensajes */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white"
      >
        {tieneMasMensajes && (
          <div className="flex justify-center mb-4">
            <button
              onClick={onCargarMas}
              disabled={isLoading}
              className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                'Cargar mensajes anteriores'
              )}
            </button>
          </div>
        )}
        {isLoading && mensajes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : mensajes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No hay mensajes aún</p>
              <p className="text-sm mt-2">Envía el primer mensaje para comenzar la conversación</p>
            </div>
          </div>
        ) : (
          <>
            {mensajes.map((mensaje) => (
              <MessageBubble key={mensaje._id} mensaje={mensaje} userId={userId} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input de mensaje */}
      <MessageInput onEnviar={handleEnviar} disabled={enviando || isLoading} />

      {/* Visor de adjuntos */}
      {adjuntoSeleccionado && (
        <AttachmentViewer
          adjunto={adjuntoSeleccionado}
          onClose={() => setAdjuntoSeleccionado(null)}
        />
      )}
    </div>
  );
}

