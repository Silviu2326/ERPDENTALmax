import { Factura } from '../api/facturacionApi';
import { Eye, FileText } from 'lucide-react';

interface FacturasRecientesTableProps {
  facturas: Factura[];
  loading?: boolean;
  onVerFactura?: (facturaId: string) => void;
}

export default function FacturasRecientesTable({
  facturas,
  loading = false,
  onVerFactura,
}: FacturasRecientesTableProps) {
  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'Pagada':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Vencida':
        return 'bg-red-100 text-red-800';
      case 'Anulada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (facturas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay facturas recientes</p>
          <p className="text-sm">Las facturas aparecerán aquí cuando se generen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-900">Facturas Recientes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Emisión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {facturas.map((factura) => (
              <tr key={factura._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{factura.numeroFactura}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {factura.paciente.nombre} {factura.paciente.apellidos}
                  </div>
                  {factura.paciente.documentoIdentidad && (
                    <div className="text-xs text-gray-500">
                      {factura.paciente.documentoIdentidad}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatearFecha(factura.fechaEmision)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatearMoneda(factura.total)}
                  </div>
                  {factura.totalPagado < factura.total && (
                    <div className="text-xs text-gray-500">
                      Pagado: {formatearMoneda(factura.totalPagado)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(
                      factura.estado
                    )}`}
                  >
                    {factura.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {onVerFactura && factura._id && (
                    <button
                      onClick={() => onVerFactura(factura._id!)}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


