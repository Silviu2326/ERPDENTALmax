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
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información del paciente */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Paciente</h3>
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
          <h3 className="text-sm font-medium text-gray-500 mb-2">Factura</h3>
          <p className="text-lg font-semibold text-gray-900">
            Nº {factura.numeroFactura}
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-600">Fecha de Emisión:</label>
              {readonly ? (
                <span className="text-sm font-medium text-gray-900">
                  {new Date(factura.fechaEmision).toLocaleDateString('es-ES')}
                </span>
              ) : (
                <input
                  type="date"
                  value={factura.fechaEmision.split('T')[0]}
                  onChange={(e) => onFechaEmisionChange?.(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
            {factura.fechaVencimiento && (
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-600">Fecha de Vencimiento:</label>
                {readonly ? (
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(factura.fechaVencimiento).toLocaleDateString('es-ES')}
                  </span>
                ) : (
                  <input
                    type="date"
                    value={factura.fechaVencimiento.split('T')[0]}
                    onChange={(e) => onFechaVencimientoChange?.(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estado de la factura */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Estado:</span>
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


