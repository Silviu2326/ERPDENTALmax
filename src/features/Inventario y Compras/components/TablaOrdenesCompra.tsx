import { useState } from 'react';
import { Eye, Edit, Trash2, Send, Package } from 'lucide-react';
import { OrdenCompra } from '../api/ordenesCompraApi';
import BadgeEstadoOrdenCompra from './BadgeEstadoOrdenCompra';

interface TablaOrdenesCompraProps {
  ordenes: OrdenCompra[];
  loading?: boolean;
  onVerDetalle: (ordenId: string) => void;
  onEditar?: (ordenId: string) => void;
  onEliminar?: (ordenId: string) => void;
  onCambiarEstado?: (ordenId: string, nuevoEstado: OrdenCompra['estado']) => void;
}

export default function TablaOrdenesCompra({
  ordenes,
  loading = false,
  onVerDetalle,
  onEditar,
  onEliminar,
  onCambiarEstado,
}: TablaOrdenesCompraProps) {
  const [ordenHover, setOrdenHover] = useState<string | null>(null);

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

  const obtenerNombreProveedor = (proveedor: string | { nombreComercial?: string; nombre?: string }) => {
    if (typeof proveedor === 'string') {
      return proveedor;
    }
    return proveedor.nombreComercial || proveedor.nombre || 'N/A';
  };

  const obtenerNombreSucursal = (sucursal: string | { nombre?: string }) => {
    if (typeof sucursal === 'string') {
      return sucursal;
    }
    return sucursal.nombre || 'N/A';
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        Cargando órdenes de compra...
      </div>
    );
  }

  if (ordenes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No hay órdenes de compra registradas</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Número de Orden
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proveedor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sucursal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Creación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Entrega
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ordenes.map((orden) => (
            <tr
              key={orden._id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onMouseEnter={() => setOrdenHover(orden._id)}
              onMouseLeave={() => setOrdenHover(null)}
              onClick={() => onVerDetalle(orden._id || '')}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{orden.numeroOrden}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{obtenerNombreProveedor(orden.proveedor)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{obtenerNombreSucursal(orden.sucursal)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatearFecha(orden.fechaCreacion)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {formatearFecha(orden.fechaEntregaEstimada)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{orden.items.length} items</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">{formatearMoneda(orden.total)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BadgeEstadoOrdenCompra estado={orden.estado} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onVerDetalle(orden._id || '');
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    title="Ver detalle"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {orden.estado === 'Borrador' && onEditar && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditar(orden._id || '');
                      }}
                      className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {orden.estado === 'Borrador' && onEliminar && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('¿Está seguro de eliminar esta orden de compra?')) {
                          onEliminar(orden._id || '');
                        }
                      }}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {orden.estado === 'Borrador' && onCambiarEstado && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('¿Enviar esta orden de compra al proveedor?')) {
                          onCambiarEstado(orden._id || '', 'Enviada');
                        }
                      }}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="Enviar"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


