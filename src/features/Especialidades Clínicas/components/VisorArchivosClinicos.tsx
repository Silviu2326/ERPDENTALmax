import { FileText, Download, X, Image as ImageIcon } from 'lucide-react';

interface VisorArchivosClinicosProps {
  archivos: string[];
  onEliminar?: (index: number) => void;
}

export default function VisorArchivosClinicos({
  archivos,
  onEliminar,
}: VisorArchivosClinicosProps) {
  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || url;
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  if (archivos.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No hay archivos adjuntos</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Archivos Clínicos Adjuntos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {archivos.map((archivo, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getFileIcon(archivo)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate" title={getFileName(archivo)}>
                  {getFileName(archivo)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => handleDownload(archivo)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Descargar"
              >
                <Download className="w-4 h-4" />
              </button>
              {onEliminar && (
                <button
                  onClick={() => onEliminar(index)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


