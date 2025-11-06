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
        <div className="bg-blue-100 p-3 rounded-lg">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Equipo Afectado
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700">Nombre:</span>
              <span className="ml-2 text-sm text-gray-900">{equipo.nombre}</span>
            </div>
            {equipo.marca && (
              <div>
                <span className="text-sm font-medium text-gray-700">Marca:</span>
                <span className="ml-2 text-sm text-gray-900">{equipo.marca}</span>
              </div>
            )}
            {equipo.modelo && (
              <div>
                <span className="text-sm font-medium text-gray-700">Modelo:</span>
                <span className="ml-2 text-sm text-gray-900">{equipo.modelo}</span>
              </div>
            )}
            {equipo.numeroSerie && (
              <div>
                <span className="text-sm font-medium text-gray-700">Número de Serie:</span>
                <span className="ml-2 text-sm text-gray-900 font-mono">{equipo.numeroSerie}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          onClick={() => {
            // Aquí se podría navegar a la página de detalle del equipo
            // o abrir un modal con más información
          }}
        >
          <AlertCircle className="w-4 h-4" />
          Ver historial completo de mantenimiento
        </button>
      </div>
    </div>
  );
}


