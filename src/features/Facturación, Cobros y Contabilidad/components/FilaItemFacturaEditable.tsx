import { ItemFacturaEditable } from '../api/facturacionApi';
import { Trash2 } from 'lucide-react';

interface FilaItemFacturaEditableProps {
  item: ItemFacturaEditable;
  index: number;
  onUpdate: (index: number, campo: keyof ItemFacturaEditable, valor: any) => void;
  onDelete: (index: number) => void;
  readonly?: boolean;
}

export default function FilaItemFacturaEditable({
  item,
  index,
  onUpdate,
  onDelete,
  readonly = false,
}: FilaItemFacturaEditableProps) {
  const calcularTotalItem = () => {
    const subtotal = item.cantidad * item.precioUnitario;
    const descuento = (subtotal * item.descuento) / 100;
    const subtotalConDescuento = subtotal - descuento;
    const impuesto = (subtotalConDescuento * item.impuesto) / 100;
    return subtotalConDescuento + impuesto;
  };

  const handleFieldChange = (campo: keyof ItemFacturaEditable, valor: any) => {
    onUpdate(index, campo, valor);
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        {item.tratamiento ? (
          <div>
            <p className="text-sm font-medium text-gray-900">{item.tratamiento.nombre}</p>
            <p className="text-xs text-gray-500">{item.descripcion}</p>
          </div>
        ) : (
          <input
            type="text"
            value={item.descripcion}
            onChange={(e) => handleFieldChange('descripcion', e.target.value)}
            disabled={readonly}
            className="w-full text-sm rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 disabled:bg-slate-100 disabled:text-slate-500"
            placeholder="Descripción del ítem"
          />
        )}
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min="0"
          step="0.01"
          value={item.cantidad}
          onChange={(e) => handleFieldChange('cantidad', parseFloat(e.target.value) || 0)}
          disabled={readonly}
          className="w-20 text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-2 text-center disabled:bg-slate-100 disabled:text-slate-500"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min="0"
          step="0.01"
          value={item.precioUnitario}
          onChange={(e) => handleFieldChange('precioUnitario', parseFloat(e.target.value) || 0)}
          disabled={readonly}
          className="w-24 text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-2 text-right disabled:bg-slate-100 disabled:text-slate-500"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-1">
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={item.descuento}
            onChange={(e) => handleFieldChange('descuento', parseFloat(e.target.value) || 0)}
            disabled={readonly}
            className="w-20 text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-2 text-right disabled:bg-slate-100 disabled:text-slate-500"
          />
          <span className="text-sm text-slate-600">%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-1">
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={item.impuesto}
            onChange={(e) => handleFieldChange('impuesto', parseFloat(e.target.value) || 0)}
            disabled={readonly}
            className="w-20 text-sm rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-2 text-right disabled:bg-slate-100 disabled:text-slate-500"
          />
          <span className="text-sm text-slate-600">%</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-semibold text-gray-900">
          {calcularTotalItem().toFixed(2)} €
        </span>
      </td>
      {!readonly && (
        <td className="px-4 py-3">
          <button
            onClick={() => onDelete(index)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            title="Eliminar ítem"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      )}
    </tr>
  );
}



