import { ItemPresupuesto } from '../api/presupuestosApi';

interface ResumenTotalesPresupuestoProps {
  items: ItemPresupuesto[];
  descuentoGeneral?: number;
  onDescuentoGeneralChange?: (descuento: number) => void;
}

export default function ResumenTotalesPresupuesto({
  items,
  descuentoGeneral = 0,
  onDescuentoGeneralChange,
}: ResumenTotalesPresupuestoProps) {
  // Calcular subtotal (suma de precio * cantidad sin descuentos)
  const subtotal = items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);

  // Calcular descuento por líneas (descuentos aplicados a cada item)
  const descuentoPorLineas = items.reduce((sum, item) => {
    const subtotalLinea = item.precioUnitario * item.cantidad;
    const descuentoLinea = (subtotalLinea * item.descuento) / 100;
    return sum + descuentoLinea;
  }, 0);

  // Calcular subtotal después de descuentos por línea
  const subtotalDespuesDescuentos = subtotal - descuentoPorLineas;

  // Calcular descuento general (se aplica sobre el subtotal después de descuentos por línea)
  const descuentoGeneralCalculado = (subtotalDespuesDescuentos * descuentoGeneral) / 100;
  const descuentoTotal = descuentoPorLineas + descuentoGeneralCalculado;

  // Calcular total final
  const total = subtotal - descuentoTotal;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Totales</h3>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal:</span>
          <span className="text-gray-900 font-medium">€{subtotal.toFixed(2)}</span>
        </div>

        {/* Descuento por líneas */}
        {descuentoPorLineas > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Descuento por líneas:</span>
            <span className="text-red-600">-€{descuentoPorLineas.toFixed(2)}</span>
          </div>
        )}

        {/* Descuento general */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Descuento general:</span>
            {onDescuentoGeneralChange && (
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={descuentoGeneral}
                onChange={(e) => {
                  const descuento = parseFloat(e.target.value) || 0;
                  onDescuentoGeneralChange(descuento);
                }}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
            {!onDescuentoGeneralChange && (
              <span className="text-gray-600">{descuentoGeneral.toFixed(2)}%</span>
            )}
            {onDescuentoGeneralChange && <span className="text-gray-500 text-sm">%</span>}
          </div>
          {descuentoGeneralCalculado > 0 && (
            <span className="text-red-600">-€{descuentoGeneralCalculado.toFixed(2)}</span>
          )}
        </div>

        {/* Descuento total */}
        {descuentoTotal > 0 && (
          <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
            <span className="text-gray-600 font-medium">Descuento total:</span>
            <span className="text-red-600 font-semibold">-€{descuentoTotal.toFixed(2)}</span>
          </div>
        )}

        {/* Total final */}
        <div className="flex justify-between items-center border-t-2 border-gray-300 pt-3 mt-4">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-blue-600">€{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

