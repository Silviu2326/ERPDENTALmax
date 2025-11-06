import { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Maximize2, Minus, Plus, Sun, Moon } from 'lucide-react';
import { Radiologia } from '../api/radiologiaApi';

interface VisorDicomDetalladoProps {
  radiologia: Radiologia;
  isOpen: boolean;
  onClose: () => void;
  onAnterior?: () => void;
  onSiguiente?: () => void;
}

export default function VisorDicomDetallado({
  radiologia,
  isOpen,
  onClose,
  onAnterior,
  onSiguiente,
}: VisorDicomDetalladoProps) {
  const [zoom, setZoom] = useState(1);
  const [rotacion, setRotacion] = useState(0);
  const [brillo, setBrillo] = useState(1);
  const [contraste, setContraste] = useState(1);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [estaArrastrando, setEstaArrastrando] = useState(false);
  const [puntoInicio, setPuntoInicio] = useState({ x: 0, y: 0 });
  const [pantallaCompleta, setPantallaCompleta] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const imagenRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isOpen) {
      // Resetear valores al cerrar
      setZoom(1);
      setRotacion(0);
      setBrillo(1);
      setContraste(1);
      setPosicion({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosicion({ x: 0, y: 0 });
  };

  const handleRotar = () => {
    setRotacion((prev) => (prev + 90) % 360);
  };

  const handleAumentarBrillo = () => {
    setBrillo((prev) => Math.min(prev + 0.1, 2));
  };

  const handleDisminuirBrillo = () => {
    setBrillo((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleAumentarContraste = () => {
    setContraste((prev) => Math.min(prev + 0.1, 2));
  };

  const handleDisminuirContraste = () => {
    setContraste((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setRotacion(0);
    setBrillo(1);
    setContraste(1);
    setPosicion({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setEstaArrastrando(true);
      setPuntoInicio({
        x: e.clientX - posicion.x,
        y: e.clientY - posicion.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (estaArrastrando && zoom > 1) {
      setPosicion({
        x: e.clientX - puntoInicio.x,
        y: e.clientY - puntoInicio.y,
      });
    }
  };

  const handleMouseUp = () => {
    setEstaArrastrando(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.max(0.5, Math.min(5, prev + delta)));
    }
  };

  const togglePantallaCompleta = () => {
    if (!pantallaCompleta) {
      if (contenedorRef.current?.requestFullscreen) {
        contenedorRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setPantallaCompleta(!pantallaCompleta);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setPantallaCompleta(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen) return null;

  const estiloImagen: React.CSSProperties = {
    transform: `translate(${posicion.x}px, ${posicion.y}px) rotate(${rotacion}deg) scale(${zoom})`,
    filter: `brightness(${brillo}) contrast(${contraste})`,
    transition: estaArrastrando ? 'none' : 'transform 0.1s ease-out',
    cursor: zoom > 1 ? (estaArrastrando ? 'grabbing' : 'grab') : 'default',
  };

  return (
    <div
      ref={contenedorRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Barra de herramientas superior */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">{radiologia.tipoRadiografia}</h3>
          <span className="text-sm text-gray-400">
            {new Date(radiologia.fechaToma).toLocaleDateString('es-ES')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Controles de zoom */}
          <div className="flex items-center gap-1 border-l border-gray-700 pl-4">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Alejar (Ctrl + Scroll)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="px-2 text-sm min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Acercar (Ctrl + Scroll)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Resetear zoom"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Controles de rotación */}
          <button
            onClick={handleRotar}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            title="Rotar 90°"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          {/* Controles de brillo */}
          <div className="flex items-center gap-1 border-l border-gray-700 pl-4">
            <button
              onClick={handleDisminuirBrillo}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Disminuir brillo"
            >
              <Moon className="w-5 h-5" />
            </button>
            <span className="px-2 text-sm min-w-[50px] text-center">{Math.round(brillo * 100)}%</span>
            <button
              onClick={handleAumentarBrillo}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Aumentar brillo"
            >
              <Sun className="w-5 h-5" />
            </button>
          </div>

          {/* Controles de contraste */}
          <div className="flex items-center gap-1 border-l border-gray-700 pl-4">
            <button
              onClick={handleDisminuirContraste}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Disminuir contraste"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="px-2 text-sm min-w-[50px] text-center">{Math.round(contraste * 100)}%</span>
            <button
              onClick={handleAumentarContraste}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Aumentar contraste"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-800 rounded transition-colors border-l border-gray-700 pl-4"
            title="Resetear todas las herramientas"
          >
            Reset
          </button>

          {/* Pantalla completa */}
          <button
            onClick={togglePantallaCompleta}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            title="Pantalla completa"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-600 rounded transition-colors"
            title="Cerrar visor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Área de navegación (si hay anterior/siguiente) */}
      {(onAnterior || onSiguiente) && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
          {onAnterior && (
            <button
              onClick={onAnterior}
              className="bg-gray-900 bg-opacity-75 text-white p-3 rounded-lg hover:bg-opacity-100 transition-all"
              title="Anterior"
            >
              ←
            </button>
          )}
          {onSiguiente && (
            <button
              onClick={onSiguiente}
              className="bg-gray-900 bg-opacity-75 text-white p-3 rounded-lg hover:bg-opacity-100 transition-all"
              title="Siguiente"
            >
              →
            </button>
          )}
        </div>
      )}

      {/* Contenedor de imagen */}
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-900">
        <div
          className="relative"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <img
            ref={imagenRef}
            src={radiologia.urlArchivo}
            alt={radiologia.tipoRadiografia}
            style={estiloImagen}
            onMouseDown={handleMouseDown}
            className="max-w-full max-h-full select-none"
            draggable={false}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Mostrar mensaje de error
              const errorDiv = document.createElement('div');
              errorDiv.className = 'text-white text-center p-8';
              errorDiv.textContent = 'Error al cargar la imagen';
              target.parentElement?.appendChild(errorDiv);
            }}
          />
        </div>
      </div>

      {/* Información en la parte inferior */}
      <div className="bg-gray-900 text-white px-4 py-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Archivo: {radiologia.nombreArchivoOriginal}</span>
            <span>Tamaño: {(radiologia.tamañoArchivo / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
          {radiologia.notas && (
            <div className="text-gray-400 italic">Notas: {radiologia.notas}</div>
          )}
        </div>
      </div>
    </div>
  );
}


