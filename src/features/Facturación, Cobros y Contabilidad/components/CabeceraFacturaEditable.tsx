import { FacturaDetallada } from '../api/facturacionApi';

interface CabeceraFacturaEditableProps {
  factura: FacturaDetallada;
  onFechaEmisionChange?: (fecha: string) => void;
  onFechaVencimientoChange?: (fecha: string) => void;
  readonly?: boolean;
}

export default function CabeceraFacturaEditable({
  factura,
  onFechaEmisionChange,
  onFechaVencimientoChange,
  readonly = false,
}: CabeceraFacturaEditableProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información del paciente */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Paciente</label>
          <p className="text-lg font-semibold text-gray-900">
            {factura.paciente.nombre} {factura.paciente.apellidos}
          </p>
          {factura.paciente.documentoIdentidad && (
            <p className="text-sm text-gray-600 mt-1">
              DNI/NIE: {factura.paciente.documentoIdentidad}
            </p>
          )}
        </div>

        {/* Información de la factura */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Factura</label>
          <p className="text-lg font-semibold text-gray-900">
            Nº {factura.numeroFactura}
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Emisión:
              </label>
              {readonly ? (
                <span className="text-sm font-medium text-gray-900">
                  {new Date(factura.fechaEmision).toLocaleDateString('es-ES')}
                </span>
              ) : (
                <input
                  type="date"
                  value={factura.fechaEmision.split('T')[0]}
                  onChange={(e) => onFechaEmisionChange?.(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                />
              )}
            </div>
            {factura.fechaVencimiento && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de Vencimiento:
                </label>
                {readonly ? (
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(factura.fechaVencimiento).toLocaleDateString('es-ES')}
                  </span>
                ) : (
                  <input
                    type="date"
                    value={factura.fechaVencimiento.split('T')[0]}
                    onChange={(e) => onFechaVencimientoChange?.(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estado de la factura */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-700">Estado:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              factura.estado === 'pagada'
                ? 'bg-green-100 text-green-800'
                : factura.estado === 'emitida'
                ? 'bg-blue-100 text-blue-800'
                : factura.estado === 'borrador'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}



