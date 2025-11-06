import { useState } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { LineaPedidoCompra, Producto } from '../api/recepcionApi';

interface LineaRecepcionEditada {
  productoId: string;
  cantidadRecibida: number;
  lote?: string;
  fechaCaducidad?: string;
}

interface TablaLineasPedidoRecepcionProps {
  lineas: LineaPedidoCompra[];
  lineasRecepcion: LineaRecepcionEditada[];
  onLineasChange: (lineas: LineaRecepcionEditada[]) => void;
}

export default function TablaLineasPedidoRecepcion({
  lineas,
  lineasRecepcion,
  onLineasChange,
}: TablaLineasPedidoRecepcionProps) {
  const getProductoNombre = (producto: string | Producto): string => {
    if (typeof producto === 'string') return producto;
    return producto?.nombre || 'N/A';
  };

  const getProductoSku = (producto: string | Producto): string => {
    if (typeof producto === 'string') return '';
    return producto?.sku || '';
  };

  const getProductoId = (producto: string | Producto): string => {
    if (typeof producto === 'string') return producto;
    return producto?._id || '';
  };

  const handleCantidadChange = (index: number, cantidad: number) => {
    const nuevasLineas = [...lineasRecepcion];
    const lineaOriginal = lineas[index];
    const cantidadPendiente = lineaOriginal.cantidadPendiente || lineaOriginal.cantidad;

    if (cantidad < 0) {
      cantidad = 0;
    }
    if (cantidad > cantidadPendiente) {
      cantidad = cantidadPendiente;
    }

    const lineaExistente = nuevasLineas.findIndex(
      (l) => l.productoId === getProductoId(lineaOriginal.producto)
    );

    if (lineaExistente >= 0) {
      nuevasLineas[lineaExistente].cantidadRecibida = cantidad;
    } else {
      nuevasLineas.push({
        productoId: getProductoId(lineaOriginal.producto),
        cantidadRecibida: cantidad,
      });
    }

    onLineasChange(nuevasLineas);
  };

  const handleLoteChange = (index: number, lote: string) => {
    const nuevasLineas = [...lineasRecepcion];
    const lineaOriginal = lineas[index];
    const productoId = getProductoId(lineaOriginal.producto);

    const lineaExistente = nuevasLineas.findIndex((l) => l.productoId === productoId);

    if (lineaExistente >= 0) {
      nuevasLineas[lineaExistente].lote = lote;
    } else {
      nuevasLineas.push({
        productoId,
        cantidadRecibida: 0,
        lote,
      });
    }

    onLineasChange(nuevasLineas);
  };

  const handleFechaCaducidadChange = (index: number, fechaCaducidad: string) => {
    const nuevasLineas = [...lineasRecepcion];
    const lineaOriginal = lineas[index];
    const productoId = getProductoId(lineaOriginal.producto);

    const lineaExistente = nuevasLineas.findIndex((l) => l.productoId === productoId);

    if (lineaExistente >= 0) {
      nuevasLineas[lineaExistente].fechaCaducidad = fechaCaducidad;
    } else {
      nuevasLineas.push({
        productoId,
        cantidadRecibida: 0,
        fechaCaducidad,
      });
    }

    onLineasChange(nuevasLineas);
  };

  const getCantidadRecibida = (linea: LineaPedidoCompra): number => {
    const productoId = getProductoId(linea.producto);
    const lineaRecepcion = lineasRecepcion.find((l) => l.productoId === productoId);
    return lineaRecepcion?.cantidadRecibida || 0;
  };

  const getLote = (linea: LineaPedidoCompra): string => {
    const productoId = getProductoId(linea.producto);
    const lineaRecepcion = lineasRecepcion.find((l) => l.productoId === productoId);
    return lineaRecepcion?.lote || '';
  };

  const getFechaCaducidad = (linea: LineaPedidoCompra): string => {
    const productoId = getProductoId(linea.producto);
    const lineaRecepcion = lineasRecepcion.find((l) => l.productoId === productoId);
    return lineaRecepcion?.fechaCaducidad || '';
  };

  if (lineas.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay líneas de pedido para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad Pedida
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pendiente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad Recibida
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lote
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Caducidad
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lineas.map((linea, index) => {
            const cantidadRecibida = getCantidadRecibida(linea);
            const cantidadPendiente = linea.cantidadPendiente || linea.cantidad;
            const tieneExceso = cantidadRecibida > cantidadPendiente;

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {getProductoNombre(linea.producto)}
                    </div>
                    {getProductoSku(linea.producto) && (
                      <div className="text-sm text-gray-500">SKU: {getProductoSku(linea.producto)}</div>
                    )}
                    {linea.descripcion && (
                      <div className="text-xs text-gray-400">{linea.descripcion}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {linea.cantidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {cantidadPendiente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={cantidadPendiente}
                      value={cantidadRecibida}
                      onChange={(e) =>
                        handleCantidadChange(index, parseInt(e.target.value) || 0)
                      }
                      className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        tieneExceso ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {tieneExceso && (
                      <AlertCircle className="w-4 h-4 text-red-500" title="Excede la cantidad pendiente" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={getLote(linea)}
                    onChange={(e) => handleLoteChange(index, e.target.value)}
                    placeholder="Número de lote"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="date"
                    value={getFechaCaducidad(linea)}
                    onChange={(e) => handleFechaCaducidadChange(index, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


