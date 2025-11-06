import { Eye, Edit, Trash2, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { FacturaLaboratorio } from '../api/facturacionLaboratorioApi';

interface TablaFacturasLaboratorioProps {
  facturas: FacturaLaboratorio[];
  loading?: boolean;
  onVerDetalle: (facturaId: string) => void;
  onEditar?: (facturaId: string) => void;
  onEliminar?: (facturaId: string) => void;
}

const getEstadoColor = (estado: string): string => {
  const colores: Record<string, string> = {
    'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Pagada': 'bg-green-100 text-green-800 border-green-300',
    'Vencida': 'bg-red-100 text-red-800 border-red-300',
    'Cancelada': 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
};

const getEstadoIcon = (estado: string) => {
  switch (estado) {
    case 'Pagada':
      return <CheckCircle className="w-4 h-4" />;
    case 'Vencida':
      return <AlertCircle className="w-4 h-4" />;
    case 'Cancelada':
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export default function TablaFacturasLaboratorio({
  facturas,
  loading = false,
  onVerDetalle,
  onEditar,
  onEliminar,
}: TablaFacturasLaboratorioProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando facturas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (facturas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg">No se encontraron facturas</p>
          <p className="text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
        </div>
      </div>
    );
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Nº Factura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Laboratorio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fecha Emisión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fecha Vencimiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {facturas.map((factura) => (
              <tr key={factura._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {factura.numeroFactura}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{factura.laboratorio.nombre}</div>
                  {factura.laboratorio.cif && (
                    <div className="text-xs text-gray-500">CIF: {factura.laboratorio.cif}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatearFecha(factura.fechaEmision)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatearFecha(factura.fechaVencimiento)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEstadoColor(
                      factura.estado
                    )}`}
                  >
                    {getEstadoIcon(factura.estado)}
                    <span className="ml-1">{factura.estado}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatearMoneda(factura.total)}
                  </div>
                  {factura.items.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {factura.items.length} {factura.items.length === 1 ? 'ítem' : 'ítems'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onVerDetalle(factura._id!)}
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50 transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {onEditar && (
                      <button
                        onClick={() => onEditar(factura._id!)}
                        className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded hover:bg-indigo-50 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    {onEliminar && (
                      <button
                        onClick={() => onEliminar(factura._id!)}
                        className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


