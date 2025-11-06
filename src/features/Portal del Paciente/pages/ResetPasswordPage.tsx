import AuthLayout from '../components/AuthLayout';
import ResetPasswordForm from '../components/ResetPasswordForm';
import { AlertCircle } from 'lucide-react';

interface ResetPasswordPageProps {
  token?: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export default function ResetPasswordPage({ token, onSuccess, onBack }: ResetPasswordPageProps) {
  const handleSuccess = () => {
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  };

  const handleError = (error: string) => {
    // El error ya se muestra en el formulario
    console.error('Error al restablecer contraseña:', error);
  };

  if (!token) {
    return (
      <AuthLayout
        title="Token Inválido"
        subtitle="El enlace de recuperación no es válido"
      >
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Token no válido o expirado</p>
              <p>
                El enlace de recuperación de contraseña no es válido o ha expirado. 
                Por favor, solicita un nuevo enlace de recuperación.
              </p>
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
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Restablecer Contraseña"
      subtitle="Ingresa tu nueva contraseña"
    >
      <ResetPasswordForm
        token={token}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </AuthLayout>
  );
}

