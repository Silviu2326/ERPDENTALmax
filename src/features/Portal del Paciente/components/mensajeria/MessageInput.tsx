import { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { NuevoMensaje } from '../../api/mensajeriaApi';

interface MessageInputProps {
  onEnviar: (mensaje: NuevoMensaje) => void;
  disabled?: boolean;
  onAdjuntar?: (archivos: File[]) => void;
}

export default function MessageInput({ onEnviar, disabled = false, onAdjuntar }: MessageInputProps) {
  const [mensaje, setMensaje] = useState('');
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mensaje.trim() || archivosAdjuntos.length > 0) {
      // En una implementación real, primero se subirían los archivos y se obtendrían las URLs
      // Por ahora, simulamos que las URLs se obtendrán después
      const nuevoMensaje: NuevoMensaje = {
        cuerpo: mensaje.trim(),
        adjuntos: archivosAdjuntos.length > 0 ? [] : undefined, // Se rellenaría con las URLs reales
      };
      onEnviar(nuevoMensaje);
      setMensaje('');
      setArchivosAdjuntos([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setArchivosAdjuntos((prev) => [...prev, ...files]);
      if (onAdjuntar) {
        onAdjuntar(files);
      }
    }
    // Resetear el input para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const eliminarAdjunto = (index: number) => {
    setArchivosAdjuntos((prev) => prev.filter((_, i) => i !== index));
  };

  const formatearTamañoArchivo = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {archivosAdjuntos.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {archivosAdjuntos.map((archivo, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm"
            >
              <Paperclip className="w-4 h-4" />
              <span className="max-w-[200px] truncate">{archivo.name}</span>
              <span className="text-blue-500">({formatearTamañoArchivo(archivo.size)})</span>
              <button
                onClick={() => eliminarAdjunto(index)}
                className="hover:bg-blue-100 rounded p-1 transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Adjuntar archivo"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Escribe un mensaje..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />
        <button
          type="submit"
          disabled={disabled || (!mensaje.trim() && archivosAdjuntos.length === 0)}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          title="Enviar mensaje"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}


