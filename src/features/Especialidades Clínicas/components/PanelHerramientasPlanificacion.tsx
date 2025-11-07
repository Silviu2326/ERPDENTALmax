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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Herramientas</h3>
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
        <div className="p-4 space-y-4">
          {/* Herramientas de selección */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Herramientas de Planificación</h4>
            <div className="grid grid-cols-1 gap-2">
              {herramientas.map((herramienta) => {
                const Icono = herramienta.icono;
                const activa = herramientaActiva === herramienta.id;
                return (
                  <button
                    key={herramienta.id}
                    onClick={() => onHerramientaSeleccionada(activa ? null : herramienta.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      activa
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <Icono className="w-5 h-5" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">{herramienta.nombre}</p>
                      <p className="text-xs text-slate-500">{herramienta.descripcion}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gestión de capas */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Visibilidad de Capas</h4>
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
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${
                      visible
                        ? 'bg-green-50 border-green-300'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {visible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-sm font-medium text-slate-700">{capa.nombre}</span>
                    </div>
                    {capa.contador !== null && (
                      <span className="text-xs text-slate-600 bg-slate-200 px-2 py-1 rounded-full">
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4" />
              Guardar Planificación
            </button>
            <button
              onClick={onReset}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-gray-200 hover:bg-gray-300 text-gray-700"
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



