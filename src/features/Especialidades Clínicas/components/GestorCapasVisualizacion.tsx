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
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Capas de Visualización</h3>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700"
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
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => onToggleVisibilidad(capa.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    {capa.visible ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <span className="font-medium text-gray-700">{capa.nombre}</span>
                </div>
                <button
                  onClick={() =>
                    setCapaEditando(capaEditando === capa.id ? null : capa.id)
                  }
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {capaEditando === capa.id && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                  {/* Control de opacidad */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
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
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        value={capa.color || '#3b82f6'}
                        onChange={(e) => onCambiarColor(capa.id, e.target.value)}
                        className="w-full h-8 rounded border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {capas.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No hay capas disponibles
            </div>
          )}
        </div>
      )}
    </div>
  );
}


