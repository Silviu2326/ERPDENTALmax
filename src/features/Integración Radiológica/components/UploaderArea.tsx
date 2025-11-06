import { useCallback, useState } from 'react';
import { Upload, FileImage, X } from 'lucide-react';

interface UploaderAreaProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  acceptedTypes?: string[];
}

export default function UploaderArea({
  onFilesSelected,
  disabled = false,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/dicom'],
}: UploaderAreaProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter((file) => {
      return acceptedTypes.some((type) => file.type === type || file.name.toLowerCase().endsWith('.dicom'));
    });

    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [disabled, acceptedTypes, onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;

    const files = Array.from(e.target.files).filter((file) => {
      return acceptedTypes.some((type) => file.type === type || file.name.toLowerCase().endsWith('.dicom'));
    });

    if (files.length > 0) {
      onFilesSelected(files);
    }

    // Reset input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = '';
  }, [disabled, acceptedTypes, onFilesSelected]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
        ${isDragging
          ? 'border-blue-500 bg-blue-50 scale-105'
          : disabled
          ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
          : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
        }
      `}
    >
      <input
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {isDragging ? (
            <Upload className="w-12 h-12 text-blue-600" />
          ) : (
            <FileImage className="w-12 h-12 text-gray-400" />
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-700">
            {isDragging ? 'Suelta los archivos aquí' : 'Arrastra y suelta imágenes aquí'}
          </p>
          <p className="text-sm text-gray-500">
            o haz clic para seleccionar archivos
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Formatos soportados: JPEG, PNG, DICOM
          </p>
        </div>
      </div>
    </div>
  );
}


