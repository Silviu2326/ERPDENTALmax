import { useState } from 'react';
import { Ruler, MousePointer2, Eye, EyeOff, Layers, Save, RotateCcw } from 'lucide-react';
import { Medicion, TrazadoNervio } from '../api/planificacion3DApi';

interface PanelHerramientasPlanificacionProps {
  onHerramientaSeleccionada: (herramienta: 'medir' | 'trazar' | 'seleccionar' | null) => void;
  herramientaActiva: 'medir' | 'trazar' | 'seleccionar' | null;
  mediciones: Medicion[];
  trazadosNervios: TrazadoNervio[];
  onToggleCapa: (capa: 'hueso' | 'nervios' | 'implantes' | 'mediciones') => void;
  visibilidadCapas: {
    hueso: boolean;
    nervios: boolean;
    implantes: boolean;
    mediciones: boolean;
  };
  onGuardar: () => void;
  onReset: () => void;
}

export default function PanelHerramientasPlanificacion({
  onHerramientaSeleccionada,
  herramientaActiva,
  mediciones,
  trazadosNervios,
  onToggleCapa,
  visibilidadCapas,
  onGuardar,
  onReset,
}: PanelHerramientasPlanificacionProps) {
  const [expanded, setExpanded] = useState(true);

  const herramientas = [
    {
      id: 'seleccionar' as const,
      nombre: 'Seleccionar',
      icono: MousePointer2,
      descripcion: 'Seleccionar y mover elementos',
    },
    {
      id: 'medir' as const,
      nombre: 'Medir',
      icono: Ruler,
      descripcion: 'Realizar mediciones en el modelo 3D',
    },
    {
      id: 'trazar' as const,
      nombre: 'Trazar Nervio',
      icono: Layers,
      descripcion: 'Trazar el recorrido de nervios',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Herramientas</h3>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {expanded ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          {/* Herramientas de selección */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Herramientas de Planificación</h4>
            <div className="grid grid-cols-1 gap-2">
              {herramientas.map((herramienta) => {
                const Icono = herramienta.icono;
                const activa = herramientaActiva === herramienta.id;
                return (
                  <button
                    key={herramienta.id}
                    onClick={() => onHerramientaSeleccionada(activa ? null : herramienta.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      activa
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <Icono className="w-5 h-5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">{herramienta.nombre}</p>
                      <p className="text-xs text-gray-500">{herramienta.descripcion}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gestión de capas */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Visibilidad de Capas</h4>
            <div className="space-y-2">
              {[
                { id: 'hueso' as const, nombre: 'Hueso', contador: null },
                { id: 'nervios' as const, nombre: 'Nervios', contador: trazadosNervios.length },
                { id: 'implantes' as const, nombre: 'Implantes', contador: null },
                { id: 'mediciones' as const, nombre: 'Mediciones', contador: mediciones.length },
              ].map((capa) => {
                const visible = visibilidadCapas[capa.id];
                return (
                  <button
                    key={capa.id}
                    onClick={() => onToggleCapa(capa.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                      visible
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {visible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm font-medium text-gray-700">{capa.nombre}</span>
                    </div>
                    {capa.contador !== null && (
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        {capa.contador}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Acciones */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={onGuardar}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Planificación
            </button>
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Resetear Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


