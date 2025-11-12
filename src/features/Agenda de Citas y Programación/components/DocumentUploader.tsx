import { useState, useRef } from 'react';
import { Upload, File, X, Download, Eye, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { DocumentoCita } from '../api/citasApi';

interface DocumentUploaderProps {
  documentos: DocumentoCita[];
  onUpload: (file: File, descripcion?: string) => Promise<void>;
  onDelete: (documentoId: string) => Promise<void>;
  onDownload: (documento: DocumentoCita) => Promise<void>;
  onPreview?: (documento: DocumentoCita) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  usuarioActual?: {
    _id: string;
    nombre: string;
  };
  disabled?: boolean;
}

const MAX_SIZE_DEFAULT = 10; // 10 MB por defecto
const ALLOWED_TYPES_DEFAULT = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export default function DocumentUploader({
  documentos = [],
  onUpload,
  onDelete,
  onDownload,
  onPreview,
  maxSizeMB = MAX_SIZE_DEFAULT,
  allowedTypes = ALLOWED_TYPES_DEFAULT,
  usuarioActual,
  disabled = false,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (tipo: string) => {
    if (tipo.startsWith('image/')) return '🖼️';
    if (tipo === 'application/pdf') return '📄';
    if (tipo.includes('word') || tipo.includes('document')) return '📝';
    if (tipo.includes('excel') || tipo.includes('spreadsheet')) return '📊';
    return '📎';
  };

  const validateFile = (file: File): string | null => {
    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      return `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`;
    }

    // Validar tamaño
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `El archivo excede el tamaño máximo de ${maxSizeMB} MB`;
    }

    return null;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      await onUpload(file, descripcion || undefined);
      setDescripcion('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDelete = async (documento: DocumentoCita) => {
    if (!documento._id) return;
    
    if (!confirm(`¿Está seguro de que desea eliminar "${documento.nombre}"?`)) {
      return;
    }

    try {
      await onDelete(documento._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el documento');
    }
  };

  const handleDownload = async (documento: DocumentoCita) => {
    try {
      await onDownload(documento);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al descargar el documento');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <File className="w-5 h-5" />
          <span>Documentos Adjuntos</span>
          {documentos.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({documentos.length} {documentos.length === 1 ? 'documento' : 'documentos'})
            </span>
          )}
        </h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Área de carga */}
      {!disabled && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => handleFileSelect(e.target.files)}
            accept={allowedTypes.join(',')}
            className="hidden"
            disabled={uploading || disabled}
          />
          
          <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 mb-2">
            Arrastra un archivo aquí o{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 underline"
              disabled={uploading}
            >
              selecciona un archivo
            </button>
          </p>
          <p className="text-xs text-gray-500">
            Máximo {maxSizeMB} MB. Tipos permitidos: PDF, imágenes, Word, Excel
          </p>
          
          {/* Campo de descripción opcional */}
          <div className="mt-4 max-w-md mx-auto">
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción opcional del documento..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={uploading}
            />
          </div>

          {uploading && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Subiendo archivo...</span>
            </div>
          )}
        </div>
      )}

      {/* Lista de documentos */}
      {documentos.length > 0 && (
        <div className="space-y-2">
          {documentos
            .sort((a, b) => new Date(b.fechaSubida).getTime() - new Date(a.fechaSubida).getTime())
            .map((documento) => (
              <div
                key={documento._id || documento.nombre}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="text-2xl flex-shrink-0">
                      {getFileIcon(documento.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-800 truncate">
                          {documento.nombre}
                        </p>
                        {documento.version > 1 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            v{documento.version}
                          </span>
                        )}
                      </div>
                      {documento.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">{documento.descripcion}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{formatFileSize(documento.tamaño)}</span>
                        <span>•</span>
                        <span>
                          Subido por {documento.subidoPor.nombre}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(documento.fechaSubida).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {onPreview && (
                      <button
                        type="button"
                        onClick={() => onPreview(documento)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Previsualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDownload(documento)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Descargar"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => handleDelete(documento)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {documentos.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-500">
          <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay documentos adjuntos</p>
        </div>
      )}
    </div>
  );
}

