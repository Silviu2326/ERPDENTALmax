import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Loader2, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando financiaciones...</p>
        </div>
      </div>
    );
  }

  const resumen = getResumenFinanciacion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Financiación</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Consulta el estado de tus planes de financiación y calendario de pagos
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {financiaciones.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes financiaciones activas
            </h3>
            <p className="text-gray-600">
              Consulta con la clínica sobre los planes de financiación disponibles
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lista de Financiaciones */}
            {financiaciones.length > 1 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Mis Financiaciones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {/* Resumen */}
                {resumen && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <h3 className="text-sm font-medium text-gray-600">Cuotas Pagadas</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {resumen.cuotasPagadas} / {financiacionSeleccionada.numeroCuotas}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {((resumen.cuotasPagadas / financiacionSeleccionada.numeroCuotas) * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <h3 className="text-sm font-medium text-gray-600">Capital Pendiente</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        €{resumen.capitalPendiente.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        de €{financiacionSeleccionada.montoTotalFinanciado.toFixed(2)} total
                      </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <CreditCard className="w-6 h-6 text-indigo-600" />
                        <h3 className="text-sm font-medium text-gray-600">Próxima Cuota</h3>
                      </div>
                      {resumen.cuotasPendientes > 0 ? (
                        <>
                          <p className="text-2xl font-bold text-gray-900">
                            €{financiacionSeleccionada.montoCuota.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {resumen.cuotasPendientes} cuotas pendientes
                          </p>
                        </>
                      ) : (
                        <p className="text-lg font-semibold text-green-600">Todas pagadas</p>
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
          </div>
        )}
      </div>
    </div>
  );
}


