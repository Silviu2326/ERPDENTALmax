import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface VisorFotosRetencionProps {
  fotos: string[];
}

export default function VisorFotosRetencion({ fotos }: VisorFotosRetencionProps) {
  const [fotoActual, setFotoActual] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);

  const fotoAnterior = () => {
    setFotoActual((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  const fotoSiguiente = () => {
    setFotoActual((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  });

  if (fotos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fotos.map((foto, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:border-blue-400 transition-all"
            onClick={() => {
              setFotoActual(index);
              setMostrarModal(true);
            }}
          >
            <img
              src={foto}
              alt={`Foto de seguimiento ${index + 1}`}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white text-xs font-medium">Foto {index + 1}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de visualización */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            {/* Botón cerrar */}
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Imagen */}
            <div className="flex items-center justify-center h-full">
              <img
                src={fotos[fotoActual]}
                alt={`Foto ${fotoActual + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
                }}
              />
            </div>

            {/* Controles de navegación */}
            {fotos.length > 1 && (
              <>
                <button
                  onClick={fotoAnterior}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={fotoSiguiente}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Indicador de posición */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
                  {fotoActual + 1} / {fotos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}



