import { Pen, Eraser, Move, ZoomIn, ZoomOut, RotateCcw, Download, Save } from 'lucide-react';

export type HerramientaAnotacion = 'lápiz' | 'borrador' | 'mover' | 'zoom' | null;

interface BarraHerramientasAnotacionProps {
  herramientaActiva: HerramientaAnotacion;
  colorSeleccionado: string;
  grosorSeleccionado: number;
  zoom: number;
  onHerramientaChange: (herramienta: HerramientaAnotacion) => void;
  onColorChange: (color: string) => void;
  onGrosorChange: (grosor: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onLimpiarAnotaciones: () => void;
  onDescargar?: () => void;
  onGuardar?: () => void;
  puedeGuardar?: boolean;
}

const coloresDisponibles = [
  { nombre: 'Rojo', valor: '#ef4444' },
  { nombre: 'Azul', valor: '#3b82f6' },
  { nombre: 'Verde', valor: '#10b981' },
  { nombre: 'Amarillo', valor: '#f59e0b' },
  { nombre: 'Negro', valor: '#000000' },
  { nombre: 'Blanco', valor: '#ffffff' },
];

export default function BarraHerramientasAnotacion({
  herramientaActiva,
  colorSeleccionado,
  grosorSeleccionado,
  zoom,
  onHerramientaChange,
  onColorChange,
  onGrosorChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onLimpiarAnotaciones,
  onDescargar,
  onGuardar,
  puedeGuardar = false,
}: BarraHerramientasAnotacionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Herramientas principales */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onHerramientaChange(herramientaActiva === 'lápiz' ? null : 'lápiz')}
            className={`p-2 rounded-lg transition-colors ${
              herramientaActiva === 'lápiz'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Lápiz"
          >
            <Pen className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onHerramientaChange(herramientaActiva === 'borrador' ? null : 'borrador')}
            className={`p-2 rounded-lg transition-colors ${
              herramientaActiva === 'borrador'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Borrador"
          >
            <Eraser className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onHerramientaChange(herramientaActiva === 'mover' ? null : 'mover')}
            className={`p-2 rounded-lg transition-colors ${
              herramientaActiva === 'mover'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Mover/Arrastrar"
          >
            <Move className="w-5 h-5" />
          </button>
        </div>

        {/* Controles de zoom */}
        <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
          <button
            onClick={onZoomOut}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Alejar"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <button
            onClick={onZoomIn}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Acercar"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          
          <button
            onClick={onResetZoom}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-xs px-3"
            title="Restablecer zoom"
          >
            Reset
          </button>
        </div>

        {/* Selector de color (solo si está en modo lápiz) */}
        {herramientaActiva === 'lápiz' && (
          <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
            <span className="text-sm text-gray-700 font-medium">Color:</span>
            <div className="flex gap-1">
              {coloresDisponibles.map((color) => (
                <button
                  key={color.valor}
                  onClick={() => onColorChange(color.valor)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    colorSeleccionado === color.valor
                      ? 'border-blue-600 scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.valor }}
                  title={color.nombre}
                />
              ))}
            </div>
          </div>
        )}

        {/* Control de grosor (solo si está en modo lápiz o borrador) */}
        {(herramientaActiva === 'lápiz' || herramientaActiva === 'borrador') && (
          <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
            <span className="text-sm text-gray-700 font-medium">Grosor:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={grosorSeleccionado}
              onChange={(e) => onGrosorChange(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-gray-600 min-w-[30px]">{grosorSeleccionado}px</span>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center gap-2 border-l border-gray-300 pl-4 ml-auto">
          <button
            onClick={onLimpiarAnotaciones}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Limpiar todas las anotaciones"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          {onDescargar && (
            <button
              onClick={onDescargar}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              title="Descargar imagen con anotaciones"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
          
          {onGuardar && puedeGuardar && (
            <button
              onClick={onGuardar}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
              title="Guardar anotaciones"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


