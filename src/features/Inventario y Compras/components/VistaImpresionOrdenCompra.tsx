import { Printer } from 'lucide-react';
import { OrdenCompra } from '../api/ordenesCompraApi';
import BadgeEstadoOrdenCompra from './BadgeEstadoOrdenCompra';

interface VistaImpresionOrdenCompraProps {
  orden: OrdenCompra;
  onImprimir?: () => void;
}

export default function VistaImpresionOrdenCompra({
  orden,
  onImprimir,
}: VistaImpresionOrdenCompraProps) {
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

  const obtenerNombreProveedor = (proveedor: string | { nombreComercial?: string; razonSocial?: string }) => {
    if (typeof proveedor === 'string') {
      return proveedor;
    }
    return proveedor.nombreComercial || proveedor.razonSocial || 'N/A';
  };

  const obtenerDatosProveedor = (proveedor: string | any) => {
    if (typeof proveedor === 'string') {
      return null;
    }
    return proveedor;
  };

  const obtenerNombreSucursal = (sucursal: string | { nombre?: string }) => {
    if (typeof sucursal === 'string') {
      return sucursal;
    }
    return sucursal.nombre || 'N/A';
  };

  const datosProveedor = obtenerDatosProveedor(orden.proveedor);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 print:p-4 print:shadow-none">
      {/* Botón de impresión (oculto al imprimir) */}
      {onImprimir && (
        <div className="mb-6 print:hidden flex justify-end">
          <button
            onClick={onImprimir}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700"
          >
            <Printer size={20} />
            Imprimir
          </button>
        </div>
      )}

      {/* Encabezado */}
      <div className="border-b-2 border-gray-300 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ORDEN DE COMPRA</h1>
            <p className="text-gray-600">Número: <span className="font-semibold">{orden.numeroOrden}</span></p>
          </div>
          <div className="text-right">
            <BadgeEstadoOrdenCompra estado={orden.estado} />
            <p className="text-sm text-gray-600 mt-2">
              Fecha: {formatearFecha(orden.fechaCreacion)}
            </p>
          </div>
        </div>
      </div>

      {/* Información de la clínica y proveedor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">DATOS DEL PROVEEDOR</h2>
          <div className="space-y-1 text-sm">
            <p className="font-medium text-gray-900">{obtenerNombreProveedor(orden.proveedor)}</p>
            {datosProveedor?.razonSocial && (
              <p className="text-gray-600">{datosProveedor.razonSocial}</p>
            )}
            {datosProveedor?.nif && (
              <p className="text-gray-600">NIF: {datosProveedor.nif}</p>
            )}
            {datosProveedor?.direccion && (
              <div className="text-gray-600 mt-2">
                <p>{datosProveedor.direccion.calle}</p>
                <p>
                  {datosProveedor.direccion.codigoPostal} {datosProveedor.direccion.ciudad}
                </p>
              </div>
            )}
            {datosProveedor?.contacto && (
              <div className="text-gray-600 mt-2">
                <p>Contacto: {datosProveedor.contacto.nombre}</p>
                <p>Tel: {datosProveedor.contacto.telefono}</p>
                <p>Email: {datosProveedor.contacto.email}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">DATOS DE ENTREGA</h2>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Sucursal:</span> {obtenerNombreSucursal(orden.sucursal)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Fecha Estimada de Entrega:</span>{' '}
              {formatearFecha(orden.fechaEntregaEstimada)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de items */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">PRODUCTOS SOLICITADOS</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-r">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-r">
                  Descripción
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase border-r">
                  Precio Unit.
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orden.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap border-r">{item.cantidad}</td>
                  <td className="px-4 py-3 border-r">{item.descripcion}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap border-r">
                    {formatearMoneda(item.precioUnitario)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatearMoneda(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totales */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatearMoneda(orden.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">IVA (21%):</span>
            <span className="font-medium">{formatearMoneda(orden.impuestos)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
            <span>TOTAL:</span>
            <span>{formatearMoneda(orden.total)}</span>
          </div>
        </div>
      </div>

      {/* Notas */}
      {orden.notas && (
        <div className="border-t pt-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">OBSERVACIONES</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{orden.notas}</p>
        </div>
      )}

      {/* Pie de página */}
      <div className="border-t pt-6 text-center text-xs text-gray-500">
        <p>Este documento es una orden de compra generada por el sistema ERP Dental.</p>
        <p className="mt-1">Fecha de emisión: {formatearFecha(orden.fechaCreacion)}</p>
      </div>
    </div>
  );
}



