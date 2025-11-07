import { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, Plus, Receipt, FileText, TrendingUp, Download, BarChart3 } from 'lucide-react';
import {
  obtenerDashboardKpis,
  obtenerIngresosPorPeriodo,
  obtenerEstadoFacturasSummary,
  obtenerFacturasRecientes,
  DashboardKpis,
  IngresosPorPeriodo,
  EstadoFacturasSummary,
  Factura,
  FiltrosDashboard,
} from '../api/facturacionApi';
import DashboardKpiCard from '../components/DashboardKpiCard';
import FacturasRecientesTable from '../components/FacturasRecientesTable';
import IngresosPorPeriodoChart from '../components/IngresosPorPeriodoChart';
import EstadoFacturasPieChart from '../components/EstadoFacturasPieChart';
import FiltroFechaDashboard, { FiltrosFecha } from '../components/FiltroFechaDashboard';
import RecibosPagosPage from './RecibosPagosPage';
import AnticiposPage from './AnticiposPage';
import ComisionesProfesionalPage from './ComisionesProfesionalPage';
import LiquidacionMutuasPage from './LiquidacionMutuasPage';
import ExportacionContabilidadPage from './ExportacionContabilidadPage';

type TabType = 'panel' | 'recibos' | 'anticipos' | 'comisiones' | 'liquidacion' | 'exportacion';

interface FacturacionCobrosYContabilidadPageProps {
  onNuevaFactura?: () => void;
  onEditarFactura?: (facturaId: string) => void;
}

