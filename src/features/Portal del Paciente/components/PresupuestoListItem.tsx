import { ArrowRight, Calendar, Euro } from 'lucide-react';
import { PresupuestoResumen } from '../api/presupuestosApi';
import PresupuestoStatusBadge from './PresupuestoStatusBadge';

interface PresupuestoListItemProps {
  presupuesto: PresupuestoResumen;
  onVerDetalle: (id: string) => void;
}

export default function PresupuestoListItem({ presupuesto, onVerDetalle }: PresupuestoListItemProps) {
  const fechaCreacion = new Date(presupuesto.fechaCreacion);
  const fechaFormateada = fechaCreacion.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <PresupuestoStatusBadge estado={presupuesto.estado} />
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{fechaFormateada}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <Euro className="w-5 h-5 text-gray-700" />
            <span className="text-xl font-bold text-gray-900">
              {presupuesto.totalFinal.toFixed(2)}
            </span>
          </div>

          {presupuesto.fechaExpiracion && (
            <p className="text-xs text-gray-500">
              Válido hasta: {new Date(presupuesto.fechaExpiracion).toLocaleDateString('es-ES')}
            </p>
          )}
        </div>

        <button
          onClick={() => onVerDetalle(presupuesto._id)}
          className="ml-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <span>Ver Detalle</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


