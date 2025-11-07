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
    <div className="bg-white border-b border-gray-200/60 p-3 flex items-center gap-2 shadow-sm">
      {/* Controles de zoom */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          title="Alejar"
        >
          <ZoomOut size={20} className="text-slate-700" />
        </button>
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          title="Acercar"
        >
          <ZoomIn size={20} className="text-slate-700" />
        </button>
        <button
          onClick={onReset}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          title="Restablecer vista"
        >
          <Maximize size={20} className="text-slate-700" />
        </button>
      </div>

      {/* Controles de rotación */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
        <button
          onClick={onRotate}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          title="Rotar 90°"
        >
          <RotateCw size={20} className="text-slate-700" />
        </button>
      </div>

      {/* Controles de contraste */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
        <button
          onClick={() => onAjustarContraste(-10)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          title="Reducir contraste"
        >
          <Minus size={20} className="text-slate-700" />
        </button>
        <button
          onClick={() => onAjustarContraste(10)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          title="Aumentar contraste"
        >
          <Plus size={20} className="text-slate-700" />
        </button>
      </div>

      {/* Herramientas de anotación */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
        <button
          onClick={onHerramientaMedicion}
          className={`p-2 rounded-xl transition-all ${
            herramientaActiva === 'medicion'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Herramienta de medición"
        >
          <Ruler size={20} />
        </button>
        <button
          onClick={onHerramientaAnotacion}
          className={`p-2 rounded-xl transition-all ${
            herramientaActiva === 'anotacion'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Herramienta de dibujo"
        >
          <Pen size={20} />
        </button>
        <button
          onClick={onHerramientaTexto}
          className={`p-2 rounded-xl transition-all ${
            herramientaActiva === 'texto'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Añadir texto"
        >
          <Type size={20} />
        </button>
      </div>

      {/* Información */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={onVerMetadatos}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          title="Ver metadatos DICOM"
        >
          <Info size={20} className="text-slate-700" />
        </button>
      </div>
    </div>
  );
}



