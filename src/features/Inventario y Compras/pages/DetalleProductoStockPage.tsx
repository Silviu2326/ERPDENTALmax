import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Package, Edit, TrendingUp, TrendingDown, AlertCircle, BarChart3, DollarSign } from 'lucide-react';
import {
  obtenerDetalleProducto,
  obtenerHistorialMovimientos,
  ProductoInventario,
  MovimientoInventario,
} from '../api/stockApi';
import HistorialMovimientosProducto from '../components/HistorialMovimientosProducto';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando detalle del producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Producto no encontrado'}</p>
              <button
                onClick={onVolver}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inventario
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-4 rounded-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>
                <p className="text-gray-600 mt-1">SKU: {producto.sku}</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar
            </button>
          </div>
        </div>

        {/* Información del Producto */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Categoría</label>
              <p className="text-lg font-semibold text-gray-900">{producto.categoria}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Proveedor</label>
              <p className="text-lg font-semibold text-gray-900">
                {typeof producto.proveedor === 'object' ? producto.proveedor.nombre : producto.proveedor}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Sede</label>
              <p className="text-lg font-semibold text-gray-900">
                {typeof producto.sede === 'object' ? producto.sede.nombre : producto.sede}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Unidad de Medida</label>
              <p className="text-lg font-semibold text-gray-900">{producto.unidadMedida}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ubicación</label>
              <p className="text-lg font-semibold text-gray-900">
                {producto.ubicacion || 'No especificada'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Estado</label>
              <p>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    producto.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {producto.activo ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
          </div>

          {producto.descripcion && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-500">Descripción</label>
              <p className="text-gray-900 mt-2">{producto.descripcion}</p>
            </div>
          )}
        </div>

        {/* Información de Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <label className="text-sm font-medium text-gray-500">Stock Actual</label>
            <div className="flex items-center gap-3 mt-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <div>
                <p
                  className={`text-3xl font-bold ${
                    esBajoStock ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  {producto.cantidadActual}
                </p>
                <p className="text-sm text-gray-500">{producto.unidadMedida}</p>
                {esBajoStock && (
                  <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Bajo stock mínimo
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <label className="text-sm font-medium text-gray-500">Punto de Reorden</label>
            <div className="flex items-center gap-3 mt-2">
              <Package className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-3xl font-bold text-gray-900">{producto.puntoReorden}</p>
                <p className="text-sm text-gray-500">{producto.unidadMedida}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Diferencia: {producto.cantidadActual - producto.puntoReorden > 0 ? '+' : ''}
                  {producto.cantidadActual - producto.puntoReorden} unidades
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <label className="text-sm font-medium text-gray-500">Costo Unitario</label>
            <div className="flex items-center gap-3 mt-2">
              <DollarSign className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  ${producto.costoUnitario.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500">Valor total: $
                  {(producto.cantidadActual * producto.costoUnitario).toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas de movimientos */}
        {estadisticasMovimientos && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Compras</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {estadisticasMovimientos.totalCompras}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Unidades adquiridas</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usos</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">
                    {estadisticasMovimientos.totalUsos}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Unidades consumidas</p>
                </div>
                <TrendingDown className="w-10 h-10 text-red-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ajustes</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">
                    {estadisticasMovimientos.totalAjustes}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Correcciones</p>
                </div>
                <BarChart3 className="w-10 h-10 text-yellow-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasa Rotación</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {estadisticasMovimientos.tasaRotacion.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Uso vs compra</p>
                </div>
                <Package className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </div>
          </div>
        )}

        {producto.fechaCaducidad && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <label className="text-sm font-medium text-gray-500">Fecha de Caducidad</label>
            <p className="text-lg font-semibold text-gray-900 mt-2">
              {new Date(producto.fechaCaducidad).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Historial de Movimientos */}
        <div className="mb-6">
          <HistorialMovimientosProducto
            movimientos={movimientos}
            loading={loadingMovimientos}
          />
        </div>
      </div>
    </div>
  );
}


