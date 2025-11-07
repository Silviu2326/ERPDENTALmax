import { useState, useRef } from 'react';
import { Upload, File, X, Trash2, AlertCircle } from 'lucide-react';

interface UploaderDocumentosCapaProps {
  documentos: string[];
  onSubirArchivos: (archivos: File[]) => Promise<void>;
  onEliminarDocumento?: (url: string) => Promise<void>;
  readonly?: boolean;
  loading?: boolean;
}

export default function UploaderDocumentosCapa({
  documentos,
  onSubirArchivos,
  onEliminarDocumento,
  readonly = false,
  loading = false,
}: UploaderDocumentosCapaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (readonly || loading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await procesarArchivos(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await procesarArchivos(Array.from(e.target.files));
    }
  };

  const procesarArchivos = async (archivos: File[]) => {
    setError(null);
    setUploading(true);

    try {
      await onSubirArchivos(archivos);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al subir los archivos'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleEliminar = async (url: string) => {
    if (readonly || !onEliminarDocumento) return;

    if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      try {
        await onEliminarDocumento(url);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al eliminar el documento'
        );
      }
    }
  };

  const getNombreArchivo = (url: string) => {
    try {
      const partes = url.split('/');
      return partes[partes.length - 1] || 'Documento';
    } catch {
      return 'Documento';
    }
  };

  const abrirDocumento = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-xl ring-1 ring-blue-200/70">
          <File size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Documentos Adjuntos
          </h3>
          <p className="text-sm text-gray-500">
            Archivos y evidencia relacionada con la CAPA
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Área de subida */}
      {!readonly && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400'
          } ${uploading || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading || loading}
          />
          <div className="text-center">
            <Upload
              size={48}
              className={`mx-auto mb-3 ${
                dragActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {uploading ? (
                'Subiendo archivos...'
              ) : (
                <>
                  Arrastra archivos aquí o{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 underline"
                    disabled={uploading || loading}
                  >
                    selecciona archivos
                  </button>
                </>
              )}
            </p>
            <p className="text-xs text-gray-500">
              Formatos soportados: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>
        </div>
      )}

      {/* Lista de documentos */}
      {documentos.length > 0 ? (
        <div className="space-y-2">
          {documentos.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl ring-1 ring-slate-200 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File size={20} className="text-gray-500 flex-shrink-0" />
                <span
                  className="text-sm text-gray-900 truncate cursor-pointer hover:text-blue-600"
                  onClick={() => abrirDocumento(url)}
                  title={url}
                >
                  {getNombreArchivo(url)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => abrirDocumento(url)}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Abrir documento"
                >
                  <File size={16} />
                </button>
                {!readonly && onEliminarDocumento && (
                  <button
                    onClick={() => handleEliminar(url)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar documento"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <File size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm">No hay documentos adjuntos</p>
        </div>
      )}
    </div>
  );
}



