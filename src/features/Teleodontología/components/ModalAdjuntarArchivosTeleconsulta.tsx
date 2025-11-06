import { useState } from 'react';
import { X, Upload, File, Trash2, Image as ImageIcon, FileText } from 'lucide-react';
import { ArchivoAdjunto } from '../api/informeTeleconsultaApi';

interface ModalAdjuntarArchivosTeleconsultaProps {
  isOpen: boolean;
  onClose: () => void;
  archivosActuales: ArchivoAdjunto[];
  onArchivosSubidos: (archivos: ArchivoAdjunto[]) => void;
  onEliminarArchivo: (archivoId: string) => void;
  onSubirArchivos: (files: File[]) => Promise<ArchivoAdjunto[]>;
}

export default function ModalAdjuntarArchivosTeleconsulta({
  isOpen,
  onClose,
  archivosActuales,
  onArchivosSubidos,
  onEliminarArchivo,
  onSubirArchivos,
}: ModalAdjuntarArchivosTeleconsultaProps) {
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validar tipos de archivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const archivosValidos = files.filter((file) => {
      if (!tiposPermitidos.includes(file.type)) {
        setError(`El archivo ${file.name} no es un tipo válido. Solo se permiten imágenes y PDFs.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`El archivo ${file.name} es demasiado grande. Tamaño máximo: 10MB.`);
        return false;
      }
      return true;
    });

    setArchivosSeleccionados((prev) => [...prev, ...archivosValidos]);
    setError(null);
  };

  const eliminarArchivoSeleccionado = (index: number) => {
    setArchivosSeleccionados((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubir = async () => {
    if (archivosSeleccionados.length === 0) {
      setError('Por favor, seleccione al menos un archivo para subir');
      return;
    }

    setSubiendo(true);
    setError(null);

    try {
      const archivosSubidos = await onSubirArchivos(archivosSeleccionados);
      onArchivosSubidos(archivosSubidos);
      setArchivosSeleccionados([]);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al subir archivos');
    } finally {
      setSubiendo(false);
    }
  };

  const getIconoArchivo = (tipo?: string) => {
    if (tipo?.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const formatearTamaño = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Adjuntar Archivos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Archivos actuales */}
          {archivosActuales.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Archivos adjuntos actuales</h3>
              <div className="space-y-2">
                {archivosActuales.map((archivo) => (
                  <div
                    key={archivo._id || archivo.url}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getIconoArchivo(archivo.tipo)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{archivo.nombre}</p>
                        <p className="text-xs text-gray-500">{formatearTamaño(archivo.tamano)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => archivo._id && onEliminarArchivo(archivo._id)}
                      className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subir nuevos archivos */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Subir nuevos archivos</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-4">
                Arrastre archivos aquí o haga clic para seleccionar
              </p>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
              >
                Seleccionar Archivos
              </label>
              <p className="text-xs text-gray-500 mt-3">
                Formatos permitidos: JPG, PNG, GIF, PDF. Tamaño máximo: 10MB por archivo
              </p>
            </div>

            {/* Lista de archivos seleccionados */}
            {archivosSeleccionados.length > 0 && (
              <div className="mt-4 space-y-2">
                {archivosSeleccionados.map((archivo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <File className="w-5 h-5 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{archivo.name}</p>
                        <p className="text-xs text-gray-500">{formatearTamaño(archivo.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarArchivoSeleccionado(index)}
                      className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubir}
            disabled={subiendo || archivosSeleccionados.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {subiendo ? 'Subiendo...' : 'Subir Archivos'}
          </button>
        </div>
      </div>
    </div>
  );
}


