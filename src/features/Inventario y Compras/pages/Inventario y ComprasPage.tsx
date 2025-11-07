import { useState, useMemo } from 'react';
import { Package, ShoppingCart, AlertTriangle, Calendar, ClipboardList, Warehouse, BarChart3, TrendingUp, Users, Plus } from 'lucide-react';
import ControlStockPage from './ControlStockPage';
import DetalleProductoStockPage from './DetalleProductoStockPage';
import ListadoMaterialesPage from './ListadoMaterialesPage';
import NuevoMaterialPage from './NuevoMaterialPage';
import OrdenesCompraPage from './OrdenesCompraPage';
import DetalleOrdenCompraPage from './DetalleOrdenCompraPage';
import AlertasReabastecimientoPage from './AlertasReabastecimientoPage';
import CaducidadesLotesPage from './CaducidadesLotesPage';
import TratamientoConsumosPage from './TratamientoConsumosPage';
import MetricCards from '../components/MetricCards';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Warehouse size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Inventario y Compras
                </h1>
                <p className="text-gray-600">
                  Gestión integral de materiales, stock y compras
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setVista('nuevo-material')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
            >
              <Plus size={20} />
              Nuevo Material
            </button>
          </div>

          {/* KPIs principales */}
          <MetricCards
            data={[
              {
                id: 'total-materiales',
                title: 'Total Materiales',
                value: estadisticasDashboard.totalMateriales,
                color: 'info',
              },
              {
                id: 'alertas-activas',
                title: 'Alertas Activas',
                value: estadisticasDashboard.alertasActivas,
                color: 'warning',
              },
              {
                id: 'ordenes-pendientes',
                title: 'Órdenes Pendientes',
                value: estadisticasDashboard.ordenesPendientes,
                color: 'success',
              },
              {
                id: 'lotes-caducar',
                title: 'Lotes por Caducar',
                value: estadisticasDashboard.lotesPorCaducar,
                color: 'danger',
              },
            ]}
          />

          {/* Estadísticas adicionales */}
          <MetricCards
            data={[
              {
                id: 'valor-inventario',
                title: 'Valor Total Inventario',
                value: `$${estadisticasDashboard.valorTotalInventario.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
                color: 'info',
              },
              {
                id: 'tratamientos',
                title: 'Tratamientos Configurados',
                value: estadisticasDashboard.tratamientosConfigurados,
                color: 'info',
              },
              {
                id: 'rotacion',
                title: 'Rotación Promedio',
                value: `${estadisticasDashboard.rotacionPromedio}%`,
                color: 'success',
              },
              {
                id: 'bajo-stock',
                title: 'Materiales Bajo Stock',
                value: estadisticasDashboard.materialesBajoStock,
                color: 'warning',
              },
            ]}
          />

          {/* Distribución por categoría */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
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
                  <div key={categoria} className="p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-2 truncate">{categoria}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">{cantidad}</span>
                        <span className="text-xs text-slate-500">{porcentaje.toFixed(1)}%</span>
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} className="text-green-600" />
              Top Proveedores del Mes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {estadisticasDashboard.topProveedores.map((proveedor, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700 truncate">{proveedor.nombre}</p>
                    <span className="text-xs text-green-600 font-semibold">#{index + 1}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">{proveedor.ordenes} órdenes</span>
                      <span className="text-sm text-slate-500">${proveedor.valor.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
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
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer ring-1 ring-slate-200 hover:ring-blue-300"
              onClick={() => setVista('listado')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Package size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Listado de Materiales</h3>
                  <p className="text-sm text-slate-600">Gestiona todos los materiales</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">Visualiza, edita y administra el catálogo completo de materiales dentales con información detallada de stock, precios y proveedores.</p>
            </div>

            {/* Control de Stock */}
            <div 
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer ring-1 ring-slate-200 hover:ring-indigo-300"
              onClick={() => setVista('stock')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-indigo-100 rounded-xl ring-1 ring-indigo-200/70">
                  <BarChart3 size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Control de Stock</h3>
                  <p className="text-sm text-slate-600">Monitoreo en tiempo real</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">Controla los niveles de inventario, realiza ajustes de stock y visualiza el estado actual de todos los productos.</p>
            </div>

            {/* Órdenes de Compra */}
            <div 
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer ring-1 ring-slate-200 hover:ring-green-300"
              onClick={() => setVista('ordenes-compra')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
                  <ShoppingCart size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Órdenes de Compra</h3>
                  <p className="text-sm text-slate-600">Gestiona compras a proveedores</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">Crea, gestiona y rastrea órdenes de compra, desde el borrador hasta la recepción completa de mercancías.</p>
            </div>

            {/* Alertas de Reabastecimiento */}
            <div 
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer ring-1 ring-slate-200 hover:ring-orange-300"
              onClick={() => setVista('alertas-reabastecimiento')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-orange-100 rounded-xl ring-1 ring-orange-200/70">
                  <AlertTriangle size={20} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Alertas de Reabastecimiento</h3>
                  <p className="text-sm text-slate-600">Productos bajo stock mínimo</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">Monitorea productos que han alcanzado su nivel mínimo y genera órdenes de compra automáticamente.</p>
            </div>

            {/* Caducidades y Lotes */}
            <div 
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer ring-1 ring-slate-200 hover:ring-red-300"
              onClick={() => setVista('caducidades-lotes')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-red-100 rounded-xl ring-1 ring-red-200/70">
                  <Calendar size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Caducidades y Lotes</h3>
                  <p className="text-sm text-slate-600">Control de fechas de vencimiento</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">Gestiona lotes de productos, controla fechas de caducidad y recibe alertas de productos próximos a vencer.</p>
            </div>

            {/* Consumos por Tratamiento */}
            <div 
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer ring-1 ring-slate-200 hover:ring-purple-300"
              onClick={() => setVista('consumos-tratamiento')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
                  <ClipboardList size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Consumos por Tratamiento</h3>
                  <p className="text-sm text-slate-600">Materiales por procedimiento</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">Configura y gestiona los materiales consumidos en cada tipo de tratamiento dental para optimizar costos.</p>
            </div>
          </div>

          {/* Acceso rápido */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Accesos Rápidos
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setVista('stock')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-white shadow-sm ring-1 ring-slate-200"
              >
                <BarChart3 size={18} />
                Ver Stock Completo
              </button>
              <button
                onClick={() => setVista('alertas-reabastecimiento')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-white shadow-sm ring-1 ring-slate-200"
              >
                <AlertTriangle size={18} />
                Ver Alertas
              </button>
              <button
                onClick={() => setVista('ordenes-compra')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-white shadow-sm ring-1 ring-slate-200"
              >
                <ShoppingCart size={18} />
                Nueva Orden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

