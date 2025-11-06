import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { ProductoInventario } from '../api/stockApi';

interface CardResumenStockProps {
  productos: ProductoInventario[];
}

export default function CardResumenStock({ productos }: CardResumenStockProps) {
  const totalProductos = productos.length;
  const productosBajoStock = productos.filter(
    (p) => p.cantidadActual <= p.puntoReorden
  ).length;
  const valorTotalInventario = productos.reduce(
    (sum, p) => sum + p.cantidadActual * p.costoUnitario,
    0
  );
  const productosActivos = productos.filter((p) => p.activo).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Productos</p>
            <p className="text-2xl font-bold text-gray-900">{totalProductos}</p>
          </div>
          <Package className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Bajo Stock</p>
            <p className="text-2xl font-bold text-red-600">{productosBajoStock}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Productos Activos</p>
            <p className="text-2xl font-bold text-green-600">{productosActivos}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Valor Total</p>
            <p className="text-2xl font-bold text-purple-600">
              ${valorTotalInventario.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-purple-500" />
        </div>
      </div>
    </div>
  );
}


