import { useState, useEffect } from 'react';
import { CreditCard, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import StripePaymentElement from './integrations/StripePaymentElement';
import { crearIntentoPago, confirmarPago, CreatePaymentIntentRequest } from '../api/pagosApi';

interface FormularioPagoTarjetaProps {
  monto: number;
  moneda?: string;
  pacienteId: string;
  facturaIds?: string[];
  onPagoExitoso: (pagoId: string) => void;
  onError: (error: string) => void;
  onCancelar?: () => void;
}

export default function FormularioPagoTarjeta({
  monto,
  moneda = 'EUR',
  pacienteId,
  facturaIds = [],
  onPagoExitoso,
  onError,
  onCancelar,
}: FormularioPagoTarjetaProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pagoId, setPagoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [creandoIntent, setCreandoIntent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear intento de pago al montar el componente
  useEffect(() => {
    if (monto > 0 && pacienteId) {
      crearPaymentIntent();
    }
  }, [monto, moneda, pacienteId]);

  const crearPaymentIntent = async () => {
    setCreandoIntent(true);
    setError(null);

    try {
      const datos: CreatePaymentIntentRequest = {
        monto,
        moneda,
        pacienteId,
        facturaIds,
      };

      const response = await crearIntentoPago(datos);
      setClientSecret(response.clientSecret);
      setPagoId(response.pagoId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al inicializar el pago';
      setError(errorMsg);
      onError(errorMsg);
    } finally {
      setCreandoIntent(false);
    }
  };

  const handleStripeSuccess = async (paymentIntentId: string) => {
    if (!pagoId) {
      const errorMsg = 'No se pudo identificar el pago';
      setError(errorMsg);
      onError(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await confirmarPago({
        pagoId,
        gatewayTransactionId: paymentIntentId,
      });

      if (response.status === 'success') {
        onPagoExitoso(pagoId);
      } else {
        throw new Error(response.message || 'Error al confirmar el pago');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al confirmar el pago';
      setError(errorMsg);
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleStripeError = (errorMsg: string) => {
    setError(errorMsg);
    onError(errorMsg);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Pago con Tarjeta</h3>
            <p className="text-sm text-gray-600">Monto: {moneda} {monto.toFixed(2)}</p>
          </div>
        </div>
        {onCancelar && (
          <button
            onClick={onCancelar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading || creandoIntent}
          >
            <span className="text-gray-500">✕</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {creandoIntent ? (
        <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Inicializando pasarela de pago...</p>
          <p className="text-xs text-gray-500">Preparando el formulario de pago seguro</p>
        </div>
      ) : clientSecret ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pago seguro:</strong> Tus datos de tarjeta se procesan de forma segura
              a través de nuestra pasarela de pagos certificada. No almacenamos información
              sensible de tu tarjeta.
            </p>
          </div>

          <StripePaymentElement
            clientSecret={clientSecret}
            onSuccess={handleStripeSuccess}
            onError={handleStripeError}
            amount={monto}
            currency={moneda}
          />

          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <p className="text-sm text-blue-800">Confirmando pago...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Por favor, espera mientras se inicializa el sistema de pago.
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <CheckCircle2 className="w-4 h-4" />
          <span>Protegido por encriptación SSL y cumplimiento PCI DSS</span>
        </div>
      </div>
    </div>
  );
}


