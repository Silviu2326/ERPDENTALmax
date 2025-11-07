import { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ControlEndodontico } from '../api/controlesEndodonciaApi';

interface VisorRadiografiasComparativoProps {
  controles: ControlEndodontico[];
  isOpen: boolean;
  onClose: () => void;
  controlInicial?: ControlEndodontico;
  indiceInicial?: number;
}

export default function VisorRadiografiasComparativo({
  controles,
  isOpen,
  onClose,
  controlInicial,
  indiceInicial = 0,
}: VisorRadiografiasComparativoProps) {
  const [zoom, setZoom] = useState(1);
  const [rotacion, setRotacion] = useState(0);
  const [indiceImagen, setIndiceImagen] = useState(indiceInicial);
  const [modoComparacion, setModoComparacion] = useState(false);
  const [controlComparacion, setControlComparacion] = useState<ControlEndodontico | null>(null);

  if (!isOpen) return null;

  // Encontrar el control inicial
  const controlActual = controlInicial || controles[indiceImagen];
  if (!controlActual) return null;

  // Obtener todas las imágenes de los controles
  const todasLasImagenes = controles
    .flatMap((control) =>
      control.adjuntos.map((adjunto) => ({
        url: adjunto.url,
        nombre: adjunto.nombreArchivo,
        fecha: control.fechaControl,
        controlId: control._id,
      }))
    )
    .filter((img) => img.url);

  const imagenActual = todasLasImagenes[indiceImagen];
  const imagenComparacion = controlComparacion?.adjuntos[0];

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotar = () => setRotacion((prev) => (prev + 90) % 360);
  const handleSiguiente = () => setIndiceImagen((prev) => (prev + 1) % todasLasImagenes.length);
  const handleAnterior = () =>
    setIndiceImagen((prev) => (prev - 1 + todasLasImagenes.length) % todasLasImagenes.length);

  const handleComparar = (control: ControlEndodontico) => {
    if (controlComparacion?._id === control._id) {
      setControlComparacion(null);
      setModoComparacion(false);
    } else {
      setControlComparacion(control);
      setModoComparacion(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-50 text-white">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {imagenActual?.nombre || 'Radiografía'}
            </h2>
            <span className="text-sm text-gray-300">
              {new Date(imagenActual?.fecha || '').toLocaleDateString('es-ES')}
            </span>
            {modoComparacion && imagenComparacion && (
              <span className="text-sm text-blue-300">
                Comparando con{' '}
                {new Date(controlComparacion.fechaControl).toLocaleDateString('es-ES')}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center gap-2 p-4 bg-black bg-opacity-50">
          <button
            onClick={handleAnterior}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white text-sm px-3">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleRotar}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="px-3 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-sm"
          >
            Reset
          </button>
        </div>

        {/* Área de visualización */}
        <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
          {modoComparacion && imagenComparacion ? (
            <div className="flex gap-4 h-full w-full">
              {/* Imagen actual */}
              <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-900">
                <img
                  src={imagenActual?.url}
                  alt={imagenActual?.nombre}
                  className="max-w-full max-h-full"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotacion}deg)`,
                    transition: 'transform 0.2s',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.png';
                  }}
                />
              </div>
              {/* Imagen de comparación */}
              <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-900">
                <img
                  src={imagenComparacion.url}
                  alt={imagenComparacion.nombreArchivo}
                  className="max-w-full max-h-full"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotacion}deg)`,
                    transition: 'transform 0.2s',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.png';
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center overflow-auto bg-gray-900 h-full w-full">
              <img
                src={imagenActual?.url}
                alt={imagenActual?.nombre}
                className="max-w-full max-h-full"
                style={{
                  transform: `scale(${zoom}) rotate(${rotacion}deg)`,
                  transition: 'transform 0.2s',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                }}
              />
            </div>
          )}
        </div>

        {/* Lista de controles para comparación */}
        <div className="bg-black bg-opacity-50 p-4 max-h-32 overflow-y-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white text-sm font-medium mr-2">Comparar con:</span>
            {controles.map((control) => (
              <button
                key={control._id}
                onClick={() => handleComparar(control)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  controlComparacion?._id === control._id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {new Date(control.fechaControl).toLocaleDateString('es-ES')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



