import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Package, Edit, AlertCircle, Loader2 } from 'lucide-react';
import {
  obtenerDetalleProducto,
  obtenerHistorialMovimientos,
  ProductoInventario,
  MovimientoInventario,
} from '../api/stockApi';
import HistorialMovimientosProducto from '../components/HistorialMovimientosProducto';
import MetricCards from '../components/MetricCards';

interface DetalleProductoStockPageProps {
  productoId: string;
  onVolver: () => void;
}

export default function DetalleProductoStockPage({
  productoId,
  onVolver,
}: DetalleProductoStockPageProps) {
  const [producto, setProducto] = useState<ProductoInventario | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMovimientos, setLoadingMovimientos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDetalle();
  }, [productoId]);

  const cargarDetalle = async () => {
    setLoading(true);
    setError(null);
    try {
      // Datos falsos completos - NO usar API
      const productoData: ProductoInventario = {
        _id: productoId,
        nombre: 'Resina Composite A2',
        sku: 'COMP-A2-001',
        descripcion: 'Resina composite de alta calidad para restauraciones estéticas clase II. Ideal para restauraciones anteriores y posteriores.',
        categoria: 'Materiales de Restauración',
        proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
        unidadMedida: 'unidades',
        cantidadActual: 45,
        puntoReorden: 20,
        costoUnitario: 12.50,
        fechaCaducidad: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        ubicacion: 'Almacén A - Estantería 3',
        sede: { _id: '1', nombre: 'Sede Central' },
        activo: true,
      };

      const movimientosData: MovimientoInventario[] = [
        {
          _id: '1',
          producto: productoId,
          tipoMovimiento: 'compra',
          cantidad: 50,
          stock_anterior: 0,
          stock_nuevo: 50,
          usuario: { _id: '1', nombre: 'María López' },
          fecha: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          motivo: 'Compra inicial',
          referencia: 'OC-2024-001',
        },
        {
          _id: '2',
          producto: productoId,
          tipoMovimiento: 'uso_clinico',
          cantidad: -3,
          stock_anterior: 50,
          stock_nuevo: 47,
          usuario: { _id: '2', nombre: 'Dr. Carlos Ruiz' },
          fecha: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
          motivo: 'Uso en tratamiento TRAT-002',
          referencia: 'CITA-2024-045',
        },
        {
          _id: '3',
          producto: productoId,
          tipoMovimiento: 'uso_clinico',
          cantidad: -2,
          stock_anterior: 47,
          stock_nuevo: 45,
          usuario: { _id: '2', nombre: 'Dr. Carlos Ruiz' },
          fecha: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          motivo: 'Uso en tratamiento TRAT-002',
          referencia: 'CITA-2024-052',
        },
        {
          _id: '4',
          producto: productoId,
          tipoMovimiento: 'ajuste',
          cantidad: 2,
          stock_anterior: 45,
          stock_nuevo: 47,
          usuario: { _id: '1', nombre: 'María López' },
          fecha: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
          motivo: 'Ajuste de inventario - corrección de conteo',
          referencia: 'AJUSTE-2024-012',
        },
        {
          _id: '5',
          producto: productoId,
          tipoMovimiento: 'uso_clinico',
          cantidad: -1,
          stock_anterior: 47,
          stock_nuevo: 46,
          usuario: { _id: '3', nombre: 'Dr. Ana Martínez' },
          fecha: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          motivo: 'Uso en tratamiento TRAT-005',
          referencia: 'CITA-2024-068',
        },
        {
          _id: '6',
          producto: productoId,
          tipoMovimiento: 'uso_clinico',
          cantidad: -1,
          stock_anterior: 46,
          stock_nuevo: 45,
          usuario: { _id: '2', nombre: 'Dr. Carlos Ruiz' },
          fecha: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          motivo: 'Uso en tratamiento TRAT-003',
          referencia: 'CITA-2024-071',
        },
        {
          _id: '7',
          producto: productoId,
          tipoMovimiento: 'compra',
          cantidad: 10,
          stock_anterior: 45,
          stock_nuevo: 55,
          usuario: { _id: '1', nombre: 'María López' },
          fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          motivo: 'Reabastecimiento',
          referencia: 'OC-2024-015',
        },
        {
          _id: '8',
          producto: productoId,
          tipoMovimiento: 'uso_clinico',
          cantidad: -5,
          stock_anterior: 55,
          stock_nuevo: 50,
          usuario: { _id: '3', nombre: 'Dr. Ana Martínez' },
          fecha: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          motivo: 'Uso en tratamiento TRAT-008',
          referencia: 'CITA-2024-082',
        },
        {
          _id: '9',
          producto: productoId,
          tipoMovimiento: 'uso_clinico',
          cantidad: -3,
          stock_anterior: 50,
          stock_nuevo: 47,
          usuario: { _id: '2', nombre: 'Dr. Carlos Ruiz' },
          fecha: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          motivo: 'Uso en tratamiento TRAT-001',
          referencia: 'CITA-2024-089',
        },
        {
          _id: '10',
          producto: productoId,
          tipoMovimiento: 'ajuste',
          cantidad: -2,
          stock_anterior: 47,
          stock_nuevo: 45,
          usuario: { _id: '1', nombre: 'María López' },
          fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          motivo: 'Ajuste de inventario - producto dañado',
          referencia: 'AJUSTE-2024-025',
        },
      ];

      setProducto(productoData);
      setMovimientos(movimientosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle del producto');
    } finally {
      setLoading(false);
      setLoadingMovimientos(false);
    }
  };

  const esBajoStock = producto ? producto.cantidadActual <= producto.puntoReorden : false;

  // Calcular estadísticas de movimientos
  const estadisticasMovimientos = useMemo(() => {
    if (!movimientos.length) return null;

    const compras = movimientos.filter(m => m.tipoMovimiento === 'compra');
    const usos = movimientos.filter(m => m.tipoMovimiento === 'uso_clinico');
    const ajustes = movimientos.filter(m => m.tipoMovimiento === 'ajuste');

    const totalCompras = compras.reduce((sum, m) => sum + Math.abs(m.cantidad), 0);
    const totalUsos = usos.reduce((sum, m) => sum + Math.abs(m.cantidad), 0);
    const totalAjustes = ajustes.reduce((sum, m) => sum + Math.abs(m.cantidad), 0);

    // Movimientos por mes (últimos 6 meses)
    const movimientosPorMes = movimientos.reduce((acc, mov) => {
      const fecha = new Date(mov.fecha);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[mes]) {
        acc[mes] = { compras: 0, usos: 0, ajustes: 0 };
      }
      if (mov.tipoMovimiento === 'compra') acc[mes].compras += Math.abs(mov.cantidad);
      if (mov.tipoMovimiento === 'uso_clinico') acc[mes].usos += Math.abs(mov.cantidad);
      if (mov.tipoMovimiento === 'ajuste') acc[mes].ajustes += Math.abs(mov.cantidad);
      return acc;
    }, {} as Record<string, { compras: number; usos: number; ajustes: number }>);

    // Tasa de rotación (usos / compras)
    const tasaRotacion = totalCompras > 0 ? (totalUsos / totalCompras) * 100 : 0;

    return {
      totalCompras,
      totalUsos,
      totalAjustes,
      movimientosPorMes,
      tasaRotacion,
      totalMovimientos: movimientos.length,
    };
  }, [movimientos]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm p-8 text-center rounded-xl">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando detalle del producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm p-8 text-center rounded-xl">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'Producto no encontrado'}</p>
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={20} />
              Volver al inventario
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Package size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {producto.nombre}
                  </h1>
                  <p className="text-gray-600">SKU: {producto.sku}</p>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm">
                <Edit size={20} />
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Información del Producto */}
          <div className="bg-white shadow-sm p-6 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Categoría</label>
                <p className="text-lg font-semibold text-gray-900">{producto.categoria}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Proveedor</label>
                <p className="text-lg font-semibold text-gray-900">
                  {typeof producto.proveedor === 'object' ? producto.proveedor.nombre : producto.proveedor}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sede</label>
                <p className="text-lg font-semibold text-gray-900">
                  {typeof producto.sede === 'object' ? producto.sede.nombre : producto.sede}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Unidad de Medida</label>
                <p className="text-lg font-semibold text-gray-900">{producto.unidadMedida}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ubicación</label>
                <p className="text-lg font-semibold text-gray-900">
                  {producto.ubicacion || 'No especificada'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    producto.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {producto.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {producto.descripcion && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                <p className="text-gray-900">{producto.descripcion}</p>
              </div>
            )}
          </div>

          {/* Información de Stock - Usando MetricCards */}
          <MetricCards
            data={[
              {
                id: 'stock-actual',
                title: 'Stock Actual',
                value: producto.cantidadActual,
                color: esBajoStock ? 'danger' : 'info',
              },
              {
                id: 'punto-reorden',
                title: 'Punto de Reorden',
                value: producto.puntoReorden,
                color: 'warning',
              },
              {
                id: 'costo-unitario',
                title: 'Costo Unitario',
                value: `$${producto.costoUnitario.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
                color: 'info',
              },
            ]}
          />

          {esBajoStock && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900">Alerta: Stock bajo mínimo</p>
                <p className="text-xs text-red-700 mt-1">
                  El stock actual ({producto.cantidadActual} {producto.unidadMedida}) está por debajo del punto de reorden ({producto.puntoReorden} {producto.unidadMedida})
                </p>
              </div>
            </div>
          )}

          {/* Estadísticas de movimientos */}
          {estadisticasMovimientos && (
            <MetricCards
              data={[
                {
                  id: 'total-compras',
                  title: 'Total Compras',
                  value: estadisticasMovimientos.totalCompras,
                  color: 'success',
                },
                {
                  id: 'total-usos',
                  title: 'Total Usos',
                  value: estadisticasMovimientos.totalUsos,
                  color: 'danger',
                },
                {
                  id: 'ajustes',
                  title: 'Ajustes',
                  value: estadisticasMovimientos.totalAjustes,
                  color: 'warning',
                },
                {
                  id: 'tasa-rotacion',
                  title: 'Tasa Rotación',
                  value: `${estadisticasMovimientos.tasaRotacion.toFixed(1)}%`,
                  color: 'info',
                },
              ]}
            />
          )}

          {producto.fechaCaducidad && (
            <div className="bg-white shadow-sm p-6 rounded-xl">
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Caducidad</label>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(producto.fechaCaducidad).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}

          {/* Historial de Movimientos */}
          <HistorialMovimientosProducto
            movimientos={movimientos}
            loading={loadingMovimientos}
          />
        </div>
      </div>
    </div>
  );
}


