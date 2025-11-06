import { Trash2 } from 'lucide-react';
import { ConsumoTratamiento } from '../api/tratamientoConsumosApi';

interface TablaItemsConsumoProps {
  items: ConsumoTratamiento[];
  onEliminarItem: (index: number) => void;
}

export default function TablaItemsConsumo({
  items,
  onEliminarItem,
}: TablaItemsConsumoProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No hay items de consumo agregados</p>
        <p className="text-sm text-gray-400 mt-1">Agrega productos usando el buscador arriba</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Unidad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-20">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={`${item.producto._id}-${index}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.producto.nombre}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-600 font-mono">{item.producto.sku || 'N/A'}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{item.producto.unidadMedida}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-semibold text-blue-600">{item.cantidad}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <button
                    onClick={() => onEliminarItem(index)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Eliminar item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


