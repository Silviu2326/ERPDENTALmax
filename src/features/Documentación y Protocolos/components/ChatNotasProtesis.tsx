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
    <div className="bg-white shadow-sm rounded-lg flex flex-col h-96">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Comunicación</h3>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notasOrdenadas.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay mensajes aún</h3>
            <p className="text-gray-600">Inicia la conversación enviando un mensaje</p>
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
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                    esPropio
                      ? esClinica
                        ? 'bg-blue-600 text-white'
                        : 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} />
                    <span className="text-xs font-semibold">{nota.autor.nombre}</span>
                    <span className="text-xs opacity-75">
                      ({esClinica ? 'Clínica' : 'Laboratorio'})
                    </span>
                  </div>
                  <p className="text-sm">{nota.contenido}</p>
                  <p className="text-xs opacity-75 mt-2">
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
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            disabled={enviando}
          />
          <button
            type="submit"
            disabled={!nuevaNota.trim() || enviando}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            <span>{enviando ? 'Enviando...' : 'Enviar'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}



