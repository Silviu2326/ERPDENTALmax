import { ImagenClinica } from '../api/imagenesApi';
import ImagenThumbnail from './ImagenThumbnail';
import { Loader2, ImageOff } from 'lucide-react';

interface GaleriaImagenesGridProps {
  imagenes: ImagenClinica[];
  cargando: boolean;
  onImagenClick: (imagen: ImagenClinica) => void;
}

export default function GaleriaImagenesGrid({ imagenes, cargando, onImagenClick }: GaleriaImagenesGridProps) {
  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando imágenes...</p>
        </div>
      </div>
    );
  }

  if (imagenes.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <ImageOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay imágenes disponibles
          </h3>
          <p className="text-gray-600">
            No se encontraron imágenes que coincidan con los filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {imagenes.map((imagen) => (
        <ImagenThumbnail
          key={imagen.id}
          imagen={imagen}
          onClick={() => onImagenClick(imagen)}
        />
      ))}
    </div>
  );
}


