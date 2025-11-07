import { ProductoInventario } from '../api/stockApi';
import MetricCards from './MetricCards';

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

  const metricData = [
    {
      id: 'total-productos',
      title: 'Total Productos',
      value: totalProductos,
      color: 'info' as const,
    },
    {
      id: 'bajo-stock',
      title: 'Bajo Stock',
      value: productosBajoStock,
      color: 'danger' as const,
    },
    {
      id: 'productos-activos',
      title: 'Productos Activos',
      value: productosActivos,
      color: 'success' as const,
    },
    {
      id: 'valor-total',
      title: 'Valor Total',
      value: `$${valorTotalInventario.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      color: 'info' as const,
    },
  ];

  return <MetricCards data={metricData} />;
}



