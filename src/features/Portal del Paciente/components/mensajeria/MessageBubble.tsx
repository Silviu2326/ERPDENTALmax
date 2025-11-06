import { Paperclip, Download, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Mensaje } from '../../api/mensajeriaApi';

interface MessageBubbleProps {
  mensaje: Mensaje;
  userId?: string; // ID del usuario actual para determinar si el mensaje es suyo
}

export default function MessageBubble({ mensaje, userId }: MessageBubbleProps) {
  const esMio = userId ? mensaje.emisor.id === userId : false;

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
    return fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const obtenerIconoAdjunto = (tipo: string) => {
    if (tipo.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (tipo.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className={`flex ${esMio ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-md ${
          esMio
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        {!esMio && (
          <div className="text-xs font-semibold mb-1 opacity-80">
            {mensaje.emisor.nombre || mensaje.emisor.email || 'Clínica'}
          </div>
        )}
        <div className="whitespace-pre-wrap break-words">{mensaje.cuerpo}</div>
        {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
          <div className="mt-3 space-y-2">
            {mensaje.adjuntos.map((adjunto, idx) => (
              <a
                key={idx}
                href={adjunto.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  esMio
                    ? 'bg-blue-700/50 hover:bg-blue-700/70 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {obtenerIconoAdjunto(adjunto.tipo)}
                <span className="text-sm truncate flex-1">{adjunto.nombre}</span>
                <Download className="w-4 h-4 flex-shrink-0" />
              </a>
            ))}
          </div>
        )}
        <div
          className={`text-xs mt-2 flex items-center gap-2 ${
            esMio ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          <span>{formatearFecha(mensaje.fechaEnvio)}</span>
          {esMio && mensaje.leidoPor && mensaje.leidoPor.length > 0 && (
            <span className="text-blue-200">✓ Leído</span>
          )}
        </div>
      </div>
    </div>
  );
}

