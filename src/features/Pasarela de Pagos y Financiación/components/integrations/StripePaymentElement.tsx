import { useEffect, useRef, useState } from 'react';
import { loadStripe, StripeElementsOptions, PaymentElement } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { AlertCircle, Loader2 } from 'lucide-react';

// Cargar Stripe con la clave pública (debe estar en variables de entorno)
const stripePromise = loadStripe(
  (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...'
);

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  amount: number;
  currency?: string;
}

function StripePaymentForm({ clientSecret, onSuccess, onError, amount }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Error al procesar el pago');
        onError(error.message || 'Error al procesar el pago');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error inesperado al procesar el pago';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Procesando...</span>
          </>
        ) : (
          <span>Pagar {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)}</span>
        )}
      </button>
    </form>
  );
}

interface StripePaymentElementProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  amount: number;
  currency?: string;
}

export default function StripePaymentElement({
  clientSecret,
  onSuccess,
  onError,
  amount,
  currency = 'EUR',
}: StripePaymentElementProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#dc2626',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="w-full">
      <Elements options={options} stripe={stripePromise}>
        <StripePaymentForm
          clientSecret={clientSecret}
          onSuccess={onSuccess}
          onError={onError}
          amount={amount}
          currency={currency}
        />
      </Elements>
    </div>
  );
}


