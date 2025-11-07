import { useState, useEffect, useMemo } from 'react';
import { DollarSign, Plus, AlertCircle, ChevronLeft, ChevronRight, Download, CheckCircle, Clock, AlertTriangle, TrendingUp, BarChart3, PieChart, Receipt, Loader2 } from 'lucide-react';
import {
  obtenerPagosSeguro,
  PagoSeguro,
  FiltrosPagosSeguro,
  PaginatedResponse,
} from '../api/pagosSeguroApi';
import FiltrosHistorialPagos from '../components/FiltrosHistorialPagos';
import TablaPagosSeguro from '../components/TablaPagosSeguro';
import ModalDetallePagoSeguro from '../components/ModalDetallePagoSeguro';

export default function HistorialPagosSeguroPage() {
  const [pagos, setPagos] = useState<PagoSeguro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosPagosSeguro>({
    page: 1,
    limit: 10,
    sortBy: '-fechaPago', // Ordenar por fecha más reciente primero
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    currentPage: 1,
    totalCount: 0,
  });
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoSeguro | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);

  const cargarPagos = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta: PaginatedResponse<PagoSeguro> = await obtenerPagosSeguro(filtros);
      setPagos(respuesta.data);
      setPaginacion({
        total: respuesta.total,
        page: respuesta.page,
        limit: respuesta.limit,
        totalPages: respuesta.totalPages,
        currentPage: respuesta.currentPage,
        totalCount: respuesta.totalCount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial de pagos');
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPagos();
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosPagosSeguro) => {
    setFiltros((prev) => ({
      ...prev,
      ...nuevosFiltros,
    }));
  };

  const handlePageChange = (page: number) => {
    setFiltros((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleVerDetalle = (pago: PagoSeguro) => {
    setPagoSeleccionado(pago);
    setMostrarModalDetalle(true);
  };

  const handleCerrarModal = () => {
    setMostrarModalDetalle(false);
    setPagoSeleccionado(null);
  };

  const handleExportar = () => {
    // TODO: Implementar exportación a CSV/PDF
    console.log('Exportar pagos', pagos);
  };

  const calcularTotalPagos = () => {
    return pagos.reduce((sum, pago) => sum + pago.montoTotal, 0);
  };

  const calcularEstadisticas = () => {
    const total = pagos.length;
    const totalMonto = calcularTotalPagos();
    const conciliados = pagos.filter(p => p.estado === 'conciliado').length;
    const pendientes = pagos.filter(p => p.estado === 'pendiente').length;
    const parciales = pagos.filter(p => p.estado === 'parcial').length;
    const montoConciliado = pagos
      .filter(p => p.estado === 'conciliado')
      .reduce((sum, p) => sum + p.montoTotal, 0);
    const montoPendiente = pagos
      .filter(p => p.estado === 'pendiente')
      .reduce((sum, p) => sum + p.montoTotal, 0);
    const montoParcial = pagos
      .filter(p => p.estado === 'parcial')
      .reduce((sum, p) => sum + p.montoTotal, 0);

    // Estadísticas por aseguradora
    const porAseguradora = pagos.reduce((acc, pago) => {
      const nombre = pago.aseguradora?.nombreComercial || 'Desconocida';
      if (!acc[nombre]) {
        acc[nombre] = { nombre, total: 0, monto: 0, conciliados: 0, pendientes: 0 };
      }
      acc[nombre].total += 1;
      acc[nombre].monto += pago.montoTotal;
      if (pago.estado === 'conciliado') acc[nombre].conciliados += 1;
      if (pago.estado === 'pendiente') acc[nombre].pendientes += 1;
      return acc;
    }, {} as Record<string, { nombre: string; total: number; monto: number; conciliados: number; pendientes: number }>);

    // Estadísticas por método de pago
    const porMetodoPago = pagos.reduce((acc, pago) => {
      const metodo = pago.metodoPago;
      if (!acc[metodo]) {
        acc[metodo] = { metodo, total: 0, monto: 0 };
      }
      acc[metodo].total += 1;
      acc[metodo].monto += pago.montoTotal;
      return acc;
    }, {} as Record<string, { metodo: string; total: number; monto: number }>);

    return {
      total,
      totalMonto,
      conciliados,
      pendientes,
      parciales,
      montoConciliado,
      montoPendiente,
      montoParcial,
      porAseguradora: Object.values(porAseguradora).sort((a, b) => b.monto - a.monto),
      porMetodoPago: Object.values(porMetodoPago),
    };
  };

  const estadisticas = useMemo(() => calcularEstadisticas(), [pagos]);

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
                  <Receipt size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Historial de Pagos de Seguros
                  </h1>
                  <p className="text-gray-600">
                    Control y seguimiento de todos los pagos recibidos de aseguradoras
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportar}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200"
                >
                  <Download size={20} />
                  Exportar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Tarjetas de Métricas */}
          {pagos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-700">Total de Pagos</div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign size={20} className="text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{estadisticas.total}</div>
                <div className="text-xs text-slate-600 mt-2">
                  Página {paginacion.page} de {paginacion.totalPages || 1}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-700">Monto Total</div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  }).format(estadisticas.totalMonto)}
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  {estadisticas.total > 0 
                    ? `Promedio: ${new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0,
                      }).format(estadisticas.totalMonto / estadisticas.total)}`
                    : 'En esta página'}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-700">Conciliados</div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{estadisticas.conciliados}</div>
                <div className="text-xs text-slate-600 mt-2">
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  }).format(estadisticas.montoConciliado)}
                  {estadisticas.total > 0 && (
                    <span className="block mt-1">
                      ({Math.round((estadisticas.conciliados / estadisticas.total) * 100)}% del total)
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-700">Pendientes</div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock size={20} className="text-yellow-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{estadisticas.pendientes}</div>
                <div className="text-xs text-slate-600 mt-2">
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  }).format(estadisticas.montoPendiente)}
                  {estadisticas.parciales > 0 && (
                    <span className="block mt-1">
                      + {estadisticas.parciales} parciales
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Gráficos y análisis adicionales */}
          {pagos.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribución por Aseguradora */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={20} className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Distribución por Aseguradora</h3>
                </div>
                <div className="space-y-4">
                  {estadisticas.porAseguradora.slice(0, 5).map((aseg, index) => {
                    const porcentaje = (aseg.monto / estadisticas.totalMonto) * 100;
                    return (
                      <div key={aseg.nombre} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{aseg.nombre}</span>
                          <span className="text-slate-600">
                            {new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                              maximumFractionDigits: 0,
                            }).format(aseg.monto)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{aseg.total} pagos</span>
                          <span>{porcentaje.toFixed(1)}% del total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Distribución por Método de Pago */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart size={20} className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Método de Pago</h3>
                </div>
                <div className="space-y-4">
                  {estadisticas.porMetodoPago.map((metodo) => {
                    const porcentaje = (metodo.monto / estadisticas.totalMonto) * 100;
                    const metodoLabel = metodo.metodo === 'transferencia' ? 'Transferencia' : 
                                       metodo.metodo === 'cheque' ? 'Cheque' : 'Otro';
                    return (
                      <div key={metodo.metodo} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{metodoLabel}</span>
                          <span className="text-slate-600">
                            {new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                              maximumFractionDigits: 0,
                            }).format(metodo.monto)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{metodo.total} pagos</span>
                          <span>{porcentaje.toFixed(1)}% del total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-red-200">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle size={20} className="flex-shrink-0 text-red-500" />
                <span className="text-sm">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Filtros */}
          <FiltrosHistorialPagos filtros={filtros} onFiltrosChange={handleFiltrosChange} />

          {/* Tabla de pagos */}
          <TablaPagosSeguro
            pagos={pagos}
            loading={loading}
            onVerDetalle={handleVerDetalle}
          />

          {/* Paginación */}
          {paginacion.totalPages > 1 && (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-600">
                  Mostrando {pagos.length} de {paginacion.totalCount} pagos
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(paginacion.page - 1)}
                    disabled={paginacion.page === 1}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: paginacion.totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === paginacion.totalPages ||
                          (page >= paginacion.page - 1 && page <= paginacion.page + 1)
                      )
                      .map((page, index, array) => (
                        <div key={page} className="flex items-center gap-1">
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-slate-400">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              paginacion.page === page
                                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(paginacion.page + 1)}
                    disabled={paginacion.page === paginacion.totalPages}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      {mostrarModalDetalle && (
        <ModalDetallePagoSeguro
          pago={pagoSeleccionado}
          onCerrar={handleCerrarModal}
        />
      )}
    </div>
  );
}


