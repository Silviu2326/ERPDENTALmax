import { useState, useRef } from 'react';
import { File, Download, Eye, X, Upload, Image as ImageIcon, FileText } from 'lucide-react';
import { ArchivoAdjunto } from '../api/protesisApi';

interface VisorArchivosAdjuntosProtesisProps {
  archivos: ArchivoAdjunto[];
  onEliminarArchivo?: (archivoId: string) => void;
  onSubirArchivos?: (archivos: File[]) => Promise<void>;
  puedeSubir?: boolean;
  puedeEliminar?: boolean;
}

export default function VisorArchivosAdjuntosProtesis({
  archivos,
  onEliminarArchivo,
  onSubirArchivos,
  puedeSubir = false,
  puedeEliminar = false,
}: VisorArchivosAdjuntosProtesisProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (nombreArchivo: string) => {
    const extension = nombreArchivo.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
  };

  const handleDownload = (url: string, nombreArchivo: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !onSubirArchivos) return;

    setSubiendo(true);
    try {
      await onSubirArchivos(files);
    } catch (error) {
      console.error('Error al subir archivos:', error);
      alert('Error al subir los archivos. Por favor, inténtalo de nuevo.');
    } finally {
      setSubiendo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <File size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Archivos Adjuntos</h3>
          <span className="text-sm text-gray-600">({archivos.length})</span>
        </div>
        {puedeSubir && onSubirArchivos && (
          <label className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm cursor-pointer">
            <Upload size={18} />
            <span>{subiendo ? 'Subiendo...' : 'Subir Archivos'}</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={subiendo}
            />
          </label>
        )}
      </div>

      <div className="p-4">
        {archivos.length === 0 ? (
          <div className="text-center py-8">
            <File size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay archivos adjuntos</h3>
            <p className="text-gray-600">Sube archivos para adjuntarlos a esta orden</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archivos.map((archivo) => (
              <div
                key={archivo._id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(archivo.nombreArchivo)}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {archivo.nombreArchivo}
                    </span>
                  </div>
                  {puedeEliminar && onEliminarArchivo && archivo._id && (
                    <button
                      onClick={() => archivo._id && onEliminarArchivo(archivo._id)}
                      className="ml-2 p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-600 mb-3">
                  Subido por: {archivo.subidoPor.nombre}
                  <br />
                  {new Date(archivo.fechaSubida).toLocaleDateString('es-ES')}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(archivo.url)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    <Eye size={16} />
                    <span>Ver</span>
                  </button>
                  <button
                    onClick={() => handleDownload(archivo.url, archivo.nombreArchivo)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                  >
                    <Download size={16} />
                    <span>Descargar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Preview */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="max-w-4xl max-h-[90vh] p-4 relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

