import { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, Maximize2 } from 'lucide-react';

interface VisorImagenDentalAvanzadoProps {
  imagenUrl: string;
  nombreArchivo: string;
  onCerrar: () => void;
}

export default function VisorImagenDentalAvanzado({
  imagenUrl,
  nombreArchivo,
  onCerrar,
}: VisorImagenDentalAvanzadoProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCerrar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCerrar]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imagenUrl;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Barra de herramientas */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between bg-gray-800 bg-opacity-75 rounded-lg p-3 z-10">
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm font-medium truncate max-w-md">
            {nombreArchivo}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-700 rounded text-white transition-colors"
            title="Alejar"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white text-sm min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-700 rounded text-white transition-colors"
            title="Acercar"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 hover:bg-gray-700 rounded text-white transition-colors"
            title="Rotar"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-700 rounded text-white transition-colors"
            title="Resetear"
          >
            Reset
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-700 rounded text-white transition-colors"
            title="Pantalla completa"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-700 rounded text-white transition-colors"
            title="Descargar"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-red-600 rounded text-white transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contenedor de imagen */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden p-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <img
          src={imagenUrl}
          alt={nombreArchivo}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.2s',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}


