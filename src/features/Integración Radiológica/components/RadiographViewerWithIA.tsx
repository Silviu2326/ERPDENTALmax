import { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { HallazgoIA } from './AnalysisFindingItem';

interface RadiographViewerWithIAProps {
  imagenUrl: string;
  hallazgos?: HallazgoIA[];
  onCentrarVista?: (coordenadas: HallazgoIA['coordenadas']) => void;
  className?: string;
}

export default function RadiographViewerWithIA({
  imagenUrl,
  hallazgos = [],
  onCentrarVista,
  className = '',
}: RadiographViewerWithIAProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedHallazgo, setSelectedHallazgo] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Centrar vista en un hallazgo específico
  useEffect(() => {
    if (onCentrarVista && hallazgos.length > 0) {
      // Este efecto se puede activar desde el componente padre
    }
  }, [hallazgos, onCentrarVista]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleHallazgoClick = (hallazgo: HallazgoIA, index: number) => {
    setSelectedHallazgo(index);
    if (onCentrarVista) {
      onCentrarVista(hallazgo.coordenadas);
    }
    // Centrar y hacer zoom en el hallazgo
    if (containerRef.current && imageRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      
      // Calcular posición relativa del hallazgo
      const relativeX = hallazgo.coordenadas.x + hallazgo.coordenadas.w / 2;
      const relativeY = hallazgo.coordenadas.y + hallazgo.coordenadas.h / 2;
      
      // Ajustar pan y zoom para centrar el hallazgo
      setZoom(2);
      setPan({
        x: centerX - relativeX * 2,
        y: centerY - relativeY * 2,
      });
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const getHallazgoColor = (index: number) => {
    const colors = [
      'rgba(239, 68, 68, 0.6)', // red
      'rgba(59, 130, 246, 0.6)', // blue
      'rgba(34, 197, 94, 0.6)', // green
      'rgba(251, 191, 36, 0.6)', // yellow
      'rgba(168, 85, 247, 0.6)', // purple
      'rgba(249, 115, 22, 0.6)', // orange
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-900 overflow-hidden ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Controles de zoom */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-lg ring-1 ring-gray-200/50">
        <button
          onClick={handleZoomIn}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={zoom >= 3}
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={zoom <= 0.5}
        >
          −
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
        >
          Reset
        </button>
        <button
          onClick={toggleFullscreen}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {isFullscreen ? <Minimize2 size={16} className="mx-auto" /> : <Maximize2 size={16} className="mx-auto" />}
        </button>
      </div>

      {/* Indicador de zoom */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg ring-1 ring-gray-200/50">
        <span className="text-sm font-semibold text-gray-900">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Contenedor de imagen con transformaciones */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transition: isPanning ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <img
          ref={imageRef}
          src={imagenUrl}
          alt="Radiografía"
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
          onError={(e) => {
            console.error('Error al cargar imagen:', imagenUrl);
          }}
        />

        {/* Overlay de hallazgos */}
        {hallazgos.length > 0 && imageRef.current && (
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              width: imageRef.current.offsetWidth,
              height: imageRef.current.offsetHeight,
            }}
          >
            {hallazgos.map((hallazgo, index) => {
              const isSelected = selectedHallazgo === index;
              const color = getHallazgoColor(index);
              
              return (
                <g key={index}>
                  {/* Caja delimitadora */}
                  <rect
                    x={hallazgo.coordenadas.x}
                    y={hallazgo.coordenadas.y}
                    width={hallazgo.coordenadas.w}
                    height={hallazgo.coordenadas.h}
                    fill={isSelected ? color.replace('0.6', '0.8') : color}
                    stroke={isSelected ? 'white' : 'rgba(255, 255, 255, 0.8)'}
                    strokeWidth={isSelected ? 3 : 2}
                    className="pointer-events-auto cursor-pointer"
                    onClick={() => handleHallazgoClick(hallazgo, index)}
                  />
                  {/* Etiqueta */}
                  <text
                    x={hallazgo.coordenadas.x}
                    y={hallazgo.coordenadas.y - 5}
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    className="pointer-events-auto cursor-pointer"
                    onClick={() => handleHallazgoClick(hallazgo, index)}
                    style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    }}
                  >
                    {index + 1}. {hallazgo.tipo.replace(/_/g, ' ')}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Leyenda de hallazgos */}
      {hallazgos.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg ring-1 ring-gray-200/50 max-h-32 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {hallazgos.map((hallazgo, index) => (
              <button
                key={index}
                onClick={() => handleHallazgoClick(hallazgo, index)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedHallazgo === index
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  borderLeft: `4px solid ${getHallazgoColor(index)}`,
                }}
              >
                {index + 1}. {hallazgo.tipo.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