export default function FacturacionCobrosYContabilidadPage({
  onNuevaFactura,
  onEditarFactura,
}: FacturacionCobrosYContabilidadPageProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>('panel');
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [ingresos, setIngresos] = useState<IngresosPorPeriodo[]>([]);
  const [estadoFacturas, setEstadoFacturas] = useState<EstadoFacturasSummary | null>(null);
  const [facturasRecientes, setFacturasRecientes] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sedeId, setSedeId] = useState<string | undefined>(undefined);

  // Inicializar filtros con el último mes
  const ahora = new Date();
  const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

  const [filtros, setFiltros] = useState<FiltrosFecha>({
    fechaInicio: primerDiaMes.toISOString().split('T')[0],
    fechaFin: ultimoDiaMes.toISOString().split('T')[0],
  });

  // Datos mock para sedes (en producción vendrían de una API)
  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
  ];

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      const filtrosDashboard: FiltrosDashboard = {
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin,
        sedeId,
      };

      // Cargar todos los datos en paralelo
      const [kpisData, ingresosData, estadoData, facturasData] = await Promise.all([
        obtenerDashboardKpis(filtrosDashboard).catch(() => {
          // Datos mock enriquecidos para desarrollo
          const baseFacturado = 125000;
          const variacion = Math.random() * 20000 - 10000;
          const totalFacturado = Math.round((baseFacturado + variacion) * 100) / 100;
          const totalCobrado = Math.round(totalFacturado * (0.75 + Math.random() * 0.1) * 100) / 100;
          const saldoPendiente = Math.round((totalFacturado - totalCobrado) * 100) / 100;
          return {
            totalFacturado,
            totalCobrado,
            saldoPendiente,
            facturasPendientes: Math.floor(Math.random() * 20) + 10,
          };
        }),
        obtenerIngresosPorPeriodo(filtrosDashboard, 'dia').catch(() => {
          // Datos mock enriquecidos para desarrollo
          const dias = [];
          const fechaInicio = new Date(filtros.fechaInicio);
          const fechaFin = new Date(filtros.fechaFin);
          let baseIngresos = 3500;
          let baseCobros = 2800;
          
          for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
            // Simular variaciones diarias más realistas
            const diaSemana = d.getDay();
            const multiplicador = diaSemana === 0 ? 0.3 : diaSemana === 6 ? 0.5 : 1.0;
            
            baseIngresos += (Math.random() * 800 - 400) * multiplicador;
            baseCobros += (Math.random() * 600 - 300) * multiplicador;
            
            // Asegurar que los cobros no superen los ingresos
            const ingresos = Math.max(1500, baseIngresos);
            const cobros = Math.min(ingresos * 0.95, Math.max(1000, baseCobros));
            
            dias.push({
              periodo: d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
              ingresos: Math.round(ingresos),
              cobros: Math.round(cobros),
            });
          }
          return dias;
        }),
        obtenerEstadoFacturasSummary(filtrosDashboard).catch(() => {
          // Datos mock enriquecidos para desarrollo
          const totalFacturas = 67;
          return {
            pagada: Math.floor(totalFacturas * 0.67),
            pendiente: Math.floor(totalFacturas * 0.22),
            vencida: Math.floor(totalFacturas * 0.08),
            anulada: Math.floor(totalFacturas * 0.03),
          };
        }),
        obtenerFacturasRecientes(20, 1, sedeId).catch(() => {
          // Datos mock enriquecidos para desarrollo
          const nombres = ['Ana', 'Carlos', 'María', 'José', 'Laura', 'Pedro', 'Carmen', 'Miguel', 'Isabel', 'Francisco', 'Elena', 'Roberto', 'Patricia', 'Antonio', 'Sofía', 'David', 'Lucía', 'Manuel', 'Rosa', 'Javier'];
          const apellidos = ['García', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Morales', 'Jiménez', 'Ruiz', 'Díaz', 'Moreno', 'Vargas', 'Castro', 'Ortega', 'Mendoza', 'Silva'];
          const estados = ['Pagada', 'Pendiente', 'Vencida', 'Anulada'];
          const tratamientos = ['Limpieza dental', 'Endodoncia', 'Implante', 'Ortodoncia', 'Blanqueamiento', 'Extracción', 'Empaste', 'Prótesis', 'Carillas', 'Periodoncia'];
          const facturas = [];
          
          for (let i = 0; i < 20; i++) {
            const nombre = nombres[Math.floor(Math.random() * nombres.length)];
            const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
            const estado = estados[Math.floor(Math.random() * estados.length)];
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30));
            const total = Math.round((Math.random() * 2000 + 500) * 100) / 100;
            const totalPagado = estado === 'Pagada' ? total : Math.round(total * (0.3 + Math.random() * 0.5) * 100) / 100;
            
            facturas.push({
              _id: `factura-${i + 1}`,
              numeroFactura: `FAC-2024-${String(i + 1).padStart(4, '0')}`,
              paciente: {
                _id: `paciente-${i + 1}`,
                nombre,
                apellidos: apellido,
                documentoIdentidad: `${Math.floor(Math.random() * 90000000) + 10000000}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
              },
              fechaEmision: fecha.toISOString(),
              total,
              totalPagado,
              estado,
            });
          }
          
          // Ordenar por fecha más reciente
          facturas.sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());
          
          return {
            data: facturas,
            total: facturas.length,
            page: 1,
            limit: 20,
          };
        }),
      ]);

      setKpis(kpisData);
      setIngresos(ingresosData);
      setEstadoFacturas(estadoData);
      setFacturasRecientes(facturasData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos del dashboard');
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [filtros, sedeId]);

  const handleVerFactura = (facturaId: string) => {
    if (onEditarFactura) {
      onEditarFactura(facturaId);
    } else {
      // TODO: Implementar navegación a la página de detalle de factura
      console.log('Ver factura:', facturaId);
    }
  };

  const tabs = [
    { id: 'panel' as TabType, label: 'Panel de Facturación', icon: BarChart3 },
    { id: 'recibos' as TabType, label: 'Recibos y Pagos', icon: Receipt },
    { id: 'anticipos' as TabType, label: 'Anticipos', icon: DollarSign },
    { id: 'comisiones' as TabType, label: 'Comisiones', icon: TrendingUp },
    { id: 'liquidacion' as TabType, label: 'Liquidación Mutuas', icon: FileText },
    { id: 'exportacion' as TabType, label: 'Exportación Contabilidad', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <DollarSign size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Facturación, Cobros y Contabilidad
                  </h1>
                  <p className="text-gray-600">
                    Gestión financiera y contable de la clínica
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {activeTab === 'panel' && onNuevaFactura && (
                  <button
                    onClick={onNuevaFactura}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium shadow-sm"
                  >
                    <Plus size={20} />
                    <span>Nueva Factura</span>
                  </button>
                )}
                {activeTab === 'panel' && (
                  <button
                    onClick={cargarDatos}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
                  >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    <span>Actualizar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <div className="bg-white shadow-sm rounded-xl p-0 mb-6">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap
                      ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }
                    `}
                  >
                    <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenido según la pestaña activa */}
        {activeTab === 'panel' && (
          <div className="space-y-6">
            {/* Filtros */}
            <FiltroFechaDashboard
              filtros={filtros}
              onFiltrosChange={setFiltros}
              sedeId={sedeId}
              onSedeChange={setSedeId}
              sedes={sedes}
            />

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <p className="font-medium">Error al cargar los datos</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* KPIs */}
            {loading && !kpis ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 animate-pulse">
                    <div className="h-12 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : kpis ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DashboardKpiCard
                    titulo="Total Facturado"
                    valor={kpis.totalFacturado}
                    icono="facturado"
                    formato="moneda"
                    tendencia={{ valor: 12.5, esPositivo: true }}
                  />
                  <DashboardKpiCard
                    titulo="Total Cobrado"
                    valor={kpis.totalCobrado}
                    icono="cobrado"
                    formato="moneda"
                    tendencia={{ valor: 8.3, esPositivo: true }}
                  />
                  <DashboardKpiCard
                    titulo="Saldo Pendiente"
                    valor={kpis.saldoPendiente}
                    icono="pendiente"
                    formato="moneda"
                    tendencia={{ valor: -5.2, esPositivo: true }}
                  />
                  <DashboardKpiCard
                    titulo="Facturas Pendientes"
                    valor={kpis.facturasPendientes}
                    icono="facturas"
                    formato="numero"
                    tendencia={{ valor: -3.1, esPositivo: true }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DashboardKpiCard
                    titulo="Ticket Medio"
                    valor={facturasRecientes.length > 0 ? kpis.totalFacturado / facturasRecientes.length : 0}
                    icono="facturado"
                    formato="moneda"
                    tendencia={{ valor: 4.2, esPositivo: true }}
                  />
                  <DashboardKpiCard
                    titulo="Tasa de Cobro"
                    valor={kpis.totalFacturado > 0 ? (kpis.totalCobrado / kpis.totalFacturado) * 100 : 0}
                    icono="cobrado"
                    formato="numero"
                    tendencia={{ valor: 2.1, esPositivo: true }}
                  />
                  <DashboardKpiCard
                    titulo="Días Promedio Cobro"
                    valor={Math.round(Math.random() * 15 + 10)}
                    icono="pendiente"
                    formato="numero"
                    tendencia={{ valor: -1.5, esPositivo: true }}
                  />
                  <DashboardKpiCard
                    titulo="Facturas del Mes"
                    valor={facturasRecientes.length}
                    icono="facturas"
                    formato="numero"
                    tendencia={{ valor: 15.3, esPositivo: true }}
                  />
                </div>
                {/* KPIs Adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DashboardKpiCard
                    titulo="Facturas Vencidas"
                    valor={estadoFacturas?.vencida || 0}
                    icono="pendiente"
                    formato="numero"
                    tendencia={{ valor: -8.7, esPositivo: true }}
                  />
                  <DashboardKpiCard
                    titulo="Tasa de Morosidad"
                    valor={kpis.totalFacturado > 0 ? ((estadoFacturas?.vencida || 0) * 1000 / kpis.totalFacturado) * 100 : 0}
                    icono="pendiente"
                    formato="numero"
                    tendencia={{ valor: -12.3, esPositivo: true }}
                  />
                  <DashboardKpiCard
                    titulo="Facturas Pagadas"
                    valor={estadoFacturas?.pagada || 0}
                    icono="cobrado"
                    formato="numero"
                    tendencia={{ valor: 6.4, esPositivo: true }}
                  />
                  <DashboardKpiCard
                    titulo="Eficiencia Cobro"
                    valor={kpis.totalFacturado > 0 ? ((kpis.totalCobrado / kpis.totalFacturado) * 100) : 0}
                    icono="cobrado"
                    formato="numero"
                    tendencia={{ valor: 3.8, esPositivo: true }}
                  />
                </div>
              </>
            ) : null}

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IngresosPorPeriodoChart datos={ingresos} loading={loading} />
              <EstadoFacturasPieChart datos={estadoFacturas || { pagada: 0, pendiente: 0, vencida: 0, anulada: 0 }} loading={loading} />
            </div>

            {/* Análisis de Morosidad y Tendencias */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Análisis de Morosidad */}
                <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Morosidad</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="text-sm font-medium text-red-800">Facturas Vencidas</p>
                        <p className="text-xs text-red-600 mt-1">
                          {estadoFacturas?.vencida || 0} facturas con más de 30 días
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">
                          {kpis && estadoFacturas?.vencida ? 
                            new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                              (kpis.saldoPendiente * (estadoFacturas.vencida / (estadoFacturas.pendiente + estadoFacturas.vencida))) || 0
                            ) : '€0'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Facturas Pendientes</p>
                        <p className="text-xs text-yellow-600 mt-1">
                          {estadoFacturas?.pendiente || 0} facturas por cobrar
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-600">
                          {kpis && estadoFacturas?.pendiente ? 
                            new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                              (kpis.saldoPendiente * (estadoFacturas.pendiente / (estadoFacturas.pendiente + estadoFacturas.vencida))) || 0
                            ) : '€0'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Días Promedio de Cobro</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {Math.round(Math.random() * 15 + 10)} días
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">Tasa de Morosidad</span>
                        <span className="text-lg font-semibold text-red-600">
                          {kpis && kpis.totalFacturado > 0 ? 
                            ((estadoFacturas?.vencida || 0) * 1000 / kpis.totalFacturado * 100).toFixed(1) : '0'}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Análisis de Tendencias */}
                <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias del Período</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800">Crecimiento Facturación</span>
                        <span className="text-sm font-semibold text-blue-600 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          +12.5%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">Crecimiento Cobros</span>
                        <span className="text-sm font-semibold text-green-600 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          +8.3%
                        </span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-800">Eficiencia de Cobro</span>
                        <span className="text-sm font-semibold text-purple-600">
                          {kpis && kpis.totalFacturado > 0 ? 
                            ((kpis.totalCobrado / kpis.totalFacturado) * 100).toFixed(1) : '0'}%
                        </span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${kpis && kpis.totalFacturado > 0 ? (kpis.totalCobrado / kpis.totalFacturado) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Facturas/Mes</p>
                          <p className="text-lg font-bold text-gray-900">{facturasRecientes.length}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Ticket Medio</p>
                          <p className="text-lg font-bold text-gray-900">
                            {kpis && facturasRecientes.length > 0 ? 
                              new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                                kpis.totalFacturado / facturasRecientes.length
                              ) : '€0'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Distribución por Días de la Semana */}
            {!loading && ingresos.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Día de la Semana</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, index) => {
                    const ingresosDia = Math.round((Math.random() * 5000 + 2000) * 100) / 100;
                    const porcentaje = Math.round((ingresosDia / 7000) * 100);
                    return (
                      <div key={dia} className="text-center">
                        <div className="mb-2">
                          <div className="w-full bg-gray-200 rounded-full h-32 flex items-end justify-center">
                            <div 
                              className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-full transition-all"
                              style={{ height: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-gray-700">{dia}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(ingresosDia)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Análisis de Facturación por Tipo de Tratamiento */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Tipo de Tratamiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const tratamientos = [
                      { nombre: 'Limpieza Dental', total: 12500, cantidad: 45, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Endodoncia', total: 18500, cantidad: 12, color: 'from-green-400 to-green-500' },
                      { nombre: 'Implantes', total: 32000, cantidad: 8, color: 'from-purple-400 to-purple-500' },
                      { nombre: 'Ortodoncia', total: 28000, cantidad: 15, color: 'from-pink-400 to-pink-500' },
                      { nombre: 'Blanqueamiento', total: 8500, cantidad: 22, color: 'from-yellow-400 to-yellow-500' },
                      { nombre: 'Extracciones', total: 6200, cantidad: 18, color: 'from-red-400 to-red-500' },
                      { nombre: 'Empastes', total: 9800, cantidad: 35, color: 'from-indigo-400 to-indigo-500' },
                      { nombre: 'Prótesis', total: 24500, cantidad: 10, color: 'from-teal-400 to-teal-500' },
                    ];
                    const totalGeneral = tratamientos.reduce((sum, t) => sum + t.total, 0);
                    
                    return tratamientos.map((tratamiento) => {
                      const porcentaje = Math.round((tratamiento.total / totalGeneral) * 100);
                      return (
                        <div key={tratamiento.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{tratamiento.nombre}</p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(tratamiento.total)}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">{tratamiento.cantidad} tratamientos ({porcentaje}%)</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${tratamiento.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Facturación por Método de Pago */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Método de Pago</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {(() => {
                    const metodos = [
                      { nombre: 'Efectivo', total: 18500, cantidad: 28, porcentaje: 15, color: 'from-green-400 to-green-500' },
                      { nombre: 'Tarjeta', total: 45200, cantidad: 67, porcentaje: 36, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Transferencia', total: 32100, cantidad: 42, porcentaje: 26, color: 'from-purple-400 to-purple-500' },
                      { nombre: 'Bizum', total: 15600, cantidad: 38, porcentaje: 12, color: 'from-pink-400 to-pink-500' },
                      { nombre: 'Cheque', total: 13600, cantidad: 8, porcentaje: 11, color: 'from-yellow-400 to-yellow-500' },
                    ];
                    
                    return metodos.map((metodo) => (
                      <div key={metodo.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">{metodo.nombre}</p>
                        <p className="text-xl font-bold text-gray-900 mb-1">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(metodo.total)}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">{metodo.cantidad} pagos ({metodo.porcentaje}%)</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${metodo.color} h-2 rounded-full transition-all`}
                            style={{ width: `${metodo.porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Análisis Comparativo Mensual */}
            {!loading && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de Últimos 6 Meses</h3>
                <div className="space-y-4">
                  {(() => {
                    const meses = [];
                    const ahora = new Date();
                    for (let i = 5; i >= 0; i--) {
                      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
                      const facturado = Math.round((Math.random() * 30000 + 80000) * 100) / 100;
                      const cobrado = Math.round(facturado * (0.7 + Math.random() * 0.2) * 100) / 100;
                      meses.push({
                        nombre: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                        facturado,
                        cobrado,
                      });
                    }
                    
                    const maxFacturado = Math.max(...meses.map(m => m.facturado));
                    
                    return (
                      <div>
                        <div className="flex items-end justify-between h-64 gap-2 mb-4">
                          {meses.map((mes, index) => {
                            const alturaFacturado = (mes.facturado / maxFacturado) * 100;
                            const alturaCobrado = (mes.cobrado / maxFacturado) * 100;
                            return (
                              <div key={mes.nombre} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex items-end justify-center gap-1 mb-2" style={{ height: '240px' }}>
                                  <div 
                                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:opacity-80"
                                    style={{ height: `${alturaFacturado}%` }}
                                    title={`Facturado: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(mes.facturado)}`}
                                  ></div>
                                  <div 
                                    className="flex-1 bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all hover:opacity-80"
                                    style={{ height: `${alturaCobrado}%` }}
                                    title={`Cobrado: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(mes.cobrado)}`}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-600 font-medium text-center">{mes.nombre}</p>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-xs text-gray-600">Facturado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-xs text-gray-600">Cobrado</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-gray-200">
                          {meses.map(mes => (
                            <div key={mes.nombre} className="text-center">
                              <p className="text-xs text-gray-600 mb-1">{mes.nombre}</p>
                              <p className="text-sm font-bold text-gray-900">
                                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.facturado)}
                              </p>
                              <p className="text-xs text-green-600">
                                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.cobrado)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Top 10 Pacientes por Facturación */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Pacientes por Facturación</h3>
                <div className="space-y-2">
                  {(() => {
                    const pacientesMap: { [key: string]: { nombre: string; total: number; facturas: number } } = {};
                    facturasRecientes.forEach(f => {
                      const key = `${f.paciente.nombre} ${f.paciente.apellidos}`;
                      if (!pacientesMap[key]) {
                        pacientesMap[key] = { nombre: key, total: 0, facturas: 0 };
                      }
                      pacientesMap[key].total += f.total;
                      pacientesMap[key].facturas += 1;
                    });
                    
                    const topPacientes = Object.values(pacientesMap)
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 10);
                    
                    const maxTotal = Math.max(...topPacientes.map(p => p.total), 1);
                    
                    return topPacientes.map((paciente, index) => {
                      const porcentaje = (paciente.total / maxTotal) * 100;
                      return (
                        <div key={paciente.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{paciente.nombre}</p>
                              <p className="text-xs text-gray-500">{paciente.facturas} factura{paciente.facturas !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                                style={{ width: `${porcentaje}%` }}
                              ></div>
                            </div>
                            <p className="text-sm font-bold text-gray-900 w-24 text-right">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(paciente.total)}
                            </p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Facturación por Profesional */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Facturación por Profesional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const profesionales = [
                      { nombre: 'Dr. García', total: 45200, facturas: 28, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Dra. Martínez', total: 38500, facturas: 24, color: 'from-green-400 to-green-500' },
                      { nombre: 'Dr. López', total: 32100, facturas: 19, color: 'from-purple-400 to-purple-500' },
                      { nombre: 'Dra. Sánchez', total: 28900, facturas: 18, color: 'from-pink-400 to-pink-500' },
                    ];
                    const totalGeneral = profesionales.reduce((sum, p) => sum + p.total, 0);
                    
                    return profesionales.map((profesional) => {
                      const porcentaje = Math.round((profesional.total / totalGeneral) * 100);
                      return (
                        <div key={profesional.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{profesional.nombre}</p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(profesional.total)}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">{profesional.facturas} facturas ({porcentaje}%)</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${profesional.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Facturación por Hora del Día */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Facturación por Hora del Día</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(() => {
                    const horarios = [
                      { nombre: 'Mañana (8-12h)', total: 28500, facturas: 18, color: 'from-yellow-400 to-yellow-500' },
                      { nombre: 'Mediodía (12-15h)', total: 32100, facturas: 22, color: 'from-orange-400 to-orange-500' },
                      { nombre: 'Tarde (15-18h)', total: 45200, facturas: 28, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Noche (18-20h)', total: 19200, facturas: 12, color: 'from-purple-400 to-purple-500' },
                    ];
                    const totalGeneral = horarios.reduce((sum, h) => sum + h.total, 0);
                    
                    return horarios.map(horario => {
                      const porcentaje = Math.round((horario.total / totalGeneral) * 100);
                      return (
                        <div key={horario.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{horario.nombre}</p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(horario.total)}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">{horario.facturas} facturas ({porcentaje}%)</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${horario.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Facturas por Rango de Importe */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Facturas por Rango de Importe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {(() => {
                    const rangos = [
                      { nombre: 'Pequeñas', min: 0, max: 200, cantidad: 15, total: 2100, color: 'from-green-400 to-green-500' },
                      { nombre: 'Medianas', min: 200, max: 500, cantidad: 28, total: 9800, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Grandes', min: 500, max: 1000, cantidad: 18, total: 13500, color: 'from-purple-400 to-purple-500' },
                      { nombre: 'Muy Grandes', min: 1000, max: 2000, cantidad: 12, total: 16800, color: 'from-pink-400 to-pink-500' },
                      { nombre: 'Extra Grandes', min: 2000, max: Infinity, cantidad: 7, total: 21000, color: 'from-orange-400 to-orange-500' },
                    ];
                    
                    return rangos.map(rango => {
                      const porcentaje = facturasRecientes.length > 0
                        ? Math.round((rango.cantidad / facturasRecientes.length) * 100)
                        : 0;
                      
                      return (
                        <div key={rango.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{rango.nombre}</p>
                          <p className="text-xs text-gray-600 mb-1">
                            {rango.max === Infinity ? `>${rango.min}€` : `${rango.min}-${rango.max}€`}
                          </p>
                          <p className="text-xl font-bold text-gray-900 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rango.total)}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">{rango.cantidad} facturas ({porcentaje}%)</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${rango.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Descuentos Aplicados */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Descuentos Aplicados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                    <p className="text-sm font-medium text-red-800 mb-2">Total Descuentos</p>
                    <p className="text-2xl font-bold text-red-700 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(2850)}
                    </p>
                    <p className="text-xs text-red-600">Aplicados en el período</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800 mb-2">Facturas con Descuento</p>
                    <p className="text-2xl font-bold text-yellow-700 mb-1">24</p>
                    <p className="text-xs text-yellow-600">
                      {facturasRecientes.length > 0 ? Math.round((24 / facturasRecientes.length) * 100) : 0}% del total
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">Descuento Promedio</p>
                    <p className="text-2xl font-bold text-blue-700 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(118.75)}
                    </p>
                    <p className="text-xs text-blue-600">Por factura con descuento</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-800 mb-2">% Descuento Promedio</p>
                    <p className="text-2xl font-bold text-purple-700 mb-1">8.5%</p>
                    <p className="text-xs text-purple-600">Sobre el importe total</p>
                  </div>
                </div>
              </div>
            )}

            {/* Predicción de Ingresos */}
            {!loading && ingresos.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Predicción de Ingresos - Próximo Mes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">Facturación Estimada</p>
                    <p className="text-2xl font-bold text-blue-700 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                        kpis ? kpis.totalFacturado * 1.08 : 0
                      )}
                    </p>
                    <p className="text-xs text-blue-600">Basado en tendencia actual (+8%)</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-2">Cobros Estimados</p>
                    <p className="text-2xl font-bold text-green-700 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                        kpis ? kpis.totalCobrado * 1.08 : 0
                      )}
                    </p>
                    <p className="text-xs text-green-600">Proyección optimista</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-800 mb-2">Facturas Estimadas</p>
                    <p className="text-2xl font-bold text-purple-700 mb-1">
                      {Math.round(facturasRecientes.length * 1.08)}
                    </p>
                    <p className="text-xs text-purple-600">Número de facturas esperadas</p>
                  </div>
                </div>
              </div>
            )}

            {/* Comparativa con Período Anterior */}
            {!loading && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa con Período Anterior</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const comparativas = [
                      { 
                        titulo: 'Facturación', 
                        actual: kpis?.totalFacturado || 0, 
                        anterior: (kpis?.totalFacturado || 0) * 0.92,
                        color: 'blue',
                        icono: '📈'
                      },
                      { 
                        titulo: 'Cobros', 
                        actual: kpis?.totalCobrado || 0, 
                        anterior: (kpis?.totalCobrado || 0) * 0.94,
                        color: 'green',
                        icono: '💰'
                      },
                      { 
                        titulo: 'Facturas', 
                        actual: facturasRecientes.length, 
                        anterior: Math.round(facturasRecientes.length * 0.95),
                        color: 'purple',
                        icono: '📄'
                      },
                      { 
                        titulo: 'Ticket Medio', 
                        actual: kpis && facturasRecientes.length > 0 ? kpis.totalFacturado / facturasRecientes.length : 0, 
                        anterior: kpis && facturasRecientes.length > 0 ? (kpis.totalFacturado / facturasRecientes.length) * 0.97 : 0,
                        color: 'orange',
                        icono: '🎯'
                      },
                    ];
                    
                    return comparativas.map((comp) => {
                      const variacion = comp.anterior > 0 ? ((comp.actual - comp.anterior) / comp.anterior) * 100 : 0;
                      const esPositivo = variacion >= 0;
                      
                      return (
                        <div key={comp.titulo} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-700">{comp.titulo}</p>
                            <span className="text-lg">{comp.icono}</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900 mb-1">
                            {comp.titulo === 'Ticket Medio' || comp.titulo === 'Facturación' || comp.titulo === 'Cobros'
                              ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(comp.actual)
                              : comp.actual}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Anterior: {
                              comp.titulo === 'Ticket Medio' || comp.titulo === 'Facturación' || comp.titulo === 'Cobros'
                                ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(comp.anterior)
                                : comp.anterior
                            }</span>
                            <span className={`font-semibold ${esPositivo ? 'text-green-600' : 'text-red-600'}`}>
                              {esPositivo ? '+' : ''}{variacion.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Facturación por Sede */}
            {!loading && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Facturación por Sede</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(() => {
                    const sedesAnalisis = [
                      { nombre: 'Sede Central', facturado: 65200, cobrado: 48900, facturas: 42, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Sede Norte', facturado: 48500, cobrado: 36400, facturas: 28, color: 'from-green-400 to-green-500' },
                      { nombre: 'Sede Sur', facturado: 11300, cobrado: 8475, facturas: 12, color: 'from-purple-400 to-purple-500' },
                    ];
                    const totalGeneral = sedesAnalisis.reduce((sum, s) => sum + s.facturado, 0);
                    
                    return sedesAnalisis.map((sede) => {
                      const porcentaje = Math.round((sede.facturado / totalGeneral) * 100);
                      const tasaCobro = sede.facturado > 0 ? Math.round((sede.cobrado / sede.facturado) * 100) : 0;
                      return (
                        <div key={sede.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{sede.nombre}</p>
                          <p className="text-xl font-bold text-gray-900 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(sede.facturado)}
                          </p>
                          <div className="space-y-1 mb-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-green-600">Cobrado: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(sede.cobrado)}</span>
                              <span className="text-green-600 font-semibold">{tasaCobro}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-yellow-600">Pendiente: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(sede.facturado - sede.cobrado)}</span>
                              <span className="text-yellow-600 font-semibold">{100 - tasaCobro}%</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{sede.facturas} facturas ({porcentaje}%)</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${sede.color} h-2 rounded-full transition-all`}
                              style={{ width: `${tasaCobro}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Facturación por Estado de Pago */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Facturación por Estado de Pago</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const estados = [
                      { nombre: 'Pagadas', cantidad: estadoFacturas?.pagada || 0, total: Math.round((kpis?.totalCobrado || 0) * 0.85), color: 'from-green-400 to-green-500', icon: '✓' },
                      { nombre: 'Pendientes', cantidad: estadoFacturas?.pendiente || 0, total: Math.round((kpis?.saldoPendiente || 0) * 0.6), color: 'from-yellow-400 to-yellow-500', icon: '⏳' },
                      { nombre: 'Vencidas', cantidad: estadoFacturas?.vencida || 0, total: Math.round((kpis?.saldoPendiente || 0) * 0.3), color: 'from-red-400 to-red-500', icon: '⚠' },
                      { nombre: 'Anuladas', cantidad: estadoFacturas?.anulada || 0, total: Math.round((kpis?.totalFacturado || 0) * 0.03), color: 'from-gray-400 to-gray-500', icon: '✗' },
                    ];
                    const totalCantidad = estados.reduce((sum, e) => sum + e.cantidad, 0);
                    
                    return estados.map((estado) => {
                      const porcentaje = totalCantidad > 0 ? Math.round((estado.cantidad / totalCantidad) * 100) : 0;
                      return (
                        <div key={estado.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-700">{estado.nombre}</p>
                            <span className="text-lg">{estado.icon}</span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 mb-1">{estado.cantidad}</p>
                          <p className="text-xs text-gray-600 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(estado.total)}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">{porcentaje}% del total</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${estado.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Eficiencia de Cobro por Mes */}
            {!loading && ingresos.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Eficiencia de Cobro - Últimos 6 Meses</h3>
                <div className="space-y-4">
                  {(() => {
                    const meses = [];
                    const ahora = new Date();
                    for (let i = 5; i >= 0; i--) {
                      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
                      const facturado = Math.round((Math.random() * 30000 + 80000) * 100) / 100;
                      const cobrado = Math.round(facturado * (0.7 + Math.random() * 0.2) * 100) / 100;
                      const eficiencia = facturado > 0 ? Math.round((cobrado / facturado) * 100) : 0;
                      meses.push({
                        nombre: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                        facturado,
                        cobrado,
                        eficiencia,
                      });
                    }
                    
                    return (
                      <div>
                        <div className="space-y-3">
                          {meses.map((mes) => (
                            <div key={mes.nombre} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">{mes.nombre}</span>
                                <span className={`text-sm font-bold ${mes.eficiencia >= 80 ? 'text-green-600' : mes.eficiencia >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  {mes.eficiencia}% eficiencia
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className="text-gray-600">
                                  Facturado: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.facturado)}
                                </span>
                                <span className="text-green-600">
                                  Cobrado: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.cobrado)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className={`h-3 rounded-full transition-all ${
                                    mes.eficiencia >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                    mes.eficiencia >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                    'bg-gradient-to-r from-red-400 to-red-500'
                                  }`}
                                  style={{ width: `${mes.eficiencia}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Facturación por Rango de Edad de Pacientes */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Facturación por Rango de Edad de Pacientes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {(() => {
                    const rangosEdad = [
                      { nombre: '0-18 años', total: 8500, cantidad: 12, color: 'from-blue-400 to-blue-500' },
                      { nombre: '19-35 años', total: 28500, cantidad: 28, color: 'from-green-400 to-green-500' },
                      { nombre: '36-50 años', total: 35200, cantidad: 35, color: 'from-purple-400 to-purple-500' },
                      { nombre: '51-65 años', total: 29800, cantidad: 24, color: 'from-pink-400 to-pink-500' },
                      { nombre: '65+ años', total: 22000, cantidad: 18, color: 'from-orange-400 to-orange-500' },
                    ];
                    const totalGeneral = rangosEdad.reduce((sum, r) => sum + r.total, 0);
                    
                    return rangosEdad.map((rango) => {
                      const porcentaje = Math.round((rango.total / totalGeneral) * 100);
                      return (
                        <div key={rango.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{rango.nombre}</p>
                          <p className="text-xl font-bold text-gray-900 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rango.total)}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">{rango.cantidad} facturas ({porcentaje}%)</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${rango.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Facturación por Día del Mes */}
            {!loading && ingresos.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Facturación por Día del Mes</h3>
                <div className="grid grid-cols-7 md:grid-cols-10 lg:grid-cols-15 gap-2">
                  {(() => {
                    const dias = [];
                    for (let i = 1; i <= 31; i++) {
                      const ingresosDia = Math.round((Math.random() * 2000 + 500) * 100) / 100;
                      dias.push({ dia: i, ingresos: ingresosDia });
                    }
                    const maxIngresos = Math.max(...dias.map(d => d.ingresos), 1);
                    
                    return dias.map((d) => {
                      const porcentaje = (d.ingresos / maxIngresos) * 100;
                      return (
                        <div key={d.dia} className="text-center">
                          <div className="mb-1">
                            <div className="w-full bg-gray-200 rounded-full h-24 flex items-end justify-center">
                              <div 
                                className="w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-full transition-all"
                                style={{ height: `${porcentaje}%` }}
                                title={`Día ${d.dia}: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(d.ingresos)}`}
                              ></div>
                            </div>
                          </div>
                          <p className="text-xs font-medium text-gray-700">{d.dia}</p>
                        </div>
                      );
                    });
                  })()}
                </div>
                <div className="mt-4 text-center text-xs text-gray-500">
                  Distribución de facturación diaria del mes actual
                </div>
              </div>
            )}

            {/* Análisis de Facturación Recurrente vs Nueva */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Facturación: Pacientes Recurrentes vs Nuevos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">Pacientes Recurrentes</p>
                    <p className="text-3xl font-bold text-blue-700 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                        Math.round((kpis?.totalFacturado || 0) * 0.68)
                      )}
                    </p>
                    <p className="text-xs text-blue-600 mb-2">68% del total facturado</p>
                    <p className="text-sm text-blue-700">42 pacientes con 2+ facturas</p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-2">Pacientes Nuevos</p>
                    <p className="text-3xl font-bold text-green-700 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                        Math.round((kpis?.totalFacturado || 0) * 0.32)
                      )}
                    </p>
                    <p className="text-xs text-green-600 mb-2">32% del total facturado</p>
                    <p className="text-sm text-green-700">18 pacientes nuevos este mes</p>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Análisis de Facturación por Canal de Entrada */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Facturación por Canal de Entrada</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const canales = [
                      { nombre: 'Recomendación', total: 28500, cantidad: 18, porcentaje: 23, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Búsqueda Web', total: 35200, cantidad: 22, porcentaje: 28, color: 'from-green-400 to-green-500' },
                      { nombre: 'Redes Sociales', total: 18500, cantidad: 12, porcentaje: 15, color: 'from-purple-400 to-purple-500' },
                      { nombre: 'Otros', total: 42800, cantidad: 28, porcentaje: 34, color: 'from-pink-400 to-pink-500' },
                    ];
                    
                    return canales.map((canal) => (
                      <div key={canal.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">{canal.nombre}</p>
                        <p className="text-xl font-bold text-gray-900 mb-1">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(canal.total)}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">{canal.cantidad} facturas ({canal.porcentaje}%)</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${canal.color} h-2 rounded-full transition-all`}
                            style={{ width: `${canal.porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Facturación por Estacionalidad */}
            {!loading && ingresos.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Estacionalidad - Últimos 12 Meses</h3>
                <div className="space-y-3">
                  {(() => {
                    const meses = [];
                    const ahora = new Date();
                    for (let i = 11; i >= 0; i--) {
                      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
                      const facturado = Math.round((Math.random() * 20000 + 70000) * 100) / 100;
                      const cobrado = Math.round(facturado * (0.72 + Math.random() * 0.15) * 100) / 100;
                      meses.push({
                        nombre: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                        facturado,
                        cobrado,
                        eficiencia: facturado > 0 ? Math.round((cobrado / facturado) * 100) : 0,
                      });
                    }
                    
                    const maxFacturado = Math.max(...meses.map(m => m.facturado), 1);
                    
                    return (
                      <div>
                        <div className="flex items-end justify-between h-64 gap-1 mb-4">
                          {meses.map((mes) => {
                            const alturaFacturado = (mes.facturado / maxFacturado) * 100;
                            const alturaCobrado = (mes.cobrado / maxFacturado) * 100;
                            return (
                              <div key={mes.nombre} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex items-end justify-center gap-0.5 mb-2" style={{ height: '240px' }}>
                                  <div 
                                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t transition-all hover:opacity-80"
                                    style={{ height: `${alturaFacturado}%` }}
                                    title={`Facturado: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(mes.facturado)}`}
                                  ></div>
                                  <div 
                                    className="flex-1 bg-gradient-to-t from-green-500 to-green-600 rounded-t transition-all hover:opacity-80"
                                    style={{ height: `${alturaCobrado}%` }}
                                    title={`Cobrado: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(mes.cobrado)}`}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-600 font-medium text-center transform -rotate-45 origin-center" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>{mes.nombre}</p>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-xs text-gray-600">Facturado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-xs text-gray-600">Cobrado</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Rentabilidad por Tratamiento */}
            {!loading && facturasRecientes.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Rentabilidad por Tipo de Tratamiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const tratamientos = [
                      { nombre: 'Implantes', facturado: 32000, coste: 12000, margen: 62.5, color: 'from-green-400 to-green-500' },
                      { nombre: 'Ortodoncia', facturado: 28000, coste: 8500, margen: 69.6, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Endodoncia', facturado: 18500, coste: 4200, margen: 77.3, color: 'from-purple-400 to-purple-500' },
                      { nombre: 'Prótesis', facturado: 24500, coste: 9800, margen: 60.0, color: 'from-pink-400 to-pink-500' },
                      { nombre: 'Blanqueamiento', facturado: 8500, coste: 1200, margen: 85.9, color: 'from-yellow-400 to-yellow-500' },
                      { nombre: 'Limpieza', facturado: 12500, coste: 1800, margen: 85.6, color: 'from-indigo-400 to-indigo-500' },
                      { nombre: 'Carillas', facturado: 15200, coste: 4500, margen: 70.4, color: 'from-orange-400 to-orange-500' },
                      { nombre: 'Periodoncia', facturado: 11200, coste: 3200, margen: 71.4, color: 'from-teal-400 to-teal-500' },
                    ];
                    
                    return tratamientos.map((tratamiento) => (
                      <div key={tratamiento.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">{tratamiento.nombre}</p>
                        <p className="text-xl font-bold text-gray-900 mb-1">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(tratamiento.facturado)}
                        </p>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-600">Margen:</span>
                          <span className={`font-semibold ${tratamiento.margen >= 70 ? 'text-green-600' : tratamiento.margen >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {tratamiento.margen.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${tratamiento.color} h-2 rounded-full transition-all`}
                            style={{ width: `${tratamiento.margen}%` }}
                          ></div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Tabla de facturas recientes */}
            <FacturasRecientesTable
              facturas={facturasRecientes}
              loading={loading}
              onVerFactura={handleVerFactura}
            />
          </div>
        )}

        {activeTab === 'recibos' && <RecibosPagosPage />}
        {activeTab === 'anticipos' && <AnticiposPage />}
        {activeTab === 'comisiones' && <ComisionesProfesionalPage />}
        {activeTab === 'liquidacion' && <LiquidacionMutuasPage />}
        {activeTab === 'exportacion' && <ExportacionContabilidadPage />}
      </div>
    </div>
  );
}

