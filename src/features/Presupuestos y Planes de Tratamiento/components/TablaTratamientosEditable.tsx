import { Trash2 } from 'lucide-react';
import { ItemPresupuesto } from '../api/presupuestosApi';
import FilaTratamientoEditable from './FilaTratamientoEditable';

interface TablaTratamientosEditableProps {
  items: ItemPresupuesto[];
  onEliminarItem: (index: number) => void;
  onActualizarItem: (index: number, campo: keyof ItemPresupuesto, valor: any) => void;
}

export default function TablaTratamientosEditable({
  items,
  onEliminarItem,
  onActualizarItem,
}: TablaTratamientosEditableProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No hay tratamientos agregados al presupuesto</p>
        <p className="text-sm text-gray-400 mt-2">
          Haz clic en "Agregar Tratamiento" para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tratamiento
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pieza Dental
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Unitario
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descuento
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <FilaTratamientoEditable
                key={index}
                item={item}
                index={index}
                onActualizarItem={onActualizarItem}
                onEliminarItem={onEliminarItem}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


