import { useState, useMemo } from 'react';
import { Package, ShoppingCart, AlertTriangle, Calendar, ClipboardList, Warehouse, BarChart3, TrendingUp, DollarSign, TrendingDown, Activity, Users, FileText } from 'lucide-react';
import ControlStockPage from './ControlStockPage';
import DetalleProductoStockPage from './DetalleProductoStockPage';
import ListadoMaterialesPage from './ListadoMaterialesPage';
import NuevoMaterialPage from './NuevoMaterialPage';
import OrdenesCompraPage from './OrdenesCompraPage';
import DetalleOrdenCompraPage from './DetalleOrdenCompraPage';
import AlertasReabastecimientoPage from './AlertasReabastecimientoPage';
import CaducidadesLotesPage from './CaducidadesLotesPage';
import TratamientoConsumosPage from './TratamientoConsumosPage';

interface InventarioYComprasPageProps {
  // Props opcionales para futuras funcionalidades del módulo
}

type VistaType = 'listado' | 'stock' | 'detalle' | 'nuevo-material' | 'ordenes-compra' | 'detalle-orden' | 'alertas-reabastecimiento' | 'caducidades-lotes' | 'consumos-tratamiento';

export default function InventarioYComprasPage({}: InventarioYComprasPageProps = {}) {
  const [vista, setVista] = useState<VistaType>('listado');
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState<string | null>(null);
  const [ordenSeleccionadaId, setOrdenSeleccionadaId] = useState<string | null>(null);

  const handleVerDetalle = (productoId: string) => {
    setProductoSeleccionadoId(productoId);
    setVista('detalle');
  };

  const handleVolver = () => {
    setVista('stock');
    setProductoSeleccionadoId(null);
  };

  const handleVolverAListado = () => {
    setVista('listado');
  };

  const handleMaterialCreado = () => {
    // Después de crear un material, volver al listado
    setVista('listado');
  };

  const handleVerDetalleOrden = (ordenId: string) => {
    setOrdenSeleccionadaId(ordenId);
    setVista('detalle-orden');
  };

  const handleVolverAOrdenes = () => {
    setVista('ordenes-compra');
    setOrdenSeleccionadaId(null);
  };

  // Estadísticas calculadas para el dashboard - Datos falsos completos
  const estadisticasDashboard = useMemo(() => {
    return {
      totalMateriales: 125,
      valorTotalInventario: 125430.75,
      alertasActivas: 28,
      alertasCriticas: 5,
      ordenesPendientes: 8,
      valorOrdenesPendientes: 18456.30,
      lotesPorCaducar: 15,
      lotesEstaSemana: 4,
      tratamientosConfigurados: 24,
      rotacionPromedio: 72.5,
      materialesBajoStock: 18,
      materialesAgotados: 3,
      proveedoresActivos: 6,
      ordenesEsteMes: 15,
      valorComprasEsteMes: 28456.80,
      movimientosHoy: 24,
      materialesNuevosEsteMes: 8,
      tasaUsoInventario: 68.3,
      valorPromedioMaterial: 1003.45,
      ordenesCompletadasEsteMes: 12,
      tiempoPromedioEntrega: 4.5,
      materialesPorCategoria: {
        'Consumibles': 45,
        'Materiales de Restauración': 28,
        'Anestésicos': 15,
        'Implantes': 12,
        'Instrumental': 18,
        'Equipamiento': 7,
      },
      topProveedores: [
        { nombre: 'Dental Supply S.A.', ordenes: 8, valor: 12450.00 },
        { nombre: 'Farmacéutica Dental', ordenes: 5, valor: 8560.30 },
        { nombre: 'Suministros Médicos', ordenes: 4, valor: 6230.50 },
      ],
    };
  }, []);

  // Vista de consumos por tratamiento
  if (vista === 'consumos-tratamiento') {
    return <TratamientoConsumosPage />;
  }

  // Vista de alertas de reabastecimiento
  if (vista === 'alertas-reabastecimiento') {
    return <AlertasReabastecimientoPage />;
  }

  // Vista de caducidades y lotes
  if (vista === 'caducidades-lotes') {
    return <CaducidadesLotesPage />;
  }

  // Vista de detalle de orden de compra
  if (vista === 'detalle-orden' && ordenSeleccionadaId) {
    return (
      <DetalleOrdenCompraPage
        ordenId={ordenSeleccionadaId}
        onVolver={handleVolverAOrdenes}
      />
    );
  }

  // Vista de órdenes de compra
  if (vista === 'ordenes-compra') {
    return (
      <OrdenesCompraPage
        onVerDetalle={handleVerDetalleOrden}
      />
    );
  }

  if (vista === 'detalle' && productoSeleccionadoId) {
    return (
      <DetalleProductoStockPage
        productoId={productoSeleccionadoId}
        onVolver={handleVolver}
      />
    );
  }

  if (vista === 'nuevo-material') {
    return (
      <NuevoMaterialPage
        onVolver={handleVolverAListado}
        onMaterialCreado={handleMaterialCreado}
      />
    );
  }

  if (vista === 'stock') {
    return <ControlStockPage onVerDetalle={handleVerDetalle} />;
  }

  // Vista por defecto: Dashboard con navegación mejorada
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header principal */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Warehouse className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventario y Compras</h1>
                <p className="text-gray-600 mt-1">Gestión integral de materiales, stock y compras</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setVista('listado')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Materiales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticasDashboard.totalMateriales}</p>
                <p className="text-xs text-gray-500 mt-1">Activos en inventario</p>
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  Valor: ${estadisticasDashboard.valorTotalInventario.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setVista('alertas-reabastecimiento')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{estadisticasDashboard.alertasActivas}</p>
                <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
                <p className="text-xs text-red-600 mt-1 font-medium">{estadisticasDashboard.alertasCriticas} críticas</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setVista('ordenes-compra')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Órdenes Pendientes</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{estadisticasDashboard.ordenesPendientes}</p>
                <p className="text-xs text-gray-500 mt-1">En proceso</p>
                <p className="text-xs text-green-600 mt-1 font-medium">
                  Valor: ${estadisticasDashboard.valorOrdenesPendientes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <ShoppingCart className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setVista('caducidades-lotes')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lotes por Caducar</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{estadisticasDashboard.lotesPorCaducar}</p>
                <p className="text-xs text-gray-500 mt-1">Próximos 30 días</p>
                <p className="text-xs text-yellow-600 mt-1 font-medium">{estadisticasDashboard.lotesEstaSemana} esta semana</p>
              </div>
              <Calendar className="w-12 h-12 text-red-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total Inventario</p>
                <p className="text-3xl font-bold text-indigo-900 mt-2">
                  ${estadisticasDashboard.valorTotalInventario.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Stock actual valorado</p>
                <p className="text-xs text-indigo-600 mt-1 font-medium">
                  Promedio: ${estadisticasDashboard.valorPromedioMaterial.toFixed(2)} por material
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-indigo-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tratamientos Configurados</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{estadisticasDashboard.tratamientosConfigurados}</p>
                <p className="text-xs text-gray-500 mt-1">Con consumos definidos</p>
                <p className="text-xs text-purple-600 mt-1 font-medium">
                  {estadisticasDashboard.materialesNuevosEsteMes} nuevos este mes
                </p>
              </div>
              <ClipboardList className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg shadow-md p-6 border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rotación Promedio</p>
                <p className="text-3xl font-bold text-teal-900 mt-2">{estadisticasDashboard.rotacionPromedio}%</p>
                <p className="text-xs text-gray-500 mt-1">Uso de inventario</p>
                <p className="text-xs text-teal-600 mt-1 font-medium">
                  Tasa de uso: {estadisticasDashboard.tasaUsoInventario}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-teal-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-md p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Materiales Bajo Stock</p>
                <p className="text-3xl font-bold text-amber-900 mt-2">{estadisticasDashboard.materialesBajoStock}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {estadisticasDashboard.materialesAgotados} agotados
                </p>
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {estadisticasDashboard.alertasCriticas} críticas
                </p>
              </div>
              <TrendingDown className="w-12 h-12 text-amber-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Estadísticas de actividad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Órdenes Este Mes</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticasDashboard.ordenesEsteMes}</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Valor total</p>
              <p className="text-lg font-semibold text-blue-600">
                ${estadisticasDashboard.valorComprasEsteMes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {estadisticasDashboard.ordenesCompletadasEsteMes} completadas
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Proveedores Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticasDashboard.proveedoresActivos}</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Con órdenes pendientes</p>
              <p className="text-lg font-semibold text-green-600">4 proveedores</p>
              <p className="text-xs text-gray-500 mt-1">
                Tiempo promedio entrega: {estadisticasDashboard.tiempoPromedioEntrega} días
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Actividad Reciente</p>
                  <p className="text-2xl font-bold text-gray-900">Hoy</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Movimientos registrados</p>
              <p className="text-lg font-semibold text-purple-600">{estadisticasDashboard.movimientosHoy} movimientos</p>
              <p className="text-xs text-gray-500 mt-1">Últimas 24 horas</p>
            </div>
          </div>
        </div>

        {/* Distribución por categoría */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Distribución de Materiales por Categoría
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(estadisticasDashboard.materialesPorCategoria).map(([categoria, cantidad]) => {
              const porcentaje = (cantidad / estadisticasDashboard.totalMateriales) * 100;
              const colores = [
                'bg-blue-500',
                'bg-green-500',
                'bg-purple-500',
                'bg-orange-500',
                'bg-red-500',
                'bg-indigo-500',
              ];
              const colorIndex = Object.keys(estadisticasDashboard.materialesPorCategoria).indexOf(categoria);
              return (
                <div key={categoria} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2 truncate">{categoria}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{cantidad}</span>
                      <span className="text-xs text-gray-500">{porcentaje.toFixed(1)}%</span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${colores[colorIndex % colores.length]} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Proveedores */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Top Proveedores del Mes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estadisticasDashboard.topProveedores.map((proveedor, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700 truncate">{proveedor.nombre}</p>
                  <span className="text-xs text-green-600 font-semibold">#{index + 1}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{proveedor.ordenes} órdenes</span>
                    <span className="text-sm text-gray-500">${proveedor.valor.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(proveedor.valor / estadisticasDashboard.valorComprasEsteMes) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjetas de navegación */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Listado de Materiales */}
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500"
            onClick={() => setVista('listado')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Listado de Materiales</h3>
                <p className="text-sm text-gray-600">Gestiona todos los materiales</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Visualiza, edita y administra el catálogo completo de materiales dentales con información detallada de stock, precios y proveedores.</p>
          </div>

          {/* Control de Stock */}
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-indigo-500"
            onClick={() => setVista('stock')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Control de Stock</h3>
                <p className="text-sm text-gray-600">Monitoreo en tiempo real</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Controla los niveles de inventario, realiza ajustes de stock y visualiza el estado actual de todos los productos.</p>
          </div>

          {/* Órdenes de Compra */}
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-500"
            onClick={() => setVista('ordenes-compra')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Órdenes de Compra</h3>
                <p className="text-sm text-gray-600">Gestiona compras a proveedores</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Crea, gestiona y rastrea órdenes de compra, desde el borrador hasta la recepción completa de mercancías.</p>
          </div>

          {/* Alertas de Reabastecimiento */}
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-orange-500"
            onClick={() => setVista('alertas-reabastecimiento')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Alertas de Reabastecimiento</h3>
                <p className="text-sm text-gray-600">Productos bajo stock mínimo</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Monitorea productos que han alcanzado su nivel mínimo y genera órdenes de compra automáticamente.</p>
          </div>

          {/* Caducidades y Lotes */}
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-red-500"
            onClick={() => setVista('caducidades-lotes')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Caducidades y Lotes</h3>
                <p className="text-sm text-gray-600">Control de fechas de vencimiento</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Gestiona lotes de productos, controla fechas de caducidad y recibe alertas de productos próximos a vencer.</p>
          </div>

          {/* Consumos por Tratamiento */}
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-500"
            onClick={() => setVista('consumos-tratamiento')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Consumos por Tratamiento</h3>
                <p className="text-sm text-gray-600">Materiales por procedimiento</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Configura y gestiona los materiales consumidos en cada tipo de tratamiento dental para optimizar costos.</p>
          </div>
        </div>

        {/* Acceso rápido */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Accesos Rápidos
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setVista('nuevo-material')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Nuevo Material
            </button>
            <button
              onClick={() => setVista('stock')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Ver Stock Completo
            </button>
            <button
              onClick={() => setVista('alertas-reabastecimiento')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Ver Alertas
            </button>
            <button
              onClick={() => setVista('ordenes-compra')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Nueva Orden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

