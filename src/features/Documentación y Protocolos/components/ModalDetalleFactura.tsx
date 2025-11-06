import { X, Download, FileText, Calendar, DollarSign, Building2, User, CheckCircle } from 'lucide-react';
import { FacturaLaboratorio } from '../api/facturacionLaboratorioApi';

interface ModalDetalleFacturaProps {
  factura: FacturaLaboratorio | null;
  isOpen: boolean;
  onClose: () => void;
  onEditar?: () => void;
  onMarcarPagada?: () => void;
}

export default function ModalDetalleFactura({
  factura,
  isOpen,
  onClose,
  onEditar,
  onMarcarPagada,
}: ModalDetalleFacturaProps) {
  if (!isOpen || !factura) return null;

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  const getEstadoColor = (estado: string): string => {
    const colores: Record<string, string> = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Pagada': 'bg-green-100 text-green-800 border-green-300',
      'Vencida': 'bg-red-100 text-red-800 border-red-300',
      'Cancelada': 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Detalle de Factura</h2>
              <p className="text-sm text-blue-100">Nº {factura.numeroFactura}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Building2 className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Laboratorio</h3>
              </div>
              <p className="text-gray-900">{factura.laboratorio.nombre}</p>
              {factura.laboratorio.cif && (
                <p className="text-sm text-gray-600">CIF: {factura.laboratorio.cif}</p>
              )}
              {factura.laboratorio.direccion && (
                <p className="text-sm text-gray-600">{factura.laboratorio.direccion}</p>
              )}
              {factura.laboratorio.contacto && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Contacto: {factura.laboratorio.contacto.nombre}</p>
                  <p>{factura.laboratorio.contacto.email}</p>
                  <p>{factura.laboratorio.contacto.telefono}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Fechas</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Emisión</p>
                  <p className="text-gray-900">{formatearFecha(factura.fechaEmision)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Vencimiento</p>
                  <p className="text-gray-900">{formatearFecha(factura.fechaVencimiento)}</p>
                </div>
                {factura.fechaPago && (
                  <div>
                    <p className="text-xs text-gray-600">Fecha de Pago</p>
                    <p className="text-gray-900">{formatearFecha(factura.fechaPago)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(
                factura.estado
              )}`}
            >
              {factura.estado === 'Pagada' && <CheckCircle className="w-4 h-4 mr-1" />}
              {factura.estado}
            </span>
            {factura.metodoPago && (
              <span className="ml-2 text-sm text-gray-600">
                Método: {factura.metodoPago}
              </span>
            )}
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Ítems de la Factura</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Paciente / Tratamiento
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {factura.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.descripcion}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.trabajo.paciente && (
                          <div>
                            <User className="w-4 h-4 inline mr-1" />
                            {item.trabajo.paciente.nombre} {item.trabajo.paciente.apellidos}
                          </div>
                        )}
                        {item.trabajo.tratamiento && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.trabajo.tratamiento.nombre}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {item.cantidad}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatearMoneda(item.precioUnitario)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                        {formatearMoneda(item.precioUnitario * item.cantidad)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">{formatearMoneda(factura.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuestos:</span>
                  <span className="text-gray-900">{formatearMoneda(factura.impuestos)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-blue-600">{formatearMoneda(factura.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          {factura.notas && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Notas</h4>
              <p className="text-sm text-gray-700">{factura.notas}</p>
            </div>
          )}

          {/* Archivo */}
          {factura.archivoUrl && (
            <div className="mb-6">
              <a
                href={factura.archivoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <Download className="w-5 h-5" />
                <span>Descargar factura original</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-200">
          {onMarcarPagada && factura.estado !== 'Pagada' && (
            <button
              onClick={onMarcarPagada}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Marcar como Pagada</span>
            </button>
          )}
          {onEditar && (
            <button
              onClick={onEditar}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Editar
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


