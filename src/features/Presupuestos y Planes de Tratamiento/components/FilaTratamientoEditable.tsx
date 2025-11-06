import { Trash2 } from 'lucide-react';
import { ItemPresupuesto } from '../api/presupuestosApi';

interface FilaTratamientoEditableProps {
  item: ItemPresupuesto;
  index: number;
  onActualizarItem: (index: number, campo: keyof ItemPresupuesto, valor: any) => void;
  onEliminarItem: (index: number) => void;
}

export default function FilaTratamientoEditable({
  item,
  index,
  onActualizarItem,
  onEliminarItem,
}: FilaTratamientoEditableProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{item.descripcion}</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <input
          type="text"
          value={item.piezaDental || ''}
          onChange={(e) => onActualizarItem(index, 'piezaDental', e.target.value)}
          placeholder="Ej: 21, 32..."
          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <input
          type="number"
          min="1"
          value={item.cantidad}
          onChange={(e) => {
            const cantidad = parseInt(e.target.value) || 1;
            onActualizarItem(index, 'cantidad', cantidad);
          }}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <input
          type="number"
          min="0"
          step="0.01"
          value={item.precioUnitario.toFixed(2)}
          onChange={(e) => {
            const precio = parseFloat(e.target.value) || 0;
            onActualizarItem(index, 'precioUnitario', precio);
          }}
          className="w-28 px-2 py-1 text-sm border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-1">
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={item.descuento}
            onChange={(e) => {
              const descuento = parseFloat(e.target.value) || 0;
              onActualizarItem(index, 'descuento', descuento);
            }}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-500">%</span>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <div className="text-sm font-semibold text-gray-900">
          €{item.total.toFixed(2)}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <button
          onClick={() => onEliminarItem(index)}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Eliminar"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}


