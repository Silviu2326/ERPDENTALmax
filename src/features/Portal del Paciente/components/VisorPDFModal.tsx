import { useState, useEffect } from 'react';
import { X, Download, FileText, Loader2 } from 'lucide-react';
import { obtenerUrlDescarga } from '../api/documentosApi';

interface VisorPDFModalProps {
  documentoId: string;
  nombreArchivo: string;
  onCerrar: () => void;
  onDescargar?: () => void;
}

export default function VisorPDFModal({
  documentoId,
  nombreArchivo,
  onCerrar,
  onDescargar,
}: VisorPDFModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarPDF = async () => {
      try {
        setCargando(true);
        setError(null);

        const { url } = await obtenerUrlDescarga(documentoId);
        setPdfUrl(url);
      } catch (err) {
        console.error('Error al cargar el PDF:', err);
        setError('No se pudo cargar el documento. Por favor, inténtalo de nuevo.');
      } finally {
        setCargando(false);
      }
    };

    cargarPDF();
  }, [documentoId]);

  const handleDescargar = async () => {
    if (onDescargar) {
      onDescargar();
    } else if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {nombreArchivo}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDescargar}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Descargar"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Descargar</span>
            </button>
            <button
              onClick={onCerrar}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          {cargando ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Cargando documento...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <p className="text-red-800 text-center">{error}</p>
              </div>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full min-h-[600px] border border-gray-300 rounded-lg bg-white"
              title="Visor de PDF"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}


