import { Trash2, Minus, Plus } from 'lucide-react';
import { TratamientoSimulado } from '../hooks/useSimuladorState';

interface TratamientoSimuladoItemProps {
  tratamientoSimulado: TratamientoSimulado;
  onEliminar: (tratamientoId: string) => void;
  onActualizarCantidad: (tratamientoId: string, cantidad: number) => void;
}

export default function TratamientoSimuladoItem({
  tratamientoSimulado,
  onEliminar,
  onActualizarCantidad,
}: TratamientoSimuladoItemProps) {
  const { tratamiento, cantidad } = tratamientoSimulado;
  const subtotal = tratamiento.precio_base * cantidad;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">{tratamiento.nombre}</h4>
            <button
              onClick={() => onEliminar(tratamiento._id)}
              className="text-red-500 hover:text-red-700 transition-colors p-1"
              aria-label="Eliminar tratamiento"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {tratamiento.codigo && (
            <p className="text-sm text-gray-500 mb-1">Código: {tratamiento.codigo}</p>
          )}
          {tratamiento.descripcion && (
            <p className="text-sm text-gray-600 mb-2">{tratamiento.descripcion}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Cantidad:</span>
              <div className="flex items-center space-x-1 border border-gray-300 rounded">
                <button
                  onClick={() => onActualizarCantidad(tratamiento._id, cantidad - 1)}
                  className="p-1 hover:bg-gray-100 transition-colors"
                  aria-label="Reducir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                  {cantidad}
                </span>
                <button
                  onClick={() => onActualizarCantidad(tratamiento._id, cantidad + 1)}
                  className="p-1 hover:bg-gray-100 transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {tratamiento.precio_base.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                })}{' '}
                c/u
              </p>
              <p className="text-lg font-bold text-blue-600">
                {subtotal.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



