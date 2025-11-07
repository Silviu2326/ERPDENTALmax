import { useState } from 'react';
import { Layers, Eye, EyeOff, Settings } from 'lucide-react';

interface CapaVisualizacion {
  id: string;
  nombre: string;
  visible: boolean;
  opacidad: number;
  color?: string;
}

interface GestorCapasVisualizacionProps {
  capas: CapaVisualizacion[];
  onToggleVisibilidad: (capaId: string) => void;
  onCambiarOpacidad: (capaId: string, opacidad: number) => void;
  onCambiarColor?: (capaId: string, color: string) => void;
}

export default function GestorCapasVisualizacion({
  capas,
  onToggleVisibilidad,
  onCambiarOpacidad,
  onCambiarColor,
}: GestorCapasVisualizacionProps) {
  const [expanded, setExpanded] = useState(true);
  const [capaEditando, setCapaEditando] = useState<string | null>(null);

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Capas de Visualización</h3>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={expanded ? 'Contraer' : 'Expandir'}
          >
            {expanded ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-2">
          {capas.map((capa) => (
            <div
              key={capa.id}
              className="border border-slate-200 rounded-xl p-3 hover:bg-slate-50 transition-colors bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => onToggleVisibilidad(capa.id)}
                    className="text-slate-600 hover:text-slate-800 transition-colors"
                    aria-label={capa.visible ? 'Ocultar capa' : 'Mostrar capa'}
                  >
                    {capa.visible ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  <span className="font-medium text-slate-700">{capa.nombre}</span>
                </div>
                <button
                  onClick={() =>
                    setCapaEditando(capaEditando === capa.id ? null : capa.id)
                  }
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                  aria-label="Configurar capa"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {capaEditando === capa.id && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
                  {/* Control de opacidad */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Opacidad: {Math.round(capa.opacidad * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={capa.opacidad}
                      onChange={(e) =>
                        onCambiarOpacidad(capa.id, parseFloat(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Selector de color (si aplica) */}
                  {onCambiarColor && (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        value={capa.color || '#3b82f6'}
                        onChange={(e) => onCambiarColor(capa.id, e.target.value)}
                        className="w-full h-8 rounded-xl border border-slate-300"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {capas.length === 0 && (
            <div className="p-8 text-center">
              <Layers size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay capas disponibles</h3>
              <p className="text-gray-600 text-sm">Las capas aparecerán cuando cargues una planificación</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



