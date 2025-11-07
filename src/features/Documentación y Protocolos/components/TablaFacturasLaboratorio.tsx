import { Eye, Edit, Trash2, CheckCircle, Clock, XCircle, AlertCircle, Loader2, FileText } from 'lucide-react';
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
    'Pendiente': 'bg-yellow-100 text-yellow-800 ring-yellow-300',
    'Pagada': 'bg-green-100 text-green-800 ring-green-300',
    'Vencida': 'bg-red-100 text-red-800 ring-red-300',
    'Cancelada': 'bg-gray-100 text-gray-800 ring-gray-300',
  };
  return colores[estado] || 'bg-gray-100 text-gray-800 ring-gray-300';
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
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando facturas...</p>
      </div>
    );
  }

  if (facturas.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron facturas</h3>
        <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Nº Factura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Laboratorio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Fecha Emisión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Fecha Vencimiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
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
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${getEstadoColor(
                      factura.estado
                    )}`}
                  >
                    {getEstadoIcon(factura.estado)}
                    <span>{factura.estado}</span>
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
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onVerDetalle(factura._id!)}
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded-xl hover:bg-blue-50 transition-all"
                      title="Ver detalle"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {onEditar && (
                      <button
                        onClick={() => onEditar(factura._id!)}
                        className="text-slate-600 hover:text-slate-900 p-1.5 rounded-xl hover:bg-slate-50 transition-all"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    {onEliminar && (
                      <button
                        onClick={() => onEliminar(factura._id!)}
                        className="text-red-600 hover:text-red-900 p-1.5 rounded-xl hover:bg-red-50 transition-all"
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



