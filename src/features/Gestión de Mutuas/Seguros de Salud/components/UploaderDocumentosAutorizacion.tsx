import { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';

interface UploaderDocumentosAutorizacionProps {
  documentos: Array<{
    nombreArchivo: string;
    url: string;
    fechaSubida: string;
  }>;
  onSubirArchivos: (archivos: File[]) => Promise<void>;
  onEliminarDocumento?: (nombreArchivo: string) => void;
  disabled?: boolean;
}

export default function UploaderDocumentosAutorizacion({
  documentos,
  onSubirArchivos,
  onEliminarDocumento,
  disabled = false,
}: UploaderDocumentosAutorizacionProps) {
  const [arrastrando, setArrastrando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const tamanoMaximo = 10 * 1024 * 1024; // 10MB

  const validarArchivo = (archivo: File): string | null => {
    if (!tiposPermitidos.includes(archivo.type)) {
      return 'Tipo de archivo no permitido. Solo se aceptan PDF, JPG y PNG.';
    }
    if (archivo.size > tamanoMaximo) {
      return 'El archivo es demasiado grande. Tamaño máximo: 10MB.';
    }
    return null;
  };

  const manejarArchivos = async (archivos: FileList | null) => {
    if (!archivos || archivos.length === 0) return;

    const archivosArray = Array.from(archivos);
    const errores: string[] = [];

    archivosArray.forEach((archivo) => {
      const error = validarArchivo(archivo);
      if (error) errores.push(`${archivo.name}: ${error}`);
    });

    if (errores.length > 0) {
      setError(errores.join('\n'));
      return;
    }

    setError(null);
    setSubiendo(true);

    try {
      await onSubirArchivos(archivosArray);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir los archivos');
    } finally {
      setSubiendo(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setArrastrando(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setArrastrando(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setArrastrando(false);
    if (!disabled) {
      manejarArchivos(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    manejarArchivos(e.target.files);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Área de carga */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          arrastrando
            ? 'border-blue-500 bg-blue-50'
            : disabled
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled || subiendo}
        />
        <Upload className={`w-8 h-8 mx-auto mb-2 ${disabled ? 'text-gray-400' : 'text-gray-400'}`} />
        <p className="text-sm text-gray-600 mb-1">
          {subiendo ? 'Subiendo archivos...' : 'Arrastra archivos aquí o haz clic para seleccionar'}
        </p>
        <p className="text-xs text-gray-500">
          PDF, JPG, PNG (máx. 10MB por archivo)
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">Error al subir archivos</p>
            <p className="text-xs text-red-600 mt-1 whitespace-pre-line">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lista de documentos */}
      {documentos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Documentos adjuntos</h4>
          <div className="space-y-2">
            {documentos.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.nombreArchivo}</p>
                    <p className="text-xs text-gray-500">{formatearFecha(doc.fechaSubida)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver
                  </a>
                  {onEliminarDocumento && !disabled && (
                    <button
                      onClick={() => onEliminarDocumento(doc.nombreArchivo)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


