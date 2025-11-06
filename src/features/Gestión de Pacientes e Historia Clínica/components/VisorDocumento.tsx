import { useState, useEffect } from 'react';
import { X, Download, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { DocumentoConUrlSegura, formatearTamañoArchivo } from '../api/documentosApi';

interface VisorDocumentoProps {
  documento: DocumentoConUrlSegura;
  onClose: () => void;
}

export default function VisorDocumento({ documento, onClose }: VisorDocumentoProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [urlSegura, setUrlSegura] = useState<string | null>(null);

  useEffect(() => {
    // Si ya tenemos URL segura, usarla
    if (documento.urlSegura) {
      setUrlSegura(documento.urlSegura);
      setLoading(false);
    } else if (documento.url) {
      // Si tenemos URL directa, usarla
      setUrlSegura(documento.url);
      setLoading(false);
    } else {
      setError('No se pudo obtener la URL del documento');
      setLoading(false);
    }
  }, [documento]);

  const handleDownload = () => {
    if (urlSegura) {
      const link = document.createElement('a');
      link.href = urlSegura;
      link.download = documento.nombreOriginal;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const esImagen = documento.tipoMime?.startsWith('image/') || false;
  const esPDF = documento.tipoMime === 'application/pdf' || documento.nombreOriginal.toLowerCase().endsWith('.pdf');
  const esDICOM = documento.tipoMime?.includes('dicom') || documento.tipoMime?.includes('DICOM') || false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              {esImagen ? (
                <ImageIcon className="w-5 h-5 text-blue-600" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{documento.nombreOriginal}</h3>
              <p className="text-xs text-gray-500">
                {formatearTamañoArchivo(documento.tamaño)} • {documento.categoria}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Descargar"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center p-4">
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <p className="text-white">Cargando documento...</p>
            </div>
          ) : error ? (
            <div className="text-center bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : urlSegura ? (
            <>
              {esImagen && (
                <img
                  src={urlSegura}
                  alt={documento.nombreOriginal}
                  className="max-w-full max-h-full object-contain"
                  onLoad={() => setLoading(false)}
                  onError={() => {
                    setError('Error al cargar la imagen');
                    setLoading(false);
                  }}
                />
              )}
              {esPDF && (
                <iframe
                  src={urlSegura}
                  className="w-full h-full min-h-[600px] border-0"
                  title={documento.nombreOriginal}
                  onLoad={() => setLoading(false)}
                  onError={() => {
                    setError('Error al cargar el PDF');
                    setLoading(false);
                  }}
                />
              )}
              {esDICOM && (
                <div className="text-center text-white">
                  <p className="mb-4">Visualización de archivos DICOM requiere un visor especializado.</p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Descargar archivo DICOM
                  </button>
                </div>
              )}
              {!esImagen && !esPDF && !esDICOM && (
                <div className="text-center text-white">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">Este tipo de archivo no se puede previsualizar.</p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Descargar archivo
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-white">
              <p>No se pudo cargar el documento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


