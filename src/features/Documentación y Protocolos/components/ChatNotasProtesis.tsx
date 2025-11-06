import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, User } from 'lucide-react';
import { NotaComunicacion } from '../api/protesisApi';
import { useAuth } from '../../../contexts/AuthContext';

interface ChatNotasProtesisProps {
  notas: NotaComunicacion[];
  onEnviarNota: (contenido: string, tipo: 'clinica' | 'laboratorio') => Promise<void>;
  tipoUsuario: 'clinica' | 'laboratorio';
}

export default function ChatNotasProtesis({
  notas,
  onEnviarNota,
  tipoUsuario,
}: ChatNotasProtesisProps) {
  const { user } = useAuth();
  const [nuevaNota, setNuevaNota] = useState('');
  const [enviando, setEnviando] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const notasOrdenadas = [...notas].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [notas]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaNota.trim() || enviando) return;

    setEnviando(true);
    try {
      await onEnviarNota(nuevaNota, tipoUsuario);
      setNuevaNota('');
    } catch (error) {
      console.error('Error al enviar nota:', error);
      alert('Error al enviar la nota. Por favor, inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col h-96">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Comunicación</h3>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notasOrdenadas.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No hay mensajes aún</p>
            <p className="text-sm">Inicia la conversación enviando un mensaje</p>
          </div>
        ) : (
          notasOrdenadas.map((nota) => {
            const esPropio = nota.autor._id === user?._id;
            const esClinica = nota.tipo === 'clinica';

            return (
              <div
                key={nota._id}
                className={`flex ${esPropio ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    esPropio
                      ? esClinica
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-semibold">{nota.autor.nombre}</span>
                    <span className="text-xs opacity-75">
                      ({esClinica ? 'Clínica' : 'Laboratorio'})
                    </span>
                  </div>
                  <p className="text-sm">{nota.contenido}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(nota.fecha).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Formulario de envío */}
      <form onSubmit={handleEnviar} className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={enviando}
          />
          <button
            type="submit"
            disabled={!nuevaNota.trim() || enviando}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{enviando ? 'Enviando...' : 'Enviar'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}


