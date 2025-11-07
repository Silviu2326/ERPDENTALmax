import { Package, Calendar, AlertCircle } from 'lucide-react';
import { Equipo } from '../api/partesAveriaApi';

interface VisorDetallesEquipoAveriadoProps {
  equipo: Equipo;
}

export default function VisorDetallesEquipoAveriado({
  equipo,
}: VisorDetallesEquipoAveriadoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
          <Package size={24} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Equipo Afectado
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre
              </label>
              <p className="text-sm text-gray-900">{equipo.nombre}</p>
            </div>
            {equipo.marca && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Marca
                </label>
                <p className="text-sm text-gray-900">{equipo.marca}</p>
              </div>
            )}
            {equipo.modelo && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Modelo
                </label>
                <p className="text-sm text-gray-900">{equipo.modelo}</p>
              </div>
            )}
            {equipo.numeroSerie && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Número de Serie
                </label>
                <p className="text-sm text-gray-900 font-mono bg-slate-50 rounded-xl px-3 py-2 ring-1 ring-slate-200">{equipo.numeroSerie}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
          onClick={() => {
            // Aquí se podría navegar a la página de detalle del equipo
            // o abrir un modal con más información
          }}
        >
          <AlertCircle size={16} className="opacity-70" />
          Ver historial completo de mantenimiento
        </button>
      </div>
    </div>
  );
}



