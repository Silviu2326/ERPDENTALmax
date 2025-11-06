import { useState } from 'react';
import { X, FileImage, Edit2 } from 'lucide-react';

export interface ImagenConMetadata {
  file: File;
  preview: string;
  tipoImagen: string;
  notas: string;
  id: string;
}

interface ImagePreviewCardProps {
  imagen: ImagenConMetadata;
  onRemove: (id: string) => void;
  onMetadataChange: (id: string, tipoImagen: string, notas: string) => void;
  tiposImagen: string[];
}

export default function ImagePreviewCard({
  imagen,
  onRemove,
  onMetadataChange,
  tiposImagen,
}: ImagePreviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tipoImagen, setTipoImagen] = useState(imagen.tipoImagen);
  const [notas, setNotas] = useState(imagen.notas);

  const handleSave = () => {
    onMetadataChange(imagen.id, tipoImagen, notas);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTipoImagen(imagen.tipoImagen);
    setNotas(imagen.notas);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        {imagen.preview ? (
          <img
            src={imagen.preview}
            alt={imagen.file.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileImage className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <button
          onClick={() => onRemove(imagen.id)}
          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
          aria-label="Eliminar imagen"
        >
          <X className="w-4 h-4" />
        </button>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-2 left-2 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
            aria-label="Editar metadatos"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-sm font-medium text-gray-900 truncate mb-2" title={imagen.file.name}>
          {imagen.file.name}
        </p>
        <p className="text-xs text-gray-500 mb-3">
          {(imagen.file.size / 1024 / 1024).toFixed(2)} MB
        </p>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo de Imagen
              </label>
              <select
                value={tipoImagen}
                onChange={(e) => setTipoImagen(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar tipo...</option>
                {tiposImagen.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Agregar notas sobre esta imagen..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {tipoImagen && (
              <div>
                <span className="text-xs font-medium text-gray-500">Tipo: </span>
                <span className="text-xs text-gray-900">{tipoImagen}</span>
              </div>
            )}
            {notas && (
              <div>
                <span className="text-xs font-medium text-gray-500">Notas: </span>
                <span className="text-xs text-gray-700">{notas}</span>
              </div>
            )}
            {!tipoImagen && !notas && (
              <p className="text-xs text-gray-400 italic">
                Haz clic en el ícono de editar para agregar metadatos
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


