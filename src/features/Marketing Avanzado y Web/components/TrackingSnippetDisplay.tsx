import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { TrackingConfig, generateTrackingSnippet } from '../api/trackingApi';

interface TrackingSnippetDisplayProps {
  configurations: TrackingConfig[];
  onClose: () => void;
}

export default function TrackingSnippetDisplay({
  configurations,
  onClose,
}: TrackingSnippetDisplayProps) {
  const [copied, setCopied] = useState(false);

  const snippet = generateTrackingSnippet(configurations);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Snippet de Código de Seguimiento</h2>
            <p className="text-sm text-gray-600 mt-1">
              Copia este código y pégalo en el <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">&lt;head&gt;</code> de tu sitio web
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto ring-1 ring-slate-800">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
              {snippet}
            </pre>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-700 mb-1">Instrucciones:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Selecciona todo el código (Ctrl+A / Cmd+A)</li>
                <li>Haz clic en el botón "Copiar" o usa Ctrl+C / Cmd+C</li>
                <li>Pega el código en el <code className="bg-slate-200 px-1 rounded text-slate-700">&lt;head&gt;</code> de todas las páginas de tu sitio web</li>
              </ol>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong className="text-yellow-900">Importante:</strong> Este script debe cargarse de forma asíncrona para no afectar el rendimiento de tu sitio web.
              Asegúrate de que tu sitio web tenga un banner de cookies activo y que los píxeles solo se activen después de obtener el consentimiento del usuario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



