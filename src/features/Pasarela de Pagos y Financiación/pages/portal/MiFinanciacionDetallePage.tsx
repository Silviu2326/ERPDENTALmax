import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Loader2, AlertCircle, CheckCircle2, Calendar, Package } from 'lucide-react';
import { obtenerFinanciacionesPorPaciente, obtenerDetalleFinanciacion, FinanciacionPaciente } from '../../api/financiacionApi';
import CardResumenFinanciacionPaciente from '../../components/CardResumenFinanciacionPaciente';
import TablaAmortizacionDetallada from '../../components/TablaAmortizacionDetallada';

interface MiFinanciacionDetallePageProps {
  pacienteId: string;
  financiacionId?: string;
  onVolver?: () => void;
}

export default function MiFinanciacionDetallePage({
  pacienteId,
  financiacionId,
  onVolver,
}: MiFinanciacionDetallePageProps) {
  const [financiaciones, setFinanciaciones] = useState<FinanciacionPaciente[]>([]);
  const [financiacionSeleccionada, setFinanciacionSeleccionada] = useState<FinanciacionPaciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarFinanciaciones();
  }, [pacienteId]);

  useEffect(() => {
    if (financiacionId && financiaciones.length > 0) {
      const financiacion = financiaciones.find((f) => f._id === financiacionId);
      if (financiacion) {
        cargarDetalleFinanciacion(financiacionId);
      }
    }
  }, [financiacionId, financiaciones]);

  const cargarFinanciaciones = async () => {
    setLoading(true);
    setError(null);

    try {
      const financiacionesData = await obtenerFinanciacionesPorPaciente(pacienteId);
      setFinanciaciones(financiacionesData);

      // Si hay una financiación específica, cargarla
      if (financiacionId) {
        await cargarDetalleFinanciacion(financiacionId);
      } else if (financiacionesData.length > 0) {
        // Por defecto, mostrar la primera financiación activa
        const activa = financiacionesData.find((f) => f.estado === 'activo');
        if (activa) {
          await cargarDetalleFinanciacion(activa._id!);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las financiaciones');
    } finally {
      setLoading(false);
    }
  };

  const cargarDetalleFinanciacion = async (id: string) => {
    try {
      const detalle = await obtenerDetalleFinanciacion(id);
      setFinanciacionSeleccionada(detalle);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle de la financiación');
    }
  };

  const handleSeleccionarFinanciacion = async (financiacion: FinanciacionPaciente) => {
    if (financiacion._id) {
      await cargarDetalleFinanciacion(financiacion._id);
    }
  };

  const getResumenFinanciacion = () => {
    if (!financiacionSeleccionada) return null;

    const cuotasPagadas = financiacionSeleccionada.tablaAmortizacion.filter(
      (c) => c.estadoPago === 'pagada'
    ).length;
    const cuotasPendientes = financiacionSeleccionada.tablaAmortizacion.filter(
      (c) => c.estadoPago === 'pendiente'
    ).length;
    const cuotasVencidas = financiacionSeleccionada.tablaAmortizacion.filter(
      (c) => c.estadoPago === 'vencida' || c.estadoPago === 'mora'
    ).length;

    const capitalPagado = financiacionSeleccionada.tablaAmortizacion
      .filter((c) => c.estadoPago === 'pagada')
      .reduce((sum, c) => sum + c.capital, 0);
    const capitalPendiente = financiacionSeleccionada.montoTotalFinanciado - capitalPagado;

    const totalPagado = financiacionSeleccionada.tablaAmortizacion
      .filter((c) => c.estadoPago === 'pagada')
      .reduce((sum, c) => sum + c.totalCuota, 0);
    const totalPendiente = financiacionSeleccionada.tablaAmortizacion
      .filter((c) => c.estadoPago !== 'pagada')
      .reduce((sum, c) => sum + c.totalCuota, 0);

    return {
      cuotasPagadas,
      cuotasPendientes,
      cuotasVencidas,
      capitalPagado,
      capitalPendiente,
      totalPagado,
      totalPendiente,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando financiaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  const resumen = getResumenFinanciacion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                  aria-label="Volver"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <CreditCard size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Mi Financiación
                </h1>
                <p className="text-gray-600">
                  Consulta el estado de tus planes de financiación y calendario de pagos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {error && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          )}

          {financiaciones.length === 0 ? (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tienes financiaciones activas
              </h3>
              <p className="text-gray-600">
                Consulta con la clínica sobre los planes de financiación disponibles
              </p>
            </div>
          ) : (
            <>
              {/* Lista de Financiaciones */}
              {financiaciones.length > 1 && (
                <div className="bg-white shadow-sm rounded-xl p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Mis Financiaciones</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {financiaciones.map((financiacion) => (
                      <CardResumenFinanciacionPaciente
                        key={financiacion._id}
                        financiacion={financiacion}
                        onClick={() => handleSeleccionarFinanciacion(financiacion)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Detalle de Financiación Seleccionada */}
              {financiacionSeleccionada && (
                <div className="space-y-6">
                  {/* Resumen - Métricas */}
                  {resumen && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-green-200 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-slate-700">Cuotas Pagadas</h3>
                          <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle2 size={20} className="text-green-600" />
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-2xl font-bold text-green-600">
                            {resumen.cuotasPagadas} / {financiacionSeleccionada.numeroCuotas}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {((resumen.cuotasPagadas / financiacionSeleccionada.numeroCuotas) * 100).toFixed(1)}% completado
                        </p>
                      </div>

                      <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-blue-200 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-slate-700">Capital Pendiente</h3>
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Calendar size={20} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-2xl font-bold text-blue-600">
                            €{resumen.capitalPendiente.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          de €{financiacionSeleccionada.montoTotalFinanciado.toFixed(2)} total
                        </p>
                      </div>

                      <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-blue-200 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-slate-700">Próxima Cuota</h3>
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <CreditCard size={20} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          {resumen.cuotasPendientes > 0 ? (
                            <>
                              <span className="text-2xl font-bold text-blue-600">
                                €{financiacionSeleccionada.montoCuota.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-semibold text-green-600">Todas pagadas</span>
                          )}
                        </div>
                        {resumen.cuotasPendientes > 0 && (
                          <p className="text-xs text-gray-600">
                            {resumen.cuotasPendientes} cuotas pendientes
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tabla de Amortización */}
                  <TablaAmortizacionDetallada
                    tablaAmortizacion={financiacionSeleccionada.tablaAmortizacion}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}



