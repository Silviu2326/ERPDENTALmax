import { ItemPresupuesto } from '../api/presupuestosApi';

interface TratamientoRowProps {
  item: ItemPresupuesto;
  index: number;
}

export default function TratamientoRow({ item, index }: TratamientoRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-slate-50 transition-all">
      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
      <td className="px-4 py-3">
        <div>
          <div className="font-medium text-gray-900">{item.tratamiento.nombre}</div>
          {item.descripcion && (
            <div className="text-sm text-slate-600 mt-1">{item.descripcion}</div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-700 text-center">{item.cantidad}</td>
      <td className="px-4 py-3 text-sm text-slate-700 text-right">
        {item.precioUnitario.toFixed(2)} €
      </td>
      <td className="px-4 py-3 text-sm text-slate-700 text-right">
        {item.descuento > 0 ? (
          <span className="text-red-600 font-medium">-{item.descuento.toFixed(2)} €</span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
        {item.subtotal.toFixed(2)} €
      </td>
    </tr>
  );
}



