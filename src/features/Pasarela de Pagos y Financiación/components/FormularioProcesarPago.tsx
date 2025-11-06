import { useState, useEffect } from 'react';
import { Save, X, Loader2, AlertCircle } from 'lucide-react';
import SelectorMetodoPago, { MetodoPago } from './SelectorMetodoPago';
import StripePaymentElement from './integrations/StripePaymentElement';
import { createPaymentIntent, procesarPago, ProcesarPagoRequest } from '../api/pagoApi';
import { Tratamiento } from '../api/pagoApi';

interface FormularioProcesarPagoProps {
  pacienteId: string | null;
  tratamientosSeleccionados: Tratamiento[];
  totalSeleccionado: number;
  onPagoExitoso: () => void;
  onCancelar: () => void;
}

export default function FormularioProcesarPago({
  pacienteId,
  tratamientosSeleccionados,
  totalSeleccionado,
  onPagoExitoso,
  onCancelar,
}: FormularioProcesarPagoProps) {
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [montoManual, setMontoManual] = useState<string>('');
  const [montoRecibido, setMontoRecibido] = useState<string>('');
  const [notas, setNotas] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creandoIntent, setCreandoIntent] = useState(false);

  // Usar el total seleccionado por defecto
  useEffect(() => {
    if (totalSeleccionado > 0) {
      setMontoManual(totalSeleccionado.toFixed(2));
    }
  }, [totalSeleccionado]);

  // Crear payment intent cuando se selecciona tarjeta
  useEffect(() => {
    if (metodoPago === 'Tarjeta' && pacienteId && tratamientosSeleccionados.length > 0) {
      const monto = parseFloat(montoManual) || totalSeleccionado;
      if (monto > 0) {
        setCreandoIntent(true);
        createPaymentIntent({ monto, moneda: 'EUR' })
          .then((intent) => {
            setClientSecret(intent.clientSecret);
            setError(null);
          })
          .catch((err) => {
            setError(err.message || 'Error al inicializar el pago con tarjeta');
            setClientSecret(null);
          })
          .finally(() => {
            setCreandoIntent(false);
          });
      }
    } else {
      setClientSecret(null);
    }
  }, [metodoPago, pacienteId, montoManual, totalSeleccionado, tratamientosSeleccionados.length]);

  const handleProcesarPago = async (paymentIntentId?: string) => {
    if (!pacienteId || !metodoPago || tratamientosSeleccionados.length === 0) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    const monto = parseFloat(montoManual) || totalSeleccionado;
    if (monto <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    // Validar monto recibido para efectivo
    if (metodoPago === 'Efectivo') {
      const recibido = parseFloat(montoRecibido);
      if (!recibido || recibido < monto) {
        setError('El monto recibido debe ser mayor o igual al monto a pagar');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const datosPago: ProcesarPagoRequest = {
        pacienteId,
        monto,
        metodoPago,
        tratamientosIds: tratamientosSeleccionados.map((t) => t._id),
        notas: notas.trim() || undefined,
        paymentMethodId: paymentIntentId,
      };

      await procesarPago(datosPago);
      onPagoExitoso();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSuccess = (paymentIntentId: string) => {
    handleProcesarPago(paymentIntentId);
  };

  const handleStripeError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const calcularCambio = (): number => {
    if (metodoPago === 'Efectivo' && montoRecibido) {
      const recibido = parseFloat(montoRecibido);
      const monto = parseFloat(montoManual) || totalSeleccionado;
      return Math.max(0, recibido - monto);
    }
    return 0;
  };

  const monto = parseFloat(montoManual) || totalSeleccionado;
  const cambio = calcularCambio();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">Procesar Pago</h3>
        <button
          onClick={onCancelar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Selector de método de pago */}
        <SelectorMetodoPago
          metodoSeleccionado={metodoPago}
          onMetodoChange={setMetodoPago}
          disabled={loading}
        />

        {/* Monto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto a Pagar (€) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={montoManual}
            onChange={(e) => setMontoManual(e.target.value)}
            disabled={loading || !metodoPago}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="0.00"
          />
          {totalSeleccionado > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Total de tratamientos seleccionados: €{totalSeleccionado.toFixed(2)}
            </p>
          )}
        </div>

        {/* Monto recibido (solo para efectivo) */}
        {metodoPago === 'Efectivo' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto Recibido (€) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={montoRecibido}
              onChange={(e) => setMontoRecibido(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0.00"
            />
            {cambio > 0 && (
              <p className="text-sm text-green-600 font-semibold mt-1">
                Cambio: €{cambio.toFixed(2)}
              </p>
            )}
          </div>
        )}

        {/* Stripe Payment Element (solo para tarjeta) */}
        {metodoPago === 'Tarjeta' && (
          <div>
            {creandoIntent ? (
              <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Inicializando pasarela de pago...</span>
              </div>
            ) : clientSecret ? (
              <StripePaymentElement
                clientSecret={clientSecret}
                onSuccess={handleStripeSuccess}
                onError={handleStripeError}
                amount={monto}
                currency="EUR"
              />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Por favor, ingresa un monto válido para continuar con el pago con tarjeta.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            disabled={loading}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Notas adicionales sobre el pago..."
          />
        </div>

        {/* Botones de acción */}
        {metodoPago !== 'Tarjeta' && (
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onCancelar}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleProcesarPago()}
              disabled={loading || !metodoPago || !pacienteId || tratamientosSeleccionados.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Procesar Pago</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


