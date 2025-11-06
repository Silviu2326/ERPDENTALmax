import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, MessageSquare, Plus, Loader2 } from 'lucide-react';
import ConversationList from '../components/mensajeria/ConversationList';
import ChatWindow from '../components/mensajeria/ChatWindow';
import {
  obtenerConversaciones,
  obtenerMensajesDeConversacion,
  enviarMensaje,
  marcarConversacionComoLeida,
  iniciarNuevaConversacion,
  Conversacion,
  Mensaje,
  NuevoMensaje,
  RespuestaConversaciones,
  RespuestaMensajes,
} from '../api/mensajeriaApi';

interface MensajeriaPageProps {
  onVolver?: () => void;
}

export default function MensajeriaPage({ onVolver }: MensajeriaPageProps) {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionSeleccionadaId, setConversacionSeleccionadaId] = useState<string | undefined>();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargandoConversaciones, setCargandoConversaciones] = useState(true);
  const [cargandoMensajes, setCargandoMensajes] = useState(false);
  const [paginaActualMensajes, setPaginaActualMensajes] = useState(1);
  const [tieneMasMensajes, setTieneMasMensajes] = useState(false);
  const [mostrarModalNuevaConversacion, setMostrarModalNuevaConversacion] = useState(false);
  const [nuevoAsunto, setNuevoAsunto] = useState('');
  const [nuevoMensajeInicial, setNuevoMensajeInicial] = useState('');
  const [creandoConversacion, setCreandoConversacion] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();

  // Cargar conversaciones
  const cargarConversaciones = useCallback(async () => {
    try {
      setCargandoConversaciones(true);
      const respuesta: RespuestaConversaciones = await obtenerConversaciones(1, 50);
      setConversaciones(respuesta.conversaciones || []);
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setCargandoConversaciones(false);
    }
  }, []);

  // Cargar mensajes de una conversación
  const cargarMensajes = useCallback(
    async (conversacionId: string, pagina: number = 1, resetear: boolean = true) => {
      try {
        setCargandoMensajes(true);
        const respuesta: RespuestaMensajes = await obtenerMensajesDeConversacion(conversacionId, pagina, 50);
        const nuevosMensajes = respuesta.mensajes || [];

        if (resetear) {
          setMensajes(nuevosMensajes);
          setPaginaActualMensajes(1);
        } else {
          setMensajes((prev) => [...nuevosMensajes, ...prev]);
        }

        // Verificar si hay más mensajes
        const paginacion = respuesta.pagination;
        if (paginacion) {
          setTieneMasMensajes(pagina < paginacion.totalPages);
        } else {
          setTieneMasMensajes(nuevosMensajes.length === 50);
        }

        // Marcar como leída
        await marcarConversacionComoLeida(conversacionId);

        // Actualizar la lista de conversaciones para reflejar que fue leída
        setConversaciones((prev) =>
          prev.map((conv) =>
            conv._id === conversacionId
              ? { ...conv, mensajesNoLeidos: 0, ultimoMensajePreview: nuevosMensajes[0]?.cuerpo }
              : conv
          )
        );
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
      } finally {
        setCargandoMensajes(false);
      }
    },
    []
  );

  // Obtener userId al montar
  useEffect(() => {
    // Intentar obtener el ID del usuario desde localStorage o token
    // En una implementación real, esto vendría del token decodificado o de una API
    const token = localStorage.getItem('patientToken');
    // Por ahora, usamos un placeholder - en producción esto vendría del token decodificado
    setUserId(undefined); // Se establecería con el ID real del usuario
  }, []);

  // Cargar conversaciones al montar
  useEffect(() => {
    cargarConversaciones();
  }, [cargarConversaciones]);

  // Cargar mensajes cuando se selecciona una conversación
  useEffect(() => {
    if (conversacionSeleccionadaId) {
      cargarMensajes(conversacionSeleccionadaId, 1, true);
    } else {
      setMensajes([]);
    }
  }, [conversacionSeleccionadaId, cargarMensajes]);

  // Manejar selección de conversación
  const handleSeleccionarConversacion = (conversacionId: string) => {
    setConversacionSeleccionadaId(conversacionId);
  };

  // Manejar envío de mensaje
  const handleEnviarMensaje = async (mensaje: NuevoMensaje) => {
    if (!conversacionSeleccionadaId) return;

    try {
      const nuevoMensaje = await enviarMensaje(conversacionSeleccionadaId, mensaje);
      setMensajes((prev) => [...prev, nuevoMensaje]);

      // Actualizar la conversación en la lista
      setConversaciones((prev) =>
        prev.map((conv) =>
          conv._id === conversacionSeleccionadaId
            ? {
                ...conv,
                ultimoMensaje: nuevoMensaje.fechaEnvio,
                ultimoMensajePreview: nuevoMensaje.cuerpo.substring(0, 100),
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error; // Re-lanzar para que ChatWindow lo maneje
    }
  };

  // Cargar más mensajes (paginación)
  const handleCargarMasMensajes = async () => {
    if (!conversacionSeleccionadaId || !tieneMasMensajes || cargandoMensajes) return;

    const siguientePagina = paginaActualMensajes + 1;
    await cargarMensajes(conversacionSeleccionadaId, siguientePagina, false);
    setPaginaActualMensajes(siguientePagina);
  };

  // Crear nueva conversación
  const handleCrearNuevaConversacion = async () => {
    if (!nuevoAsunto.trim() || !nuevoMensajeInicial.trim()) {
      alert('Por favor, completa el asunto y el mensaje');
      return;
    }

    try {
      setCreandoConversacion(true);
      // Nota: En una implementación real, necesitarías el ID del destinatario
      // Por ahora, asumimos que se crea con el primer destinatario disponible
      const nuevaConversacion = await iniciarNuevaConversacion({
        destinatarioId: '', // Esto debería venir de alguna selección o configuración
        asunto: nuevoAsunto,
        cuerpo: nuevoMensajeInicial,
      });

      // Agregar a la lista y seleccionarla
      setConversaciones((prev) => [nuevaConversacion, ...prev]);
      setConversacionSeleccionadaId(nuevaConversacion._id);
      setMostrarModalNuevaConversacion(false);
      setNuevoAsunto('');
      setNuevoMensajeInicial('');
    } catch (error) {
      console.error('Error al crear conversación:', error);
      alert(error instanceof Error ? error.message : 'Error al crear la conversación');
    } finally {
      setCreandoConversacion(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onVolver && (
              <button
                onClick={onVolver}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mensajería Segura</h1>
                <p className="text-sm text-gray-600">Comunícate con la clínica de forma privada</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setMostrarModalNuevaConversacion(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva conversación</span>
          </button>
        </div>

        {/* Layout principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Panel lateral - Lista de conversaciones */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900">Conversaciones</h2>
              </div>
              <ConversationList
                conversaciones={conversaciones}
                conversacionSeleccionadaId={conversacionSeleccionadaId}
                onSeleccionarConversacion={handleSeleccionarConversacion}
                isLoading={cargandoConversaciones}
              />
            </div>

            {/* Panel principal - Chat */}
            <div className="flex-1 flex flex-col">
              {conversacionSeleccionadaId && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900">
                    {conversaciones.find((c) => c._id === conversacionSeleccionadaId)?.asunto || 'Conversación'}
                  </h2>
                </div>
              )}
              <ChatWindow
                conversacionId={conversacionSeleccionadaId}
                mensajes={mensajes}
                isLoading={cargandoMensajes}
                onEnviarMensaje={handleEnviarMensaje}
                onCargarMas={handleCargarMasMensajes}
                tieneMasMensajes={tieneMasMensajes}
                userId={userId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal para nueva conversación */}
      {mostrarModalNuevaConversacion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nueva Conversación</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                <input
                  type="text"
                  value={nuevoAsunto}
                  onChange={(e) => setNuevoAsunto(e.target.value)}
                  placeholder="Ej: Consulta sobre tratamiento"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={creandoConversacion}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <textarea
                  value={nuevoMensajeInicial}
                  onChange={(e) => setNuevoMensajeInicial(e.target.value)}
                  placeholder="Escribe tu mensaje inicial..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={creandoConversacion}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setMostrarModalNuevaConversacion(false);
                  setNuevoAsunto('');
                  setNuevoMensajeInicial('');
                }}
                disabled={creandoConversacion}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearNuevaConversacion}
                disabled={creandoConversacion || !nuevoAsunto.trim() || !nuevoMensajeInicial.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creandoConversacion ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

