import { useState, useRef } from 'react';
import { Upload, X, File, Download, Trash2 } from 'lucide-react';
import { ArchivoAdjunto } from '../api/ordenesLaboratorioApi';

interface UploaderArchivosAdjuntosProps {
  archivos: ArchivoAdjunto[];
  onArchivosSubidos?: (archivos: File[]) => Promise<void>;
  onEliminarArchivo?: (archivoId: string) => Promise<void>;
  disabled?: boolean;
  maxSizeMB?: number;
}

export default function UploaderArchivosAdjuntos({
  archivos,
  onArchivosSubidos,
  onEliminarArchivo,
  disabled = false,
  maxSizeMB = 50,
}: UploaderArchivosAdjuntosProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
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

    if (disabled || !onArchivosSubidos) return;

    const files = Array.from(e.dataTransfer.files);
    await procesarArchivos(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !onArchivosSubidos) return;

    const files = Array.from(e.target.files);
    await procesarArchivos(files);
    
    // Resetear el input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const procesarArchivos = async (files: File[]) => {
    // Validar tamaño
    const archivosValidos = files.filter((file) => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        alert(`El archivo ${file.name} excede el tamaño máximo de ${maxSizeMB}MB`);
        return false;
      }
      return true;
    });

    if (archivosValidos.length === 0) return;

    setUploading(true);
    try {
      await onArchivosSubidos(archivosValidos);
    } catch (error) {
      console.error('Error al subir archivos:', error);
      alert('Error al subir los archivos. Por favor, inténtelo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleEliminar = async (archivoId: string) => {
    if (!onEliminarArchivo || disabled) return;

    if (confirm('¿Está seguro de que desea eliminar este archivo?')) {
      try {
        await onEliminarArchivo(archivoId);
      } catch (error) {
        console.error('Error al eliminar archivo:', error);
        alert('Error al eliminar el archivo');
      }
    }
  };

  const formatearTamaño = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Archivos Adjuntos
      </label>

      {/* Zona de subida */}
      {!disabled && onArchivosSubidos && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || uploading}
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Arrastre archivos aquí o{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-800 underline"
              disabled={disabled || uploading}
            >
              seleccione archivos
            </button>
          </p>
          <p className="text-xs text-gray-500">
            Tamaño máximo por archivo: {maxSizeMB}MB
          </p>
          {uploading && (
            <p className="mt-2 text-sm text-blue-600">Subiendo archivos...</p>
          )}
        </div>
      )}

      {/* Lista de archivos */}
      {archivos.length > 0 && (
        <div className="space-y-2">
          {archivos.map((archivo) => (
            <div
              key={archivo._id || archivo.nombreArchivo}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <File className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {archivo.nombreArchivo}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formatearTamaño(archivo.tamaño)}</span>
                    {archivo.fechaSubida && (
                      <>
                        <span>•</span>
                        <span>
                          {new Date(archivo.fechaSubida).toLocaleDateString('es-ES')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {archivo.url && (
                  <a
                    href={archivo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Descargar"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                {onEliminarArchivo && archivo._id && !disabled && (
                  <button
                    type="button"
                    onClick={() => handleEliminar(archivo._id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {archivos.length === 0 && !onArchivosSubidos && (
        <p className="text-sm text-gray-500 text-center py-4">
          No hay archivos adjuntos
        </p>
      )}
    </div>
  );
}


