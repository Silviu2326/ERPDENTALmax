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
    <div className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow ring-1 ring-slate-200 h-full flex flex-col">
      <div className="relative aspect-square bg-gray-100 h-48">
        {imagen.preview ? (
          <img
            src={imagen.preview}
            alt={imagen.file.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileImage size={48} className="text-gray-400" />
          </div>
        )}
        <button
          onClick={() => onRemove(imagen.id)}
          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
          aria-label="Eliminar imagen"
        >
          <X size={16} />
        </button>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-2 left-2 bg-blue-600 text-white p-1.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            aria-label="Editar metadatos"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-medium text-gray-900 truncate mb-2" title={imagen.file.name}>
          {imagen.file.name}
        </p>
        <p className="text-xs text-slate-500 mb-3">
          {(imagen.file.size / 1024 / 1024).toFixed(2)} MB
        </p>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Imagen
              </label>
              <select
                value={tipoImagen}
                onChange={(e) => setTipoImagen(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notas
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Agregar notas sobre esta imagen..."
              />
            </div>
            <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 text-sm rounded-xl hover:bg-slate-200 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {tipoImagen && (
              <div>
                <span className="text-xs font-medium text-slate-500">Tipo: </span>
                <span className="text-xs text-gray-900">{tipoImagen}</span>
              </div>
            )}
            {notas && (
              <div>
                <span className="text-xs font-medium text-slate-500">Notas: </span>
                <span className="text-xs text-slate-700">{notas}</span>
              </div>
            )}
            {!tipoImagen && !notas && (
              <p className="text-xs text-slate-400 italic">
                Haz clic en el ícono de editar para agregar metadatos
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



