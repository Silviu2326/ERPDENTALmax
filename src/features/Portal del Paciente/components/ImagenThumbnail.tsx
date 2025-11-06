import { ImagenClinica } from '../api/imagenesApi';
import { Image, Calendar } from 'lucide-react';

interface ImagenThumbnailProps {
  imagen: ImagenClinica;
  onClick: () => void;
}

const tipoLabels: Record<string, string> = {
  RX_PERIAPICAL: 'RX Periapical',
  RX_BITEWING: 'RX Bitewing',
  RX_PANORAMICA: 'RX Panorámica',
  FOTO_INTRAORAL: 'Foto Intraoral',
  FOTO_EXTRAORAL: 'Foto Extraoral',
  TOMOGRAFIA: 'Tomografía',
  OTRO: 'Otro',
};

export default function ImagenThumbnail({ imagen, onClick }: ImagenThumbnailProps) {
  const fechaFormateada = new Date(imagen.fecha_captura).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 group"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {imagen.url_thumbnail ? (
          <img
            src={imagen.url_thumbnail}
            alt={imagen.nombre || 'Imagen clínica'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Si falla la carga de la imagen, mostrar un placeholder
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Image className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {tipoLabels[imagen.tipo] || imagen.tipo}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
          {imagen.nombre || 'Sin nombre'}
        </h3>
        <div className="flex items-center text-xs text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{fechaFormateada}</span>
        </div>
        {imagen.descripcion && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {imagen.descripcion}
          </p>
        )}
      </div>
    </div>
  );
}


