import { useState, useRef } from 'react';
import { X, Upload, FileImage, Trash2 } from 'lucide-react';

interface ModalAdjuntarRadiografiaProps {
  isOpen: boolean;
  onClose: () => void;
  onAdjuntar: (archivos: File[]) => void;
  archivosExistentes?: { url: string; nombreArchivo: string; fechaSubida: string }[];
  onEliminarExistente?: (url: string) => void;
}

export default function ModalAdjuntarRadiografia({
  isOpen,
  onClose,
  onAdjuntar,
  archivosExistentes = [],
  onEliminarExistente,
}: ModalAdjuntarRadiografiaProps) {
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const nuevosArchivos = [...archivosSeleccionados, ...files];
    setArchivosSeleccionados(nuevosArchivos);

    // Crear previews para imágenes
    const nuevasPreviews = files.map((file) => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });
    setPreviews([...previews, ...nuevasPreviews]);
  };

  const handleEliminarSeleccionado = (index: number) => {
    const nuevosArchivos = archivosSeleccionados.filter((_, i) => i !== index);
    const nuevasPreviews = previews.filter((_, i) => i !== index);
    setArchivosSeleccionados(nuevosArchivos);
    setPreviews(nuevasPreviews);
  };

  const handleGuardar = () => {
    if (archivosSeleccionados.length > 0) {
      onAdjuntar(archivosSeleccionados);
      setArchivosSeleccionados([]);
      setPreviews([]);
      onClose();
    }
  };

  const handleCancelar = () => {
    setArchivosSeleccionados([]);
    setPreviews([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Adjuntar Radiografías</h2>
          <button
            onClick={handleCancelar}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Archivos existentes */}
          {archivosExistentes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Radiografías existentes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {archivosExistentes.map((archivo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={archivo.url}
                        alt={archivo.nombreArchivo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      {onEliminarExistente && (
                        <button
                          onClick={() => onEliminarExistente(archivo.url)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-600 truncate">{archivo.nombreArchivo}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nuevos archivos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Nuevas radiografías</h3>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">Haz clic para seleccionar archivos</p>
              <p className="text-sm text-gray-500">PNG, JPG, DICOM hasta 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.dcm"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Preview de archivos seleccionados */}
            {archivosSeleccionados.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {archivosSeleccionados.map((archivo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                      {previews[index] ? (
                        <img
                          src={previews[index]}
                          alt={archivo.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileImage className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleEliminarSeleccionado(index)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 truncate">{archivo.name}</p>
                    <p className="text-xs text-gray-400">
                      {(archivo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancelar}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={archivosSeleccionados.length === 0}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Adjuntar ({archivosSeleccionados.length})
          </button>
        </div>
      </div>
    </div>
  );
}



