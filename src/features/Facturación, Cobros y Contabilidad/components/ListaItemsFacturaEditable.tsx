import { ItemFacturaEditable } from '../api/facturacionApi';
import FilaItemFacturaEditable from './FilaItemFacturaEditable';
import { Plus } from 'lucide-react';

interface ListaItemsFacturaEditableProps {
  items: ItemFacturaEditable[];
  onUpdate: (index: number, campo: keyof ItemFacturaEditable, valor: any) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
  readonly?: boolean;
}

export default function ListaItemsFacturaEditable({
  items,
  onUpdate,
  onDelete,
  onAdd,
  readonly = false,
}: ListaItemsFacturaEditableProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Ítems de la Factura</h3>
        {!readonly && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus size={20} />
            <span>Añadir Ítem</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm text-gray-600">No hay ítems en esta factura</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Precio Unit.
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Descuento %
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Impuesto %
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Total
                </th>
                {!readonly && (
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Acción
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <FilaItemFacturaEditable
                  key={item._id || index}
                  item={item}
                  index={index}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  readonly={readonly}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



