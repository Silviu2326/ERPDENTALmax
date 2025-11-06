import { ZoomIn, ZoomOut, RotateCw, Maximize, Minus, Plus, Ruler, Pen, Type, Info } from 'lucide-react';

interface BarraHerramientasVisorProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onReset: () => void;
  onAjustarContraste: (incremento: number) => void;
  onHerramientaMedicion: () => void;
  onHerramientaAnotacion: () => void;
  onHerramientaTexto: () => void;
  onVerMetadatos: () => void;
  herramientaActiva?: 'zoom' | 'medicion' | 'anotacion' | 'texto' | null;
}

export default function BarraHerramientasVisor({
  onZoomIn,
  onZoomOut,
  onRotate,
  onReset,
  onAjustarContraste,
  onHerramientaMedicion,
  onHerramientaAnotacion,
  onHerramientaTexto,
  onVerMetadatos,
  herramientaActiva,
}: BarraHerramientasVisorProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-3 flex items-center gap-2 shadow-sm">
      {/* Controles de zoom */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Alejar"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Acercar"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Restablecer vista"
        >
          <Maximize className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Controles de rotación */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          onClick={onRotate}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Rotar 90°"
        >
          <RotateCw className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Controles de contraste */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          onClick={() => onAjustarContraste(-10)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reducir contraste"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => onAjustarContraste(10)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Aumentar contraste"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Herramientas de anotación */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button
          onClick={onHerramientaMedicion}
          className={`p-2 rounded-lg transition-colors ${
            herramientaActiva === 'medicion'
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Herramienta de medición"
        >
          <Ruler className="w-5 h-5" />
        </button>
        <button
          onClick={onHerramientaAnotacion}
          className={`p-2 rounded-lg transition-colors ${
            herramientaActiva === 'anotacion'
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Herramienta de dibujo"
        >
          <Pen className="w-5 h-5" />
        </button>
        <button
          onClick={onHerramientaTexto}
          className={`p-2 rounded-lg transition-colors ${
            herramientaActiva === 'texto'
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Añadir texto"
        >
          <Type className="w-5 h-5" />
        </button>
      </div>

      {/* Información */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={onVerMetadatos}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Ver metadatos DICOM"
        >
          <Info className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}


