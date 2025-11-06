import { useEffect, useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import { verificarEmail } from '../api/authApi';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface VerifyEmailPageProps {
  token?: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export default function VerifyEmailPage({ token, onSuccess, onBack }: VerifyEmailPageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmailAsync = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token no válido');
        return;
      }

      try {
        const response = await verificarEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verificado exitosamente');
        
        // Redirigir al login después de 3 segundos
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 3000);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error al verificar el email');
      }
    };

    verifyEmailAsync();
  }, [token, onSuccess]);

  return (
    <AuthLayout
      title="Verificación de Email"
      subtitle={status === 'loading' ? 'Verificando...' : status === 'success' ? 'Email verificado' : 'Error en la verificación'}
    >
      <div className="space-y-6">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-600">Verificando tu email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">¡Email verificado exitosamente!</p>
              <p>{message}</p>
              <p className="mt-2">Redirigiendo al inicio de sesión...</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Error en la verificación</p>
                <p>{message}</p>
              </div>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                Volver al inicio de sesión
              </button>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

