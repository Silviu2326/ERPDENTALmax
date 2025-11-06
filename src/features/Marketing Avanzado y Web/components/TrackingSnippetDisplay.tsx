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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Snippet de Código de Seguimiento</h2>
            <p className="text-sm text-gray-600 mt-1">
              Copia este código y pégalo en el <code className="bg-gray-100 px-1 rounded">&lt;head&gt;</code> de tu sitio web
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
              {snippet}
            </pre>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Instrucciones:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Selecciona todo el código (Ctrl+A / Cmd+A)</li>
                <li>Haz clic en el botón "Copiar" o usa Ctrl+C / Cmd+C</li>
                <li>Pega el código en el <code className="bg-gray-200 px-1 rounded">&lt;head&gt;</code> de todas las páginas de tu sitio web</li>
              </ol>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Este script debe cargarse de forma asíncrona para no afectar el rendimiento de tu sitio web.
              Asegúrate de que tu sitio web tenga un banner de cookies activo y que los píxeles solo se activen después de obtener el consentimiento del usuario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


