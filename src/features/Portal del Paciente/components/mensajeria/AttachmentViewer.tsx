import { X, Download, Image as ImageIcon, FileText, File } from 'lucide-react';
import { Adjunto } from '../../api/mensajeriaApi';

interface AttachmentViewerProps {
  adjunto: Adjunto;
  onClose: () => void;
}

export default function AttachmentViewer({ adjunto, onClose }: AttachmentViewerProps) {
  const esImagen = adjunto.tipo.startsWith('image/');
  const esPDF = adjunto.tipo.includes('pdf');

  const formatearTamaño = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const obtenerIcono = () => {
    if (esImagen) return <ImageIcon className="w-8 h-8" />;
    if (esPDF) return <FileText className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {obtenerIcono()}
            <div>
              <h3 className="font-semibold text-gray-900">{adjunto.nombre}</h3>
              {adjunto.tamaño && (
                <p className="text-sm text-gray-500">{formatearTamaño(adjunto.tamaño)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={adjunto.url}
              download
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Descargar"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
          {esImagen ? (
            <img
              src={adjunto.url}
              alt={adjunto.nombre}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : esPDF ? (
            <iframe
              src={adjunto.url}
              className="w-full h-full min-h-[500px] rounded-lg border"
              title={adjunto.nombre}
            />
          ) : (
            <div className="text-center py-12">
              {obtenerIcono()}
              <p className="mt-4 text-gray-600">Vista previa no disponible</p>
              <a
                href={adjunto.url}
                download
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar archivo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


