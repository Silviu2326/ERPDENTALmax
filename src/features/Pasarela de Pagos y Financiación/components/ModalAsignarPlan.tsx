import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PlanFinanciacion, AsignarPlanRequest, asignarPlanAPaciente } from '../api/financiacionApi';
import SelectorDePlan from './SelectorDePlan';
import TablaAmortizacionDetallada from './TablaAmortizacionDetallada';

interface ModalAsignarPlanProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: string;
  presupuestoId: string;
  montoPresupuesto: number;
  onAsignacionExitosa?: () => void;
}

export default function ModalAsignarPlan({
  isOpen,
  onClose,
  pacienteId,
  presupuestoId,
  montoPresupuesto,
  onAsignacionExitosa,
}: ModalAsignarPlanProps) {
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanFinanciacion | null>(null);
  const [planId, setPlanId] = useState<string>('');
  const [montoAFinanciar, setMontoAFinanciar] = useState<number>(montoPresupuesto);
  const [numeroCuotas, setNumeroCuotas] = useState<number>(12);
  const [montoEntrada, setMontoEntrada] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulacion, setSimulacion] = useState<any>(null);
  const [cargandoSimulacion, setCargandoSimulacion] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (planId) {
      cargarPlanYSimular();
    } else {
      setPlanSeleccionado(null);
      setSimulacion(null);
    }
  }, [planId, montoAFinanciar, numeroCuotas, montoEntrada]);

  const resetForm = () => {
    setPlanId('');
    setPlanSeleccionado(null);
    setMontoAFinanciar(montoPresupuesto);
    setNumeroCuotas(12);
    setMontoEntrada(0);
    setError(null);
    setSimulacion(null);
  };

  const cargarPlanYSimular = async () => {
    if (!planId) return;

    setCargandoSimulacion(true);
    setError(null);

    try {
      // En una implementación real, aquí se haría una llamada al backend para obtener el plan y simular
      // Por ahora, simulamos la lógica
      const response = await fetch(`http://localhost:3000/api/financiacion/plantillas/${planId}`, {
        credentials: 'include',
      });
      const plan: PlanFinanciacion = await response.json();
      setPlanSeleccionado(plan);

      // Validaciones
      if (montoAFinanciar < plan.montoMinimo || montoAFinanciar > plan.montoMaximo) {
        setError(`El monto debe estar entre €${plan.montoMinimo} y €${plan.montoMaximo}`);
        setSimulacion(null);
        return;
      }

      if (numeroCuotas < plan.numeroCuotasMin || numeroCuotas > plan.numeroCuotasMax) {
        setError(`El número de cuotas debe estar entre ${plan.numeroCuotasMin} y ${plan.numeroCuotasMax}`);
        setSimulacion(null);
        return;
      }

      if (plan.requiereEntrada && (!montoEntrada || montoEntrada <= 0)) {
        setError(`Este plan requiere un pago inicial`);
        setSimulacion(null);
        return;
      }

      // Simular cálculo (en producción esto vendría del backend)
      const montoFinanciado = montoAFinanciar - (montoEntrada || 0);
      const tasaMensual = plan.tasaInteresAnual / 100 / 12;
      const cuotaMensual = (montoFinanciado * tasaMensual * Math.pow(1 + tasaMensual, numeroCuotas)) /
        (Math.pow(1 + tasaMensual, numeroCuotas) - 1);

      // Generar tabla de amortización simulada
      const tablaAmortizacion = [];
      let capitalPendiente = montoFinanciado;
      const fechaInicio = new Date();

      for (let i = 1; i <= numeroCuotas; i++) {
        const interes = capitalPendiente * tasaMensual;
        const capital = cuotaMensual - interes;
        capitalPendiente -= capital;

        const fechaVencimiento = new Date(fechaInicio);
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i);

        tablaAmortizacion.push({
          numeroCuota: i,
          fechaVencimiento: fechaVencimiento.toISOString(),
          capital: capital,
          interes: interes,
          totalCuota: cuotaMensual,
          capitalPendiente: Math.max(0, capitalPendiente),
          estadoPago: 'pendiente',
        });
      }

      setSimulacion({
        montoTotalFinanciado: montoFinanciado,
        montoCuota: cuotaMensual,
        tablaAmortizacion,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el plan');
    } finally {
      setCargandoSimulacion(false);
    }
  };

  const handleAsignar = async () => {
    if (!planId || !simulacion) return;

    setLoading(true);
    setError(null);

    try {
      const request: AsignarPlanRequest = {
        plantillaId: planId,
        pacienteId,
        presupuestoId,
        montoAFinanciar,
        numeroCuotas,
        montoEntrada: planSeleccionado?.requiereEntrada ? montoEntrada : undefined,
      };

      await asignarPlanAPaciente(request);
      onAsignacionExitosa?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar el plan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Asignar Plan de Financiación</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Información del Presupuesto */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Información del Presupuesto</h3>
            <p className="text-sm text-blue-800">
              Monto Total: <span className="font-bold">€{montoPresupuesto.toFixed(2)}</span>
            </p>
          </div>

          {/* Selección de Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Plan de Financiación <span className="text-red-500">*</span>
            </label>
            <SelectorDePlan
              value={planId}
              onChange={setPlanId}
              filtros={{ estado: 'activo' }}
            />
          </div>

          {planSeleccionado && (
            <>
              {/* Monto a Financiar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto a Financiar (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={planSeleccionado.montoMinimo}
                    max={planSeleccionado.montoMaximo}
                    value={montoAFinanciar}
                    onChange={(e) => setMontoAFinanciar(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rango: €{planSeleccionado.montoMinimo} - €{planSeleccionado.montoMaximo}
                  </p>
                </div>

                {/* Número de Cuotas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Cuotas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={planSeleccionado.numeroCuotasMin}
                    max={planSeleccionado.numeroCuotasMax}
                    value={numeroCuotas}
                    onChange={(e) => setNumeroCuotas(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rango: {planSeleccionado.numeroCuotasMin} - {planSeleccionado.numeroCuotasMax} cuotas
                  </p>
                </div>

                {/* Monto de Entrada */}
                {planSeleccionado.requiereEntrada && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto de Entrada (€) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={montoAFinanciar}
                      value={montoEntrada}
                      onChange={(e) => setMontoEntrada(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {planSeleccionado.porcentajeEntrada && (
                      <p className="text-xs text-gray-500 mt-1">
                        Mínimo recomendado: {((montoAFinanciar * planSeleccionado.porcentajeEntrada) / 100).toFixed(2)}€ ({planSeleccionado.porcentajeEntrada}%)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Simulación */}
              {cargandoSimulacion && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Calculando simulación...</span>
                </div>
              )}

              {simulacion && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Resumen de la Financiación</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-green-700">Monto Financiado</p>
                        <p className="text-lg font-bold text-green-900">
                          €{simulacion.montoTotalFinanciado.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700">Cuota Mensual</p>
                        <p className="text-lg font-bold text-green-900">
                          €{simulacion.montoCuota.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700">Número de Cuotas</p>
                        <p className="text-lg font-bold text-green-900">{numeroCuotas}</p>
                      </div>
                    </div>
                  </div>

                  <TablaAmortizacionDetallada tablaAmortizacion={simulacion.tablaAmortizacion} />
                </div>
              )}
            </>
          )}

          {/* Botones */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAsignar}
              disabled={loading || !simulacion || !planId}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Asignando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Asignar Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


