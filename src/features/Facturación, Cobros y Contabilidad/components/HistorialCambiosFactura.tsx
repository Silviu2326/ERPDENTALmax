import { HistorialCambio } from '../api/facturacionApi';
import { History, User, Clock } from 'lucide-react';

interface HistorialCambiosFacturaProps {
  historial: HistorialCambio[];
}

export default function HistorialCambiosFactura({ historial }: HistorialCambiosFacturaProps) {
  if (!historial || historial.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <History className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Historial de Cambios</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>No hay cambios registrados en esta factura</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <History className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Historial de Cambios</h3>
      </div>
      <div className="space-y-4">
        {historial.map((cambio, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {cambio.usuario.nombre}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Campo:</span> {cambio.campo}
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Antes:</span>{' '}
                    <span className="line-through text-red-600">{cambio.valorAnterior}</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Ahora:</span>{' '}
                    <span className="text-green-600 font-semibold">{cambio.valorNuevo}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(cambio.fecha).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


